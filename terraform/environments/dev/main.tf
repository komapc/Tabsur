terraform {
  required_version = ">= 1.0"
  
  backend "s3" {
    bucket = "tabsur-terraform-state"
    key    = "environments/dev/terraform.tfstate"
    region = "us-east-1"
  }
}

module "tabsur" {
  source = "../../"
  
  environment = "dev"
  aws_region = "us-east-1"
  
  vpc_cidr = "10.0.0.0/16"
  availability_zones = ["us-east-1a", "us-east-1b"]
  private_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnet_cidrs = ["10.0.101.0/24", "10.0.102.0/24"]
  
  db_name = "coolanu_dev"
  db_username = "coolanu"
  db_password = var.db_password
  db_instance_class = "db.t3.micro"
  
  jwt_secret_arn = var.jwt_secret_arn
  domain_name = var.domain_name
  certificate_arn = var.certificate_arn
}




