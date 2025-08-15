# AWS Configuration
aws_region = "eu-central-1"
environment = "prod"

# Database Configuration (these will be used for the app instance)
db_host = "3.249.94.227"
db_port = 5432
db_name = "coolanu"
db_user = "coolanu_user"
# db_password will be set via environment variable or prompt

# Instance Configuration
instance_type = "t3.medium"
ami_id = "ami-0a7e505f26c66ccb1"  # Ubuntu 22.04 LTS in eu-west-1
availability_zone = "eu-central-1a"
use_existing_vpc = false

# Network Configuration
vpc_cidr = "10.0.0.0/16"
public_subnet_cidr = "10.0.1.0/24"

# Volume Configuration
root_volume_size = 30
data_volume_size = 20

# Security Configuration
allowed_ssh_cidrs = ["0.0.0.0/0"]  # Restrict this in production
allowed_db_cidrs = ["0.0.0.0/0"]   # Restrict this in production
allowed_pgadmin_cidrs = ["0.0.0.0/0"]  # Restrict this in production

# Backup Configuration
backup_retention_days = 7

# SSH Key Configuration
ssh_public_key_path = "~/.ssh/coolanu-postgres.pub"
