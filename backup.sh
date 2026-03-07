#!/bin/bash

# Database Backup Script for Production

set -e

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="talent_marketplace"
RETENTION_DAYS=30

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | xargs)
fi

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "🗄️ Starting database backup..."

# Create database backup
docker-compose exec -T postgres pg_dump -U ${DB_USER:-postgres} -d $DB_NAME > "$BACKUP_DIR/backup_${DATE}.sql"

# Compress the backup
gzip "$BACKUP_DIR/backup_${DATE}.sql"

echo "✅ Database backup completed: backup_${DATE}.sql.gz"

# Clean up old backups (keep only last 30 days)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "🧹 Old backups cleaned up (kept last $RETENTION_DAYS days)"

# Upload to cloud storage (optional - uncomment and configure)
# aws s3 cp "$BACKUP_DIR/backup_${DATE}.sql.gz" s3://your-backup-bucket/

echo "✅ Backup process completed successfully!"

# List current backups
echo "📁 Current backups:"
ls -lh $BACKUP_DIR/backup_*.sql.gz | tail -10