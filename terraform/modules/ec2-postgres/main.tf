# EC2 Instance for Self-Managed PostgreSQL
resource "aws_instance" "postgres" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name              = var.key_name
  vpc_security_group_ids = [aws_security_group.postgres.id]
  subnet_id              = var.subnet_id
  iam_instance_profile   = var.iam_instance_profile_name

  root_block_device {
    volume_size = var.root_volume_size
    volume_type = "gp3"
    encrypted   = true
  }

  user_data = file("${path.module}/user-data.sh")

  tags = {
    Name        = "${var.environment}-postgres-instance"
    Environment = var.environment
    Purpose     = "Self-managed PostgreSQL database"
  }

  lifecycle {
    prevent_destroy = true
  }
}

# Security Group for PostgreSQL
resource "aws_security_group" "postgres" {
  name_prefix = "${var.environment}-postgres-sg"
  vpc_id      = var.vpc_id

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

# EBS Volume for PostgreSQL data
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
