#!/bin/bash

# PostgreSQL Backup Script for Self-Managed Database
# This script creates automated backups and uploads them to S3

set -e

# Configuration - Update these values for your setup
DB_NAME="${DB_NAME:-coolanu}"
DB_USER="${DB_USER:-coolanu_user}"
DB_PASSWORD="${DB_PASSWORD:-your_secure_password_here}"
DB_HOST="${DB_HOST:-3.249.94.227}"
DB_PORT="${DB_PORT:-5432}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"
S3_BUCKET="${S3_BUCKET:-prod-coolanu-postgres-backups}"
AWS_REGION="${AWS_REGION:-eu-west-1}"

# Backup directory
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/coolanu_backup_${TIMESTAMP}.sql"
COMPRESSED_FILE="${BACKUP_FILE}.gz"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if psql is available
    if ! command -v psql &> /dev/null; then
        error "psql is not installed. Please install PostgreSQL client first."
        exit 1
    fi
    
    # Check if pg_dump is available
    if ! command -v pg_dump &> /dev/null; then
        error "pg_dump is not installed. Please install PostgreSQL client first."
        exit 1
    fi
    
    # Check if AWS CLI is available (if S3 upload is enabled)
    if [ "${UPLOAD_TO_S3}" = "true" ] && ! command -v aws &> /dev/null; then
        error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    log "Prerequisites check passed"
}

# Test database connection
test_connection() {
    log "Testing database connection..."
    
    if ! PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -c "SELECT 1;" > /dev/null 2>&1; then
        error "Cannot connect to database. Please check credentials and network."
        exit 1
    fi
    
    log "Database connection successful"
}

# Create backup
create_backup() {
    log "Creating database backup..."
    log "Database: ${DB_NAME} on ${DB_HOST}:${DB_PORT}"
    
    # Set environment variables for pg_dump
    export PGPASSWORD="${DB_PASSWORD}"
    
    # Create backup with pg_dump
    pg_dump \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        --verbose \
        --no-owner \
        --no-privileges \
        --clean \
        --create \
        --format=plain \
        --file="${BACKUP_FILE}"
    
    if [ $? -eq 0 ]; then
        log "Backup created successfully: ${BACKUP_FILE}"
        BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
        log "Backup size: ${BACKUP_SIZE}"
    else
        error "Backup failed"
        exit 1
    fi
}

# Compress backup
compress_backup() {
    if [ "${COMPRESS_BACKUP}" = "true" ]; then
        log "Compressing backup..."
        gzip "${BACKUP_FILE}"
        BACKUP_FILE="${BACKUP_FILE}.gz"
        log "Backup compressed: ${BACKUP_FILE}"
        
        # Update backup size
        BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
        log "Compressed backup size: ${BACKUP_SIZE}"
    fi
}

# Upload to S3
upload_to_s3() {
    if [ "${UPLOAD_TO_S3}" = "true" ]; then
        log "Uploading backup to S3..."
        
        # Check if S3 bucket exists
        if ! aws s3 ls "s3://${S3_BUCKET}" > /dev/null 2>&1; then
            warning "S3 bucket ${S3_BUCKET} does not exist. Creating it..."
            aws s3 mb "s3://${S3_BUCKET}" --region eu-west-1
            
            # Enable versioning
            aws s3api put-bucket-versioning \
                --bucket "${S3_BUCKET}" \
                --versioning-configuration Status=Enabled
            
            # Enable encryption
            aws s3api put-bucket-encryption \
                --bucket "${S3_BUCKET}" \
                --server-side-encryption-configuration '{
                    "Rules": [
                        {
                            "ApplyServerSideEncryptionByDefault": {
                                "SSEAlgorithm": "AES256"
                            }
                        }
                    ]
                }'
        fi
        
        # Upload backup
        aws s3 cp "${BACKUP_FILE}" "s3://${S3_BUCKET}/"
        
        if [ $? -eq 0 ]; then
            log "Backup uploaded to S3: s3://${S3_BUCKET}/$(basename ${BACKUP_FILE})"
        else
            error "S3 upload failed"
            exit 1
        fi
    fi
}

# Clean old backups
cleanup_old_backups() {
    log "Cleaning up old backups (keeping last ${RETENTION_DAYS} days)..."
    
    # Clean local backups
    find "${BACKUP_DIR}" -name "*.sql" -mtime +${RETENTION_DAYS} -delete 2>/dev/null || true
    find "${BACKUP_DIR}" -name "*.sql.gz" -mtime +${RETENTION_DAYS} -delete 2>/dev/null || true
    
    # Clean S3 backups if enabled
    if [ "${UPLOAD_TO_S3}" = "true" ]; then
        log "Cleaning up old S3 backups..."
        aws s3 ls "s3://${S3_BUCKET}/" | grep "coolanu_backup_" | awk '{print $4}' | while read -r file; do
            # Get file creation date
            file_date=$(aws s3api head-object --bucket "${S3_BUCKET}" --key "${file}" --query 'LastModified' --output text | cut -d'T' -f1)
            days_old=$(( ( $(date +%s) - $(date -d "${file_date}" +%s) ) / 86400 ))
            
            if [ ${days_old} -gt ${RETENTION_DAYS} ]; then
                log "Deleting old S3 backup: ${file} (${days_old} days old)"
                aws s3 rm "s3://${S3_BUCKET}/${file}"
            fi
        done
    fi
    
    log "Cleanup completed"
}

