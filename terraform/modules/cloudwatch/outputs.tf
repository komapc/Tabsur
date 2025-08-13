output "dashboard_name" {
  description = "Name of the CloudWatch dashboard"
  value       = aws_cloudwatch_dashboard.main.dashboard_name
}

output "dashboard_arn" {
  description = "ARN of the CloudWatch dashboard"
  value       = aws_cloudwatch_dashboard.main.dashboard_arn
}

output "log_group_names" {
  description = "Names of CloudWatch log groups"
  value       = [
    aws_cloudwatch_dashboard.main.dashboard_name
  ]
}


