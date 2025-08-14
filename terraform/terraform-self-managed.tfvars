# Self-Managed PostgreSQL Configuration
environment = "prod"
aws_region = "eu-west-1"

# Database Configuration
db_name = "coolanu"
db_user = "coolanu_user"
db_password = "coolanu123"  # Update this with your actual RDS password

# SSH Configuration
ssh_public_key_path = "~/.ssh/coolanu-postgres.pub"

# Network Access (restrict these in production)
allowed_ssh_cidrs = ["0.0.0.0/0"]
allowed_db_cidrs = ["0.0.0.0/0"]
allowed_pgadmin_cidrs = ["0.0.0.0/0"]

# Instance Configuration
instance_type = "t3.micro"
root_volume_size = 20
data_volume_size = 20

# Backup Configuration
backup_retention_days = 7
