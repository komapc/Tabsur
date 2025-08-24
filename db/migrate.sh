#!/bin/bash

# Database migration script for Tabsur
# Usage: DB_PASSWORD=your_password DB_HOST=your_host DB_PORT=your_port DB_NAME=your_db DB_USER=your_user bash migrate.sh

# Set default values (should be overridden by environment variables)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-tabsur}"
DB_USER="${DB_USER:-tabsur_user}"
DB_PASSWORD="${DB_PASSWORD:-}"

# Check if required environment variables are set
if [[ -z "$DB_PASSWORD" ]]; then
    echo "❌ Error: DB_PASSWORD environment variable is required"
    echo "Usage: DB_PASSWORD=your_password bash migrate.sh"
    exit 1
fi

echo "🔧 Starting database migration..."
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"

# Create migrations directory if it doesn't exist
mkdir -p migrations

# Find all SQL files in the migrations directory
sql_files=$(find migrations -name "*.sql" | sort)

if [[ -z "$sql_files" ]]; then
    echo "⚠️  No SQL migration files found in migrations/ directory"
    exit 0
fi

echo "📁 Found $(echo "$sql_files" | wc -l) migration file(s)"

# Execute each migration file
for sql_file in $sql_files; do
    echo "🔄 Executing migration: $sql_file"
    
    # Execute the SQL file
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" -f "$sql_file"
    
    if [[ $? -eq 0 ]]; then
        echo "✅ Successfully executed: $sql_file"
    else
        echo "❌ Failed to execute: $sql_file"
        exit 1
    fi
done

echo "🎉 Database migration completed successfully!"
