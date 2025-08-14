#!/bin/bash
# Fast PostgreSQL setup - should complete in under 1 minute

echo "=== Fast PostgreSQL Setup ==="

# Install Docker (fastest method)
sudo apt-get update -y > /dev/null 2>&1
sudo apt-get install -y docker.io docker-compose > /dev/null 2>&1

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Create minimal docker-compose
mkdir -p /opt/coolanu
cd /opt/coolanu

cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:15.7
    container_name: coolanu-postgres
    environment:
      POSTGRES_DB: coolanu
      POSTGRES_USER: coolanu
      POSTGRES_PASSWORD: coolanu123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
EOF

# Start PostgreSQL
sudo docker-compose up -d

echo "PostgreSQL should be running on port 5432"
echo "Database: coolanu, User: coolanu, Password: coolanu123"

