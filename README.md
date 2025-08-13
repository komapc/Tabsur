# Tabsur Database Migration & Cost Optimization

## 🎯 Project Overview

This repository contains the migration of the Tabsur database from AWS us-east-1 to eu-west-1, including cost optimization strategies and infrastructure as code.

## 🚀 What's Included

### 📁 Scripts
- **`migrate-to-eu-west-1.sh`** - Complete database migration script
- **`complete-migration.sh`** - Final migration steps after snapshot copy
- **`check-migration-status.sh`** - Migration progress monitoring
- **`deploy-aws.sh`** - AWS deployment automation

### 🏗️ Terraform Infrastructure
- **`terraform/`** - Complete infrastructure as code
  - **`main.tf`** - Main configuration with eu-west-1 region
  - **`modules/rds/`** - RDS database configuration
  - **`variables.tf`** - Configuration variables
  - **`outputs.tf`** - Output values

### 📊 Migration Benefits
- **Cost Reduction**: 75% storage savings (20GB → 5GB)
- **Performance**: 3-4x faster latency from Israel
- **Support**: PostgreSQL 15.7 (4+ years vs End of Life)
- **Region**: eu-west-1 (Ireland) for better performance

## 🔧 Prerequisites

- AWS CLI configured with appropriate permissions
- PostgreSQL client tools (pg_dump, psql)
- Terraform >= 1.0

## 📋 Migration Process

### Phase 1: Preparation
1. Update Terraform for eu-west-1 region
2. Create new database in target region
3. Prepare migration scripts

### Phase 2: Data Migration
1. Create database snapshot
2. Copy snapshot to eu-west-1
3. Restore database from snapshot

### Phase 3: Upgrade & Optimization
1. Upgrade PostgreSQL to 15.7
2. Reduce storage to 5GB
3. Test functionality

### Phase 4: Switch & Cleanup
1. Update application configuration
2. Delete old database
3. Verify cost savings

## 💰 Cost Optimization

### Before Migration
- **Monthly Cost**: $59.86 (2 databases running)
- **Storage**: 20GB GP2
- **PostgreSQL**: 11.22 (End of Life)

### After Migration
- **Monthly Cost**: $29.93 (1 database)
- **Storage**: 5GB GP2
- **PostgreSQL**: 15.7 (4+ years support)
- **Annual Savings**: $359.16

## 🚨 Important Notes

- **Reserved Instances**: Cannot be canceled once purchased
- **Migration Time**: 1-2 hours total
- **Downtime**: Minimal (blue-green migration)
- **Backup**: 3-day retention for cost savings

## 🔍 Usage

### Check Migration Status
```bash
./check-migration-status.sh
```

### Complete Migration
```bash
./complete-migration.sh
```

### Deploy Infrastructure
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## 📞 Support

For migration issues or cost optimization questions, refer to the migration scripts and Terraform documentation.

## 📝 License

This project is part of the Tabsur application infrastructure.