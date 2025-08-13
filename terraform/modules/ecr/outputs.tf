output "client_repository_url" {
  description = "URL of the client ECR repository"
  value       = aws_ecr_repository.client.repository_url
}

output "server_repository_url" {
  description = "URL of the server ECR repository"
  value       = aws_ecr_repository.server.repository_url
}

output "fb_repository_url" {
  description = "URL of the Facebook ECR repository"
  value       = aws_ecr_repository.fb.repository_url
}

output "client_repository_name" {
  description = "Name of the client ECR repository"
  value       = aws_ecr_repository.client.name
}

output "server_repository_name" {
  description = "Name of the server ECR repository"
  value       = aws_ecr_repository.server.name
}

output "fb_repository_name" {
  description = "Name of the Facebook ECR repository"
  value       = aws_ecr_repository.fb.name
}

