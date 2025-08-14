#!/bin/bash

# User data script for EC2 instance with self-managed PostgreSQL
# This script runs when the instance first boots

set -e

# Update system
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install required packages
echo "Installing required packages..."
apt-get install -y \
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
systemctl start docker
systemctl enable docker

# Add ubuntu user to docker group
usermod -aG docker ubuntu

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
      POSTGRES_PASSWORD: coolanu123
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
    command: >
      postgres
      -c shared_preload_libraries='pg_stat_statements'
      -c pg_stat_statements.track=all
      -c max_connections=50
      -c shared_buffers=256MB
      -c effective_cache_size=1GB
      -c maintenance_work_mem=64MB
      -c checkpoint_completion_target=0.9
      -c wal_buffers=16MB
      -c default_statistics_target=100
      -c random_page_cost=1.1
      -c effective_io_concurrency=200
      -c work_mem=4MB
      -c min_wal_size=1GB
      -c max_wal_size=4GB
      -c log_statement=all
      -c log_min_duration_statement=1000
      -c log_checkpoints=on
      -c log_connections=on
      -c log_disconnections=on
      -c log_lock_waits=on
      -c log_temp_files=0
      -c log_autovacuum_min_duration=0
      -c log_error_verbosity=verbose
      -c log_line_prefix='%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
      -c log_destination='stderr'
      -c logging_collector=on
      -c log_directory='pg_log'
      -c log_filename='postgresql-%Y-%m-%d_%H%M%S.log'
      -c log_rotation_age=1d
      -c log_rotation_size=100MB
      -c log_truncate_on_rotation=on

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
DB_PASSWORD=coolanu123
POSTGRES_DB=coolanu
POSTGRES_USER=coolanu_user
POSTGRES_PASSWORD=coolanu123
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

# Create systemd service for automatic startup
cat > /etc/systemd/system/coolanu-postgres.service << 'EOF'
[Unit]
Description=Coolanu PostgreSQL Database
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/coolanu
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
systemctl daemon-reload
systemctl enable coolanu-postgres.service

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

# Install AWS CLI for S3 backups
echo "Installing AWS CLI..."
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install

# Clean up
rm -rf awscliv2.zip aws

# Create status check endpoint
cat > /var/www/html/health.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Coolanu PostgreSQL Health Check</title>
</head>
<body>
    <h1>Coolanu PostgreSQL Health Check</h1>
    <p>Status: <span id="status">Checking...</span></p>
    <script>
        fetch('/health')
            .then(response => response.json())
            .then(data => {
                document.getElementById('status').textContent = 'Healthy';
                document.getElementById('status').style.color = 'green';
            })
            .catch(error => {
                document.getElementById('status').textContent = 'Unhealthy';
                document.getElementById('status').style.color = 'red';
            });
    </script>
</body>
</html>
EOF

# Create health check endpoint
cat > /etc/nginx/sites-available/coolanu-health << 'EOF'
server {
    listen 80;
    server_name _;
    
    location /health {
        proxy_pass http://localhost:5432;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location / {
        root /var/www/html;
        index health.html;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/coolanu-health /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration and restart
nginx -t && systemctl restart nginx

echo "=== Setup Complete ==="
echo "PostgreSQL is running on port 5432"
echo "PgAdmin is available at http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5050"
echo "Health check available at http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)/health"
echo "Database credentials: coolanu_user/coolanu"
echo "Backup script: /opt/coolanu/backup.sh"
echo "Monitoring script: /opt/coolanu/monitor.sh"
echo "Logs: docker-compose logs -f postgres"
