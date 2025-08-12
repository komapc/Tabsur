#!/usr/bin/env sh

# Set database connection variables (can be overridden by environment)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-coolanu}"
DB_USER="${DB_USER:-coolanu}"
DB_PASSWORD="${DB_PASSWORD:-coolanu}"
MIGRATION_DIR="./migrations"

echo "🗄️  Connecting to database: $DB_HOST:$DB_PORT/$DB_NAME"

execute_sql() {
  local sql_file="$1"
  echo "Executing SQL file: $sql_file"
  psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" -f "$sql_file"
  if [ $? -ne 0 ]; then
    echo "Error executing $sql_file"
    exit 1
  fi
}

# Find all SQL migration files in the migration directory and sort them numerically
find "$MIGRATION_DIR" -name "V*.sql" | sort -V | while read -r sql_file; do
  execute_sql "$sql_file"
done

echo "Migration complete."
