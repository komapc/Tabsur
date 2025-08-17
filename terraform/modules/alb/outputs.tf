output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = aws_lb.main.arn
}

output "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  value       = aws_lb.main.zone_id
}

output "server_target_group_arn" {
  description = "ARN of the server target group"
  value       = aws_lb_target_group.server.arn
}

output "client_target_group_arn" {
  description = "ARN of the client target group"
  value       = aws_lb_target_group.client.arn
}

output "alb_security_group_id" {
  description = "ID of the ALB security group"
  value       = aws_security_group.alb.id
}