# Verify backup
verify_backup() {
    log "Verifying backup integrity..."
    
    if [ "${COMPRESS_BACKUP}" = "true" ]; then
        # Test compressed backup
        if gzip -t "${BACKUP_FILE}" 2>/dev/null; then
            log "Backup integrity check passed"
        else
            error "Backup integrity check failed"
            exit 1
        fi
    else
        # Test uncompressed backup
        if [ -f "${BACKUP_FILE}" ] && [ -s "${BACKUP_FILE}" ]; then
            log "Backup integrity check passed"
        else
            error "Backup integrity check failed"
            exit 1
        fi
    fi
}

# Send Slack notification
notify_slack() {
    if [ "${NOTIFY_SLACK}" = "true" ] && [ -n "${SLACK_WEBHOOK}" ]; then
        log "Sending Slack notification..."
        
        MESSAGE="{
            \"text\": \"🔄 PostgreSQL Backup Completed\",
            \"attachments\": [
                {
                    \"color\": \"good\",
                    \"fields\": [
                        {
                            \"title\": \"Database\",
                            \"value\": \"${DB_NAME}\",
                            \"short\": true
                        },
                        {
                            \"title\": \"Host\",
                            \"value\": \"${DB_HOST}:${DB_PORT}\",
                            \"short\": true
                        },
                        {
                            \"title\": \"Backup File\",
                            \"value\": \"$(basename ${BACKUP_FILE})\",
                            \"short\": true
                        },
                        {
                            \"title\": \"Size\",
                            \"value\": \"${BACKUP_SIZE}\",
                            \"short\": true
                        },
                        {
                            \"title\": \"Timestamp\",
                            \"value\": \"$(date)\",
                            \"short\": false
                        }
                    ]
                }
            ]
        }"
        
        curl -X POST -H 'Content-type: application/json' --data "${MESSAGE}" "${SLACK_WEBHOOK}" > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            log "Slack notification sent"
        else
            warning "Slack notification failed"
        fi
    fi
}

# Generate backup report
generate_report() {
    log "Generating backup report..."
    
    REPORT_FILE="${BACKUP_DIR}/backup_report_${TIMESTAMP}.txt"
    
    cat > "${REPORT_FILE}" << EOF
PostgreSQL Backup Report
========================
Timestamp: $(date)
Database: ${DB_NAME}
Host: ${DB_HOST}:${DB_PORT}
User: ${DB_USER}

Backup Details:
- File: $(basename ${BACKUP_FILE})
- Size: ${BACKUP_SIZE}
- Location: ${BACKUP_FILE}
- S3 Location: ${UPLOAD_TO_S3:+s3://${S3_BUCKET}/$(basename ${BACKUP_FILE})}

System Information:
- Hostname: $(hostname)
- OS: $(uname -a)
- Disk Usage: $(df -h . | tail -1)

Database Statistics:
- Tables: $(PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)
- Database Size: $(PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -t -c "SELECT pg_size_pretty(pg_database_size('${DB_NAME}'));" | xargs)

Backup Configuration:
- Compression: ${COMPRESS_BACKUP}
- S3 Upload: ${UPLOAD_TO_S3}
- Retention: ${RETENTION_DAYS} days
- Slack Notifications: ${NOTIFY_SLACK}

EOF
    
    log "Backup report generated: ${REPORT_FILE}"
}

# Main execution
main() {
    log "🚀 Starting PostgreSQL backup process..."
    log "Configuration:"
    log "  Database: ${DB_NAME} on ${DB_HOST}:${DB_PORT}"
    log "  Backup Directory: ${BACKUP_DIR}"
    log "  S3 Bucket: ${S3_BUCKET}"
    log "  Retention: ${RETENTION_DAYS} days"
    log "  Compression: ${COMPRESS_BACKUP}"
    log "  S3 Upload: ${UPLOAD_TO_S3}"
    
    check_prerequisites
    test_connection
    create_backup
    compress_backup
    verify_backup
    upload_to_s3
    cleanup_old_backups
    generate_report
    notify_slack
    
    log "🎉 Backup process completed successfully!"
    log "Backup file: ${BACKUP_FILE}"
    log "Log file: ${LOG_FILE}"
    log "Total execution time: $SECONDS seconds"
}

# Run main function
main "$@"
