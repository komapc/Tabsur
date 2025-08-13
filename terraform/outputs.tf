output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = module.vpc.private_subnet_ids
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.vpc.public_subnet_ids
}

output "ecr_client_repository_url" {
  description = "URL of the client ECR repository"
  value       = module.ecr.client_repository_url
}

output "ecr_server_repository_url" {
  description = "URL of the server ECR repository"
  value       = module.ecr.server_repository_url
}

output "ecr_fb_repository_url" {
  description = "URL of the Facebook ECR repository"
  value       = module.ecr.fb_repository_url
}

output "database_endpoint" {
  description = "RDS database endpoint"
  value       = module.rds.database_endpoint
}

output "database_url" {
  description = "RDS database connection URL"
  value       = module.rds.database_url
  sensitive   = true
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = module.alb.alb_dns_name
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs.cluster_name
}

output "ecs_client_service_name" {
  description = "Name of the client ECS service"
  value       = module.ecs.client_service_name
}

output "ecs_server_service_name" {
  description = "Name of the server ECS service"
  value       = module.ecs.server_service_name
}

output "cloudwatch_log_groups" {
  description = "Names of CloudWatch log groups"
  value       = module.cloudwatch.log_group_names
}

