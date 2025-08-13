variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for the ECS services"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group ID for the ECS services"
  type        = string
}

variable "target_group_arn" {
  description = "Target group ARN for the client service"
  type        = string
}

variable "server_target_group_arn" {
  description = "Target group ARN for the server service"
  type        = string
}

variable "ecr_repository_client_url" {
  description = "ECR repository URL for the client image"
  type        = string
}

variable "ecr_repository_server_url" {
  description = "ECR repository URL for the server image"
  type        = string
}

variable "database_url" {
  description = "Database connection URL"
  type        = string
}

variable "jwt_secret_arn" {
  description = "ARN of JWT secret in AWS Secrets Manager"
  type        = string
  default     = ""
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "execution_role_arn" {
  description = "ARN of the ECS task execution role"
  type        = string
}

variable "task_role_arn" {
  description = "ARN of the ECS task role"
  type        = string
}

