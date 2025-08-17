variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "app_name" {
  description = "Application name (e.g., tabsur)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where the instances will be created"
  type        = string
}

variable "subnet_id" {
  description = "Subnet ID where the instances will be created"
  type        = string
}

variable "ami_id" {
  description = "AMI ID for the EC2 instances"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Name of the SSH key pair"
  type        = string
}

variable "iam_instance_profile_name" {
  description = "Name of the IAM instance profile"
  type        = string
}

variable "root_volume_size" {
  description = "Size of the root EBS volume in GB"
  type        = number
  default     = 20
}

variable "allowed_ssh_cidrs" {
  description = "CIDR blocks allowed to SSH to the instances"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "alb_security_group_id" {
  description = "ID of the ALB security group for health checks"
  type        = string
}

variable "instance_count" {
  description = "Number of instances to create (for manual scaling)"
  type        = number
  default     = 1
}

variable "desired_capacity" {
  description = "Desired capacity for the Auto Scaling Group"
  type        = number
  default     = 1
}

variable "max_size" {
  description = "Maximum size for the Auto Scaling Group"
  type        = number
  default     = 3
}

variable "min_size" {
  description = "Minimum size for the Auto Scaling Group"
  type        = number
  default     = 1
}

variable "target_group_arns" {
  description = "List of target group ARNs for the Auto Scaling Group"
  type        = list(string)
}
