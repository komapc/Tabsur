#!/bin/bash

# Quick status checker for migration progress
echo "🔍 Migration Status Check"
echo "========================"

echo ""
echo "📊 Source Database (us-east-1):"
aws rds describe-db-instances --db-instance-identifier coolanu --region us-east-1 --query 'DBInstances[0].[DBInstanceIdentifier,DBInstanceStatus,EngineVersion,AllocatedStorage,StorageType]' --output table

echo ""
echo "📊 Target Database (eu-west-1):"
aws rds describe-db-instances --db-instance-identifier coolanu-eu-west-1 --region eu-west-1 --query 'DBInstances[0].[DBInstanceIdentifier,DBInstanceStatus,EngineVersion,AllocatedStorage,StorageType]' --output table

echo ""
echo "📊 Migration Progress:"
echo "Phase 1: ✅ Terraform updated for eu-west-1"
echo "Phase 2: ✅ New database created (status: creating)"
echo "Phase 3: ⏳ Waiting for database to be available"
echo "Phase 4: ⏳ Data migration (pending)"
echo "Phase 5: ⏳ Testing & switch (pending)"
echo "Phase 6: ⏳ Cleanup (pending)"

echo ""
echo "💡 Next Steps:"
echo "1. Wait for target database status to change from 'creating' to 'available'"
echo "2. Run: ./migrate-to-eu-west-1.sh"
echo "3. Test application with new database"
echo "4. Switch application to new endpoint"
echo "5. Delete old database"
