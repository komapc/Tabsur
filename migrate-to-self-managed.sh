#!/bin/bash

# Migration Script: RDS to Self-Managed PostgreSQL
# This script migrates your database from AWS RDS to self-managed PostgreSQL on EC2

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SOURCE_DB_ENDPOINT="coolanu-final-eu-west-1.c83ccb9pqvdz.eu-west-1.rds.amazonaws.com"
SOURCE_DB_PORT="5432"
SOURCE_DB_NAME="coolanu"
SOURCE_DB_USER="coolanu_user"
SOURCE_DB_PASSWORD=""

TARGET_DB_HOST="localhost"
TARGET_DB_PORT="5432"
TARGET_DB_NAME="coolanu"
TARGET_DB_USER="coolanu_user"
TARGET_DB_PASSWORD=""

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/migration_backup_${TIMESTAMP}.sql"

echo -e "${BLUE}🚀 Starting Migration: RDS to Self-Managed PostgreSQL${NC}"
echo "=================================================="

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ psql is not installed. Please install PostgreSQL client first.${NC}"
    echo "Install with: sudo apt-get install postgresql-client"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Get source database password
echo -e "${YELLOW}🔐 Please enter the source RDS database password:${NC}"
read -s SOURCE_DB_PASSWORD
echo

# Test source database connection
echo -e "${YELLOW}🔍 Testing source database connection...${NC}"
if ! PGPASSWORD="${SOURCE_DB_PASSWORD}" psql -h "${SOURCE_DB_ENDPOINT}" -p "${SOURCE_DB_PORT}" -U "${SOURCE_DB_USER}" -d "${SOURCE_DB_NAME}" -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${RED}❌ Cannot connect to source database. Please check credentials and network.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Source database connection successful${NC}"

# Start PostgreSQL container
echo -e "${YELLOW}🐳 Starting PostgreSQL container...${NC}"
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
until docker-compose exec -T postgres pg_isready -U "${TARGET_DB_USER}" -d "${TARGET_DB_NAME}" > /dev/null 2>&1; do
    echo "Waiting for PostgreSQL..."
    sleep 5
done
echo -e "${GREEN}✅ PostgreSQL is ready${NC}"

# Create target database and user
echo -e "${YELLOW}👤 Creating target database and user...${NC}"
docker-compose exec -T postgres psql -U postgres -c "CREATE USER ${TARGET_DB_USER} WITH PASSWORD '${TARGET_DB_PASSWORD}';" || true
docker-compose exec -T postgres psql -U postgres -c "CREATE DATABASE ${TARGET_DB_NAME} OWNER ${TARGET_DB_USER};" || true
docker-compose exec -T postgres psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ${TARGET_DB_NAME} TO ${TARGET_DB_USER};" || true
echo -e "${GREEN}✅ Target database and user created${NC}"

# Create backup from source
echo -e "${YELLOW}💾 Creating backup from source database...${NC}"
echo "This may take several minutes depending on database size..."
PGPASSWORD="${SOURCE_DB_PASSWORD}" pg_dump -h "${SOURCE_DB_ENDPOINT}" -p "${SOURCE_DB_PORT}" -U "${SOURCE_DB_USER}" -d "${SOURCE_DB_NAME}" --verbose --no-owner --no-privileges --clean --create > "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup created successfully: ${BACKUP_FILE}${NC}"
    echo "Backup size: $(du -h "${BACKUP_FILE}" | cut -f1)"
else
    echo -e "${RED}❌ Backup failed${NC}"
    exit 1
fi

# Restore to target database
echo -e "${YELLOW}🔄 Restoring backup to target database...${NC}"
echo "This may take several minutes depending on database size..."
docker-compose exec -T postgres psql -U postgres -d "${TARGET_DB_NAME}" < "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database restored successfully${NC}"
else
    echo -e "${RED}❌ Database restore failed${NC}"
    exit 1
fi

# Verify migration
echo -e "${YELLOW}🔍 Verifying migration...${NC}"

