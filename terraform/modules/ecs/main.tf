resource "aws_ecs_cluster" "main" {
  name = "${var.environment}-tabsur-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  
  configuration {
    execute_command_configuration {
      logging = "DEFAULT"
    }
  }
  
  tags = {
    Name = "${var.environment}-tabsur-cluster"
  }
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "client" {
  name              = "/ecs/${var.environment}-tabsur-client"
  retention_in_days = 30
  
  tags = {
    Name = "${var.environment}-tabsur-client-logs"
  }
}

resource "aws_cloudwatch_log_group" "server" {
  name              = "/ecs/${var.environment}-tabsur-server"
  retention_in_days = 30
  
  tags = {
    Name = "${var.environment}-tabsur-server-logs"
  }
}

# Task Definitions
resource "aws_ecs_task_definition" "client" {
  family                   = "${var.environment}-tabsur-client"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn
  
  container_definitions = jsonencode([
    {
      name  = "client"
      image = "${var.ecr_repository_client_url}:latest"
      
      portMappings = [
        {
          containerPort = 80
          protocol      = "tcp"
        }
      ]
      
      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.client.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
      
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:80/ || exit 1"]
        interval   = 30
        timeout    = 5
        retries    = 3
        startPeriod = 60
      }
    }
  ])
  
  tags = {
    Name = "${var.environment}-tabsur-client-task"
  }
}

resource "aws_ecs_task_definition" "server" {
  family                   = "${var.environment}-tabsur-server"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn
  
  container_definitions = jsonencode([
    {
      name  = "server"
      image = "${var.ecr_repository_server_url}:latest"
      
      portMappings = [
        {
          containerPort = 5000
          protocol      = "tcp"
        }
      ]
      
      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment
        },
        {
          name  = "PORT"
          value = "5000"
        }
      ]
      
      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = var.database_url
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.server.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
      
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:5000/api/system/health || exit 1"]
        interval   = 30
        timeout    = 10
        retries    = 3
        startPeriod = 60
      }
    }
  ])
  
  tags = {
    Name = "${var.environment}-tabsur-server-task"
  }
}

# ECS Services
resource "aws_ecs_service" "client" {
  name            = "${var.environment}-tabsur-client-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.client.arn
  desired_count   = 2
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets         = var.subnet_ids
    security_groups = [var.security_group_id]
    assign_public_ip = false
  }
  
  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = "client"
    container_port   = 80
  }
  
  depends_on = []
  
  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }
  
  deployment_controller {
    type = "ECS"
  }
  
  tags = {
    Name = "${var.environment}-tabsur-client-service"
  }
}

resource "aws_ecs_service" "server" {
  name            = "${var.environment}-tabsur-server-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.server.arn
  desired_count   = 2
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets         = var.subnet_ids
    security_groups = [var.security_group_id]
    assign_public_ip = false
  }
  
  load_balancer {
    target_group_arn = var.server_target_group_arn
    container_name   = "server"
    container_port   = 5000
  }
  
  depends_on = []
  
  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }
  
  deployment_controller {
    type = "ECS"
  }
  
  tags = {
    Name = "${var.environment}-tabsur-server-service"
  }
}

# Auto Scaling
resource "aws_appautoscaling_target" "client" {
  max_capacity       = 4
  min_capacity       = 2
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.client.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_target" "server" {
  max_capacity       = 4
  min_capacity       = 2
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.server.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "client_cpu" {
  name               = "${var.environment}-tabsur-client-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.client.resource_id
  scalable_dimension = aws_appautoscaling_target.client.scalable_dimension
  service_namespace  = aws_appautoscaling_target.client.service_namespace
  
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
  }
}

resource "aws_appautoscaling_policy" "server_cpu" {
  name               = "${var.environment}-tabsur-server-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.server.resource_id
  scalable_dimension = aws_appautoscaling_target.server.scalable_dimension
  service_namespace  = aws_appautoscaling_target.server.service_namespace
  
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
  }
}
