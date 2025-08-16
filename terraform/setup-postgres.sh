#!/bin/bash

# Setup script for PostgreSQL on EC2
set -e

echo "=== Starting PostgreSQL Setup ==="

# Update system
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
echo "Installing required packages..."
sudo apt-get install -y \
    docker.io \
    docker-compose \
    postgresql-client \
    htop \
    unzip \
    curl \
    wget \
    git \
    tree \
    vim \
    nginx \
    certbot \
    python3-certbot-nginx

# Start and enable Docker
echo "Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Create application directory
mkdir -p /opt/coolanu
cd /opt/coolanu

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15.7
    container_name: coolanu-postgres
    environment:
      POSTGRES_DB: coolanu
      POSTGRES_USER: coolanu_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-your_secure_password_here}
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --lc-collate=C --lc-ctype=C"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
      - ./init-scripts:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U coolanu_user -d coolanu"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: coolanu-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@coolanu.com
      PGADMIN_DEFAULT_PASSWORD: admin123
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    ports:
      - "5050:80"
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
    driver: local
  pgadmin_data:
    driver: local
EOF

# Create environment file
cat > .env << 'EOF'
DB_NAME=coolanu
DB_USER=coolanu_user
DB_PASSWORD=${DB_PASSWORD:-your_secure_password_here}
POSTGRES_DB=coolanu
POSTGRES_USER=coolanu_user
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-your_secure_password_here}
EOF

# Create backup directory
mkdir -p backups

# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash

# Database backup script
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/coolanu_backup_${TIMESTAMP}.sql"

echo "Creating backup: ${BACKUP_FILE}"

# Create backup
docker-compose exec -T postgres pg_dump -U coolanu_user -d coolanu --verbose --no-owner --no-privileges --clean --create > "${BACKUP_FILE}"

# Compress backup
gzip "${BACKUP_FILE}"

# Clean old backups (keep last 7 days)
find backups -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: ${BACKUP_FILE}.gz"
EOF

chmod +x backup.sh

# Create monitoring script
cat > monitor.sh << 'EOF'
#!/bin/bash

# Database monitoring script
echo "=== PostgreSQL Status ==="
docker-compose ps postgres

echo -e "\n=== Database Connections ==="
docker-compose exec -T postgres psql -U coolanu_user -d coolanu -c "SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active';"

echo -e "\n=== Database Size ==="
docker-compose exec -T postgres psql -U coolanu_user -d coolanu -c "SELECT pg_size_pretty(pg_database_size('coolanu'));"

echo -e "\n=== Table Sizes ==="
docker-compose exec -T postgres psql -U coolanu_user -d coolanu -c "
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;
"
EOF

chmod +x monitor.sh

# Start PostgreSQL
echo "Starting PostgreSQL..."
cd /opt/coolanu
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U coolanu_user -d coolanu > /dev/null 2>&1; do
    echo "Waiting for PostgreSQL..."
    sleep 5
done

echo "PostgreSQL is ready!"

# Create cron job for daily backups
echo "Setting up daily backup cron job..."
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/coolanu/backup.sh >> /var/log/coolanu-backup.log 2>&1") | crontab -

# Create log rotation for backup logs
cat > /etc/logrotate.d/coolanu-backup << 'EOF'
/var/log/coolanu-backup.log {
    daily
    missingok
    rotate 7
    compress
    notifempty
    create 644 root root
}
EOF

echo "=== Setup Complete ==="
echo "PostgreSQL is running on port 5432"
echo "PgAdmin is available at http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5050"
echo "Database credentials: coolanu_user/[HIDDEN]"
echo "Backup script: /opt/coolanu/backup.sh"
echo "Monitoring script: /opt/coolanu/monitor.sh"
echo "Logs: docker-compose logs -f postgres"