# Check table count
SOURCE_TABLE_COUNT=$(PGPASSWORD="${SOURCE_DB_PASSWORD}" psql -h "${SOURCE_DB_ENDPOINT}" -p "${SOURCE_DB_PORT}" -U "${SOURCE_DB_USER}" -d "${SOURCE_DB_NAME}" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)
TARGET_TABLE_COUNT=$(docker-compose exec -T postgres psql -U "${TARGET_DB_USER}" -d "${TARGET_DB_NAME}" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)

echo "Source tables: ${SOURCE_TABLE_COUNT}"
echo "Target tables: ${TARGET_TABLE_COUNT}"

if [ "${SOURCE_TABLE_COUNT}" = "${TARGET_TABLE_COUNT}" ]; then
    echo -e "${GREEN}✅ Table count verification passed${NC}"
else
    echo -e "${RED}❌ Table count verification failed${NC}"
    exit 1
fi

# Check data in key tables
echo -e "${YELLOW}📊 Checking data in key tables...${NC}"

# Check users table
SOURCE_USER_COUNT=$(PGPASSWORD="${SOURCE_DB_PASSWORD}" psql -h "${SOURCE_DB_ENDPOINT}" -p "${SOURCE_DB_PORT}" -U "${SOURCE_DB_USER}" -d "${SOURCE_DB_NAME}" -t -c "SELECT COUNT(*) FROM users;" | xargs)
TARGET_USER_COUNT=$(docker-compose exec -T postgres psql -U "${TARGET_DB_USER}" -d "${TARGET_DB_NAME}" -t -c "SELECT COUNT(*) FROM users;" | xargs)

echo "Source users: ${SOURCE_USER_COUNT}"
echo "Target users: ${TARGET_USER_COUNT}"

if [ "${SOURCE_USER_COUNT}" = "${TARGET_USER_COUNT}" ]; then
    echo -e "${GREEN}✅ User data verification passed${NC}"
else
    echo -e "${RED}❌ User data verification failed${NC}"
    exit 1
fi

# Update application configuration
echo -e "${YELLOW}⚙️ Updating application configuration...${NC}"

# Create new database configuration file
cat > db-config-self-managed.js << EOF
// Self-managed PostgreSQL configuration
const config = {
  host: '${TARGET_DB_HOST}',
  port: ${TARGET_DB_PORT},
  database: '${TARGET_DB_NAME}',
  user: '${TARGET_DB_USER}',
  password: '${TARGET_DB_PASSWORD}',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: false
};

module.exports = config;
EOF

echo -e "${GREEN}✅ Application configuration updated${NC}"

# Start PgAdmin
echo -e "${YELLOW}🖥️ Starting PgAdmin...${NC}"
docker-compose up -d pgadmin

# Final status
echo -e "${GREEN}🎉 Migration completed successfully!${NC}"
echo "=================================================="
echo -e "${BLUE}📊 Migration Summary:${NC}"
echo "Source: ${SOURCE_DB_ENDPOINT}"
echo "Target: ${TARGET_DB_HOST}:${TARGET_DB_PORT}"
echo "Backup: ${BACKUP_FILE}"
echo "Tables migrated: ${TARGET_TABLE_COUNT}"
echo "Users migrated: ${TARGET_USER_COUNT}"
echo ""
echo -e "${BLUE}🔗 Access Information:${NC}"
echo "PostgreSQL: localhost:5432"
echo "PgAdmin: http://localhost:5050"
echo "  Email: admin@coolanu.com"
echo "  Password: admin123"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo "1. Update your application to use the new database configuration"
echo "2. Test the application thoroughly"
echo "3. Once confirmed working, decommission the RDS instance"
echo "4. Update Terraform configuration to remove RDS resources"
echo ""
echo -e "${YELLOW}⚠️ Important:${NC}"
echo "- Keep the backup file safe: ${BACKUP_FILE}"
echo "- Test thoroughly before decommissioning RDS"
echo "- Update your application's database connection settings"
echo ""
echo -e "${GREEN}🚀 Ready to test your self-managed database!${NC}"
