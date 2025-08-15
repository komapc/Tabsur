terraform {
  # Temporarily commented out for debugging
  # backend "s3" {
  #   bucket = "tabsur-terraform-state"
  #   key    = "terraform-self-managed.tfstate"
  #   region = "eu-central-1"
  # }
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC and Networking (using existing or create new)
data "aws_vpc" "existing" {
  count = var.use_existing_vpc ? 1 : 0
  tags = {
    Name = var.existing_vpc_name
  }
}

resource "aws_vpc" "main" {
  count = var.use_existing_vpc ? 0 : 1
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.environment}-postgres-vpc"
    Environment = var.environment
  }
}

locals {
  vpc_id = var.use_existing_vpc ? data.aws_vpc.existing[0].id : aws_vpc.main[0].id
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  count  = var.use_existing_vpc ? 0 : 1
  vpc_id = local.vpc_id

  tags = {
    Name        = "${var.environment}-postgres-igw"
    Environment = var.environment
  }
}

# Public Subnet
resource "aws_subnet" "public" {
  count             = var.use_existing_vpc ? 0 : 1
  vpc_id            = local.vpc_id
  cidr_block        = var.public_subnet_cidr
  availability_zone = var.availability_zone

  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.environment}-postgres-public-subnet"
    Environment = var.environment
  }
}

# Route Table
resource "aws_route_table" "public" {
  count  = var.use_existing_vpc ? 0 : 1
  vpc_id = local.vpc_id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main[0].id
  }

  tags = {
    Name        = "${var.environment}-postgres-public-rt"
    Environment = var.environment
  }
}

# Route Table Association
resource "aws_route_table_association" "public" {
  count          = var.use_existing_vpc ? 0 : 1
  subnet_id      = aws_subnet.public[0].id
  route_table_id = aws_route_table.public[0].id
}

locals {
  subnet_id = var.use_existing_vpc ? var.existing_subnet_id : aws_subnet.public[0].id
}

# EC2 Key Pair
resource "aws_key_pair" "postgres_key" {
  key_name   = "${var.environment}-postgres-key"
  public_key = file(var.ssh_public_key_path)

  tags = {
    Environment = var.environment
  }
}

# IAM Role for EC2 instances
resource "aws_iam_role" "postgres_role" {
  name = "${var.environment}-postgres-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Environment = var.environment
  }
}

# IAM Policy for S3 access
resource "aws_iam_policy" "postgres_policy" {
  name        = "${var.environment}-postgres-policy"
  description = "Policy for PostgreSQL EC2 instance"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.postgres_backups.arn,
          "${aws_s3_bucket.postgres_backups.arn}/*"
        ]
      }
    ]
  })
}

# Attach policy to role
resource "aws_iam_role_policy_attachment" "postgres_policy_attachment" {
  role       = aws_iam_role.postgres_role.name
  policy_arn = aws_iam_policy.postgres_policy.arn
}

# IAM Instance Profile
resource "aws_iam_instance_profile" "postgres_profile" {
  name = "${var.environment}-postgres-profile"
  role = aws_iam_role.postgres_role.name
}

# S3 Bucket for PostgreSQL backups
resource "aws_s3_bucket" "postgres_backups" {
  bucket = "${var.environment}-coolanu-postgres-backups-${random_string.bucket_suffix.result}"

  tags = {
    Name        = "${var.environment}-coolanu-postgres-backups"
    Environment = var.environment
  }
}

# Random string for unique bucket name
resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# S3 Bucket versioning
resource "aws_s3_bucket_versioning" "postgres_backups" {
  bucket = aws_s3_bucket.postgres_backups.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "postgres_backups" {
  bucket = aws_s3_bucket.postgres_backups.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3 Bucket lifecycle policy
resource "aws_s3_bucket_lifecycle_configuration" "postgres_backups" {
  bucket = aws_s3_bucket.postgres_backups.id

  rule {
    id     = "backup-retention"
    status = "Enabled"

    filter {
      prefix = ""
    }

    expiration {
      days = var.backup_retention_days
    }

    noncurrent_version_expiration {
      noncurrent_days = 1
    }
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "postgres_logs" {
  name              = "/ec2/${var.environment}-postgres"
  retention_in_days = 14

  tags = {
    Environment = var.environment
  }
}

# Self-Managed PostgreSQL on EC2
resource "aws_instance" "postgres" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name              = aws_key_pair.postgres_key.key_name
  vpc_security_group_ids = [aws_security_group.postgres.id]
  subnet_id              = local.subnet_id
  iam_instance_profile   = aws_iam_instance_profile.postgres_profile.name
  user_data              = base64encode(file("${path.module}/modules/ec2-postgres/user-data.sh"))
  user_data_replace_on_change = true

  root_block_device {
    volume_size = var.root_volume_size
    volume_type = "gp3"
    encrypted   = true
  }

  tags = {
    Name        = "${var.environment}-postgres-instance"
    Environment = var.environment
    Purpose     = "Self-managed PostgreSQL database"
  }
}

# Create security group directly
resource "aws_security_group" "postgres" {
  name_prefix = "${var.environment}-postgres-sg"
  vpc_id      = local.vpc_id

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidrs
    description = "SSH access"
  }

  # PostgreSQL access
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = var.allowed_db_cidrs
    description = "PostgreSQL database access"
  }

  # PgAdmin access
  ingress {
    from_port   = 5050
    to_port     = 5050
    protocol    = "tcp"
    cidr_blocks = var.allowed_pgadmin_cidrs
    description = "PgAdmin web interface"
  }

  # HTTP/HTTPS for updates
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP for package updates"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS for package updates"
  }

  # All outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = {
    Name        = "${var.environment}-postgres-security-group"
    Environment = var.environment
  }
}

# Create EBS volume directly
resource "aws_ebs_volume" "postgres_data" {
  availability_zone = var.availability_zone
  size              = var.data_volume_size
  type              = "gp3"
  encrypted         = true

  tags = {
    Name        = "${var.environment}-postgres-data-volume"
    Environment = var.environment
  }
}

# Attach EBS volume to instance
resource "aws_volume_attachment" "postgres_data" {
  device_name = "/dev/sdf"
  volume_id   = aws_ebs_volume.postgres_data.id
  instance_id = aws_instance.postgres.id
}

# Outputs
output "postgres_endpoint" {
  description = "PostgreSQL connection endpoint"
  value       = aws_instance.postgres.private_ip
}

output "postgres_public_ip" {
  description = "PostgreSQL instance public IP"
  value       = aws_instance.postgres.public_ip
}

output "pgadmin_url" {
  description = "PgAdmin web interface URL"
  value       = "http://${aws_instance.postgres.public_ip}:5050"
}

output "health_check_url" {
  description = "Health check endpoint URL"
  value       = "http://${aws_instance.postgres.public_ip}/health"
}

output "backup_bucket" {
  description = "S3 bucket for database backups"
  value       = aws_s3_bucket.postgres_backups.bucket
}

output "cost_estimate" {
  description = "Estimated monthly cost for self-managed solution"
  value       = "~$1.89/month (1-year Reserved Instance, 1 hour/day) vs $32.92/month (RDS)"
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ~/.ssh/coolanu-postgres ubuntu@${aws_instance.postgres.public_ip}"
}

