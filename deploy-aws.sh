#!/bin/bash

# Tabsur AWS Deployment Script
# This script helps deploy the Tabsur application to AWS using Terraform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists terraform; then
        print_error "Terraform is not installed. Please install Terraform first."
        exit 1
    fi
    
    if ! command_exists aws; then
        print_error "AWS CLI is not installed. Please install AWS CLI first."
        exit 1
    fi
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    print_success "All prerequisites are satisfied!"
}

# Function to check AWS credentials
check_aws_credentials() {
    print_status "Checking AWS credentials..."
    
    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        print_error "AWS credentials are not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    AWS_REGION=$(aws configure get region)
    
    print_success "AWS credentials are configured for account: $AWS_ACCOUNT_ID in region: $AWS_REGION"
}

# Function to create S3 backend bucket
create_s3_backend() {
    print_status "Creating S3 backend bucket for Terraform state..."
    
    BUCKET_NAME="tabsur-terraform-state-${AWS_ACCOUNT_ID}"
    
    if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
        aws s3 mb "s3://$BUCKET_NAME" --region "$AWS_REGION"
        aws s3api put-bucket-versioning --bucket "$BUCKET_NAME" --versioning-configuration Status=Enabled
        aws s3api put-bucket-encryption --bucket "$BUCKET_NAME" --server-side-encryption-configuration '{
            "Rules": [
                {
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256"
                    }
                }
            ]
        }'
        print_success "S3 backend bucket created: $BUCKET_NAME"
    else
        print_warning "S3 backend bucket already exists: $BUCKET_NAME"
    fi
}

# Function to deploy infrastructure
deploy_infrastructure() {
    print_status "Deploying infrastructure..."
    
    cd terraform/environments/dev
    
    # Initialize Terraform
    print_status "Initializing Terraform..."
    terraform init
    
    # Plan the deployment
    print_status "Planning Terraform deployment..."
    terraform plan -var-file="terraform.tfvars"
    
    # Ask for confirmation
    read -p "Do you want to proceed with the deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Deployment cancelled by user."
        exit 0
    fi
    
    # Apply the deployment
    print_status "Applying Terraform deployment..."
    terraform apply -var-file="terraform.tfvars" -auto-approve
    
    print_success "Infrastructure deployment completed!"
    
    # Get outputs
    print_status "Getting deployment outputs..."
    terraform output
    
    cd ../../..
}

# Function to build and push Docker images
build_and_push_images() {
    print_status "Building and pushing Docker images..."
    
    # Get ECR repository URLs from Terraform output
    cd terraform/environments/dev
    ECR_CLIENT_URL=$(terraform output -raw ecr_client_repository_url)
    ECR_SERVER_URL=$(terraform output -raw ecr_server_repository_url)
    cd ../../..
    
    # Login to ECR
    print_status "Logging in to ECR..."
    aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ECR_CLIENT_URL"
    
    # Build and push client image
    print_status "Building and pushing client image..."
    docker build -t "$ECR_CLIENT_URL:latest" -f Dockerfile.client .
    docker push "$ECR_CLIENT_URL:latest"
    
    # Build and push server image
    print_status "Building and pushing server image..."
    docker build -t "$ECR_SERVER_URL:latest" -f Dockerfile.server .
    docker push "$ECR_SERVER_URL:latest"
    
    print_success "Docker images built and pushed successfully!"
}

# Function to deploy application
deploy_application() {
    print_status "Deploying application to ECS..."
    
    cd terraform/environments/dev
    
    # Get ECS cluster and service names
    ECS_CLUSTER=$(terraform output -raw ecs_cluster_name)
    ECS_CLIENT_SERVICE=$(terraform output -raw ecs_client_service_name)
    ECS_SERVER_SERVICE=$(terraform output -raw ecs_server_service_name)
    
    cd ../../..
    
    # Force new deployment
    print_status "Updating client service..."
    aws ecs update-service --cluster "$ECS_CLUSTER" --service "$ECS_CLIENT_SERVICE" --force-new-deployment
    
    print_status "Updating server service..."
    aws ecs update-service --cluster "$ECS_CLUSTER" --service "$ECS_SERVER_SERVICE" --force-new-deployment
    
    # Wait for services to stabilize
    print_status "Waiting for services to stabilize..."
    aws ecs wait services-stable --cluster "$ECS_CLUSTER" --services "$ECS_CLIENT_SERVICE" "$ECS_SERVER_SERVICE"
    
    print_success "Application deployment completed!"
}

# Function to show deployment status
show_status() {
    print_status "Showing deployment status..."
    
    cd terraform/environments/dev
    
    ECS_CLUSTER=$(terraform output -raw ecs_cluster_name)
    ECS_CLIENT_SERVICE=$(terraform output -raw ecs_client_service_name)
    ECS_SERVER_SERVICE=$(terraform output -raw ecs_server_service_name)
    ALB_DNS=$(terraform output -raw alb_dns_name)
    
    cd ../../..
    
    echo
    print_success "Deployment Summary:"
    echo "  ECS Cluster: $ECS_CLUSTER"
    echo "  Client Service: $ECS_CLIENT_SERVICE"
    echo "  Server Service: $ECS_SERVER_SERVICE"
    echo "  Load Balancer: $ALB_DNS"
    echo
    print_status "You can access your application at: http://$ALB_DNS"
    echo
}

# Main function
main() {
    echo "🚀 Tabsur AWS Deployment Script"
    echo "================================"
    echo
    
    # Check prerequisites
    check_prerequisites
    
    # Check AWS credentials
    check_aws_credentials
    
    # Create S3 backend
    create_s3_backend
    
    # Deploy infrastructure
    deploy_infrastructure
    
    # Build and push images
    build_and_push_images
    
    # Deploy application
    deploy_application
    
    # Show status
    show_status
    
    print_success "🎉 Deployment completed successfully!"
    echo
    print_status "Next steps:"
    echo "  1. Configure your domain name to point to the ALB DNS name"
    echo "  2. Set up SSL certificate if needed"
    echo "  3. Configure GitHub repository secrets for CI/CD"
    echo "  4. Test your application"
    echo
}

# Check if script is being sourced
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi



