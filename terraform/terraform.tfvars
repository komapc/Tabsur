# AWS Configuration
aws_region = "eu-central-1"
environment = "prod"

# Database Configuration (these will be used for the app instance)
db_host = "3.249.94.227"
db_port = 5432
db_name = "coolanu"
db_user = "coolanu_user"
# Use SSM/Secrets Manager or pass via CI; do not hardcode
db_password = ""

# Instance Configuration
instance_type = "t3.medium"
ami_id = "ami-0857b63eb9da0783d"  # Latest Ubuntu 22.04 LTS in eu-central-1
availability_zone = "eu-central-1a"
use_existing_vpc = false

# Network Configuration
vpc_cidr = "172.16.0.0/16"
public_subnet_cidr = "172.16.1.0/24"

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

# ALB Configuration
certificate_arn = "arn:aws:acm:eu-central-1:272007598366:certificate/61585d26-3206-4f76-a758-e759af5a6cc3"
enable_https = true

# Application Instance Configuration
app_instance_type = "t3.medium"
app_root_volume_size = 30
app_instance_count = 1
app_desired_capacity = 1
app_max_size = 3
app_min_size = 1
