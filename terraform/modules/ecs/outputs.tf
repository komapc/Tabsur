output "cluster_id" {
  description = "ID of the ECS cluster"
  value       = aws_ecs_cluster.main.id
}

output "cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "cluster_arn" {
  description = "ARN of the ECS cluster"
  value       = aws_ecs_cluster.main.arn
}

output "client_service_name" {
  description = "Name of the client ECS service"
  value       = aws_ecs_service.client.name
}

output "server_service_name" {
  description = "Name of the server ECS service"
  value       = aws_ecs_service.server.name
}

output "client_task_definition_arn" {
  description = "ARN of the client task definition"
  value       = aws_ecs_task_definition.client.arn
}

output "server_task_definition_arn" {
  description = "ARN of the server task definition"
  value       = aws_ecs_task_definition.server.arn
}

output "client_log_group" {
  description = "Name of the client CloudWatch log group"
  value       = aws_cloudwatch_log_group.client.name
}

output "server_log_group" {
  description = "Name of the server CloudWatch log group"
  value       = aws_cloudwatch_log_group.server.name
}

