output "database_endpoint" {
  description = "RDS database endpoint"
  value       = aws_db_instance.main.endpoint
}

output "database_url" {
  description = "RDS database connection URL"
  value       = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.main.endpoint}/${var.db_name}"
  sensitive   = true
}

output "database_identifier" {
  description = "RDS database identifier"
  value       = aws_db_instance.main.identifier
}

output "database_port" {
  description = "RDS database port"
  value       = aws_db_instance.main.port
}

