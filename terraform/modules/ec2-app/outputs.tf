output "instance_ids" {
  description = "IDs of the created EC2 instances"
  value       = aws_instance.app[*].id
}

output "instance_public_ips" {
  description = "Public IP addresses of the created EC2 instances"
  value       = aws_instance.app[*].public_ip
}

output "instance_private_ips" {
  description = "Private IP addresses of the created EC2 instances"
  value       = aws_instance.app[*].private_ip
}

output "security_group_id" {
  description = "ID of the security group for the application instances"
  value       = aws_security_group.app.id
}

output "auto_scaling_group_name" {
  description = "Name of the Auto Scaling Group"
  value       = aws_autoscaling_group.app.name
}

output "auto_scaling_group_arn" {
  description = "ARN of the Auto Scaling Group"
  value       = aws_autoscaling_group.app.arn
}

output "launch_template_id" {
  description = "ID of the launch template"
  value       = aws_launch_template.app.id
}

output "launch_template_latest_version" {
  description = "Latest version of the launch template"
  value       = aws_launch_template.app.latest_version
}
