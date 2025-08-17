variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-1"
}

variable "availability_zone" {
  description = "Availability zone for the instance"
  type        = string
  default     = "eu-west-1a"
}

variable "use_existing_vpc" {
  description = "Whether to use an existing VPC"
  type        = bool
  default     = false
}

variable "existing_vpc_name" {
  description = "Name of existing VPC to use"
  type        = string
  default     = ""
}

variable "existing_subnet_id" {
  description = "ID of existing subnet to use"
  type        = string
  default     = ""
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "ami_id" {
  description = "AMI ID for the EC2 instance"
  type        = string
  default     = "ami-0a7e505f26c66ccb1" # Ubuntu 22.04 LTS in eu-west-1
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ssh_public_key_path" {
  description = "Path to SSH public key file"
  type        = string
  default     = "~/.ssh/coolanu-postgres.pub"
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "coolanu"
}

variable "db_user" {
  description = "PostgreSQL database user"
  type        = string
  default     = "coolanu_user"
}

variable "db_password" {
  description = "PostgreSQL database password"
  type        = string
  sensitive   = true
}

variable "db_host" {
  description = "PostgreSQL database host"
  type        = string
  default     = "localhost"
}

variable "db_port" {
  description = "PostgreSQL database port"
  type        = number
  default     = 5432
}

variable "root_volume_size" {
  description = "Size of the root EBS volume in GB"
  type        = number
  default     = 20
}

variable "data_volume_size" {
  description = "Size of the data EBS volume in GB"
  type        = number
  default     = 20
}

variable "allowed_ssh_cidrs" {
  description = "CIDR blocks allowed to SSH to the instance"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "allowed_db_cidrs" {
  description = "CIDR blocks allowed to connect to PostgreSQL"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "allowed_pgadmin_cidrs" {
  description = "CIDR blocks allowed to access PgAdmin"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 7
}

# ALB Configuration
variable "certificate_arn" {
  description = "ARN of the SSL certificate for HTTPS"
  type        = string
  default     = ""
}

variable "enable_https" {
  description = "Whether to enable HTTPS (requires certificate_arn)"
  type        = bool
  default     = true
}

# Application Instance Configuration
variable "app_instance_type" {
  description = "EC2 instance type for application instances"
  type        = string
  default     = "t3.small"
}

variable "app_root_volume_size" {
  description = "Size of the root EBS volume in GB for application instances"
  type        = number
  default     = 30
}

variable "app_instance_count" {
  description = "Number of application instances to create initially"
  type        = number
  default     = 1
}

variable "app_desired_capacity" {
  description = "Desired capacity for the application Auto Scaling Group"
  type        = number
  default     = 1
}

variable "app_max_size" {
  description = "Maximum size for the application Auto Scaling Group"
  type        = number
  default     = 3
}

variable "app_min_size" {
  description = "Minimum size for the application Auto Scaling Group"
  type        = number
  default     = 1
}

