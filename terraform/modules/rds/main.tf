resource "aws_db_subnet_group" "main" {
  name       = "${var.environment}-coolanu-db-subnet-group"
  subnet_ids = var.subnet_ids
  
  tags = {
    Name = "${var.environment}-coolanu-db-subnet-group"
  }
}

resource "aws_db_parameter_group" "main" {
  family = "postgres15"
  name   = "${var.environment}-coolanu-db-params"
  
  parameter {
    name  = "log_connections"
    value = "1"
  }
  
  parameter {
    name  = "log_disconnections"
    value = "1"
  }
  
  tags = {
    Name = "${var.environment}-coolanu-db-params"
  }
}

resource "aws_db_instance" "main" {
  identifier = "coolanu"  # Use current AWS database name
  
  engine         = "postgres"
  engine_version = "15.7"  # Updated from 11.22 to 15.7
  instance_class = var.db_instance_class
  
  allocated_storage     = 5  # Reduced to 5GB for maximum cost savings
  max_allocated_storage = 100
  storage_type          = "gp2"  # Changed back to GP2 since GP3 not available for PostgreSQL 15.7
  storage_encrypted     = true
  
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [var.security_group_id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  parameter_group_name   = aws_db_parameter_group.main.name
  
  backup_retention_period = 3  # Updated from 7 to 3 days (our optimization)
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  multi_az               = false
  publicly_accessible    = false  # Updated to false for security
  skip_final_snapshot    = false
  final_snapshot_identifier = "${var.environment}-coolanu-db-final-snapshot"
  
  deletion_protection = true  # Updated to true for safety
  
  # Disable enhanced monitoring for cost savings
  monitoring_interval = 0
  
  tags = {
    Name = "coolanu"
    Environment = var.environment
  }
}

# CloudWatch alarms for monitoring (simplified for cost savings)
resource "aws_cloudwatch_metric_alarm" "cpu" {
  alarm_name          = "${var.environment}-coolanu-db-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  
  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.id
  }
  
  alarm_description = "This metric monitors RDS CPU utilization"
}

resource "aws_cloudwatch_metric_alarm" "free_storage" {
  alarm_name          = "${var.environment}-coolanu-db-free-storage"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "1000000000" # 1GB in bytes
  
  alarm_description = "This metric monitors RDS free storage space"
}

