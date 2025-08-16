#!/bin/bash

# PostgreSQL Monitoring Script
# Monitors database health, connections, and performance

set -e

# Configuration
DB_NAME="${DB_NAME:-coolanu}"
DB_USER="${DB_USER:-coolanu_user}"
DB_PASSWORD="${DB_PASSWORD:-your_secure_password_here}"
DB_HOST="${DB_HOST:-3.249.94.227}"
DB_PORT="${DB_PORT:-5432}"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo "🔍 PostgreSQL Health Check - $(date)"

# Test database connection
if PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -c "SELECT 1;" > /dev/null 2>&1; then
    log "✅ Database connection: OK"
else
    error "❌ Database connection: FAILED"
    exit 1
fi

# Get database statistics
echo ""
echo "📊 Database Statistics:"
echo "========================"

# Active connections
ACTIVE_CONNECTIONS=$(PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -t -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';" | xargs)
log "Active connections: ${ACTIVE_CONNECTIONS}"

# Database size
DB_SIZE=$(PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -t -c "SELECT pg_size_pretty(pg_database_size('${DB_NAME}'));" | xargs)
log "Database size: ${DB_SIZE}"

# Table count
TABLE_COUNT=$(PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)
log "Table count: ${TABLE_COUNT}"

# User count (if users table exists)
if PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users');" | grep -q "t"; then
    USER_COUNT=$(PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -t -c "SELECT COUNT(*) FROM users;" | xargs)
    log "User count: ${USER_COUNT}"
else
    log "Users table: Not found"
fi

# Top 5 largest tables
echo ""
echo "📋 Top 5 Largest Tables:"
echo "========================"
PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -c "
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 5;
"

# Check for long-running queries
echo ""
echo "⏱️  Long-running Queries (>5 minutes):"
echo "======================================="
LONG_QUERIES=$(PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -t -c "
SELECT COUNT(*) 
FROM pg_stat_activity 
WHERE state = 'active' 
AND now() - query_start > interval '5 minutes';" | xargs)

if [ "$LONG_QUERIES" -gt 0 ]; then
    warning "Found ${LONG_QUERIES} long-running queries"
    PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -c "
SELECT 
    pid,
    now() - query_start as duration,
    query
FROM pg_stat_activity 
WHERE state = 'active' 
AND now() - query_start > interval '5 minutes'
ORDER BY duration DESC;"
else
    log "✅ No long-running queries found"
fi

echo ""
log "🎉 Health check completed successfully!"
