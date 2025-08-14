output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.postgres.id
}

output "private_ip" {
  description = "Private IP address of the EC2 instance"
  value       = aws_instance.postgres.private_ip
}

output "public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.postgres.public_ip
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.postgres.id
}
