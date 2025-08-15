# EC2 Instance for Tabsur Application Stack
resource "aws_instance" "tabsur_app" {
  ami                    = var.ami_id
  instance_type          = "t3.medium"  # Larger instance for app stack
  key_name              = aws_key_pair.postgres_key.key_name
  vpc_security_group_ids = [aws_security_group.tabsur_app.id]
  subnet_id              = local.subnet_id
  iam_instance_profile   = aws_iam_instance_profile.postgres_profile.name
  user_data              = base64encode(file("${path.module}/ec2-app-user-data.sh"))
  user_data_replace_on_change = true

  root_block_device {
    volume_size = 30  # Larger volume for application
    volume_type = "gp3"
    encrypted   = true
  }

  tags = {
    Name        = "${var.environment}-tabsur-app-instance"
    Environment = var.environment
    Purpose     = "Tabsur application stack"
  }
}

# Security Group for Tabsur Application
resource "aws_security_group" "tabsur_app" {
  name_prefix = "${var.environment}-tabsur-app-sg"
  vpc_id      = local.vpc_id

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidrs
    description = "SSH access"
  }

  # HTTP for web application
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP web access"
  }

  # HTTPS for web application
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS web access"
  }

  # Application API port
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Tabsur API access"
  }

  # Load balancer port
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Load balancer access"
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
    Name        = "${var.environment}-tabsur-app-security-group"
    Environment = var.environment
  }
}

# Outputs for the application instance
output "tabsur_app_public_ip" {
  description = "Public IP of Tabsur application instance"
  value       = aws_instance.tabsur_app.public_ip
}

output "tabsur_app_url" {
  description = "URL to access Tabsur application"
  value       = "http://${aws_instance.tabsur_app.public_ip}"
}

output "tabsur_api_url" {
  description = "URL to access Tabsur API"
  value       = "http://${aws_instance.tabsur_app.public_ip}:5000"
}

output "tabsur_lb_url" {
  description = "URL to access Tabsur load balancer"
  value       = "http://${aws_instance.tabsur_app.public_ip}:8080"
}
