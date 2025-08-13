terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "tabsur-terraform-state"
    key    = "terraform.tfstate"
    region = "eu-west-1"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "Tabsur"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# VPC and Networking
module "vpc" {
  source = "./modules/vpc"
  
  environment    = var.environment
  vpc_cidr      = var.vpc_cidr
  azs           = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs
}

# ECR Repositories
module "ecr" {
  source = "./modules/ecr"
  
  environment = var.environment
}

# RDS Database
module "rds" {
  source = "./modules/rds"
  
  environment     = var.environment
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.private_subnet_ids
  db_name        = var.db_name
  db_username    = var.db_username
  db_password    = var.db_password
  db_instance_class = var.db_instance_class
}

# Application Load Balancer
module "alb" {
  source = "./modules/alb"
  
  environment = var.environment
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.public_subnet_ids
}

# ECS Cluster and Services
module "ecs" {
  source = "./modules/ecs"
  
  environment           = var.environment
  vpc_id               = module.vpc.vpc_id
  subnet_ids           = module.vpc.private_subnet_ids
  security_group_id    = module.vpc.default_security_group_id
  target_group_arn     = module.alb.target_group_arn
  ecr_repository_client_url = module.ecr.client_repository_url
  ecr_repository_server_url = module.ecr.server_repository_url
  database_url         = module.rds.database_url
  jwt_secret_arn       = var.jwt_secret_arn
}

# CloudWatch Log Groups
module "cloudwatch" {
  source = "./modules/cloudwatch"
  
  environment = var.environment
}

# IAM Roles
module "iam" {
  source = "./modules/iam"
  
  environment = var.environment
}

