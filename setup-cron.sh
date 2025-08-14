#!/bin/bash

# Setup automated cron jobs for PostgreSQL maintenance

echo "🕐 Setting up automated cron jobs..."

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Create backup cron job (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * cd ${SCRIPT_DIR} && ./scripts/backup-postgres.sh >> ./backups/cron.log 2>&1") | crontab -

# Create monitoring cron job (every 15 minutes)
(crontab -l 2>/dev/null; echo "*/15 * * * * cd ${SCRIPT_DIR} && ./scripts/monitor-postgres.sh >> ./logs/monitoring.log 2>&1") | crontab -

# Create log rotation cron job (daily at 3 AM)
(crontab -l 2>/dev/null; echo "0 3 * * * find ${SCRIPT_DIR}/backups -name '*.sql.gz' -mtime +7 -delete") | crontab -

echo "✅ Cron jobs set up successfully!"
echo "📅 Current cron jobs:"
crontab -l

echo ""
echo "📋 Cron job details:"
echo "  - Daily backup: 2:00 AM"
echo "  - Monitoring: Every 15 minutes"
echo "  - Log cleanup: 3:00 AM"
echo ""
echo "📁 Logs will be written to:"
echo "  - Backup logs: ./backups/cron.log"
echo "  - Monitoring logs: ./logs/monitoring.log"
