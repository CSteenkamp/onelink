#!/usr/bin/env bash
set -euo pipefail

# Database backup script — dumps PostgreSQL and uploads to S3
# Usage: ./scripts/backup.sh
# Requires: pg_dump, aws cli, gzip

# Load env vars from .env if present
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"
if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

# Config
S3_BUCKET="${AWS_S3_BUCKET:?AWS_S3_BUCKET not set}"
S3_PREFIX="backups"
RETENTION_DAYS=30
DATE=$(date +%Y-%m-%d_%H-%M-%S)
DUMP_FILE="/tmp/linkist-backup-${DATE}.sql.gz"

echo "Starting database backup..."

# Dump and compress
pg_dump "$DATABASE_URL" | gzip > "$DUMP_FILE"

FILESIZE=$(ls -lh "$DUMP_FILE" | awk '{print $5}')
echo "Dump complete: ${DUMP_FILE} (${FILESIZE})"

# Upload to S3
aws s3 cp "$DUMP_FILE" "s3://${S3_BUCKET}/${S3_PREFIX}/${DATE}.sql.gz" --quiet
echo "Uploaded to s3://${S3_BUCKET}/${S3_PREFIX}/${DATE}.sql.gz"

# Clean up local file
rm -f "$DUMP_FILE"

# Remove backups older than retention period
echo "Cleaning up backups older than ${RETENTION_DAYS} days..."
CUTOFF_DATE=$(date -v-${RETENTION_DAYS}d +%Y-%m-%d 2>/dev/null || date -d "${RETENTION_DAYS} days ago" +%Y-%m-%d)
aws s3 ls "s3://${S3_BUCKET}/${S3_PREFIX}/" | while read -r line; do
  FILE_DATE=$(echo "$line" | awk '{print $4}' | cut -d'_' -f1)
  if [[ -n "$FILE_DATE" && "$FILE_DATE" < "$CUTOFF_DATE" ]]; then
    FILE_NAME=$(echo "$line" | awk '{print $4}')
    aws s3 rm "s3://${S3_BUCKET}/${S3_PREFIX}/${FILE_NAME}" --quiet
    echo "Deleted old backup: ${FILE_NAME}"
  fi
done

echo "Backup complete."
