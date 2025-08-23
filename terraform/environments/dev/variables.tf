variable "db_password" {
  description = "Database password for development environment"
  type        = string
  sensitive   = true
}

variable "jwt_secret_arn" {
  description = "ARN of JWT secret in AWS Secrets Manager"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Domain name for the development environment"
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "ARN of SSL certificate for the development environment"
  type        = string
  default     = ""
}






