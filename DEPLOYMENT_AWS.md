# AWS Deployment Guide for Tabsur

## Overview

This document describes the complete AWS deployment setup for the Tabsur application, including:
- Container registry (ECR)
- Container orchestration (ECS Fargate)
- Load balancing (ALB)
- CI/CD pipeline (CodePipeline)
- Infrastructure as Code (Terraform)

## Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌─────────────┐
│   GitHub    │───▶│ CodePipeline │───▶│ CodeBuild   │───▶│     ECR     │
└─────────────┘    └──────────────┘    └─────────────┘    └─────────────┘
                                                              │
                                                              ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │◀───│      ALB     │◀───│   ECS      │◀───│   ECS      │
│   (Port 80)│    │   (Port 80)  │    │  Fargate   │    │  Fargate   │
└─────────────┘    └──────────────┘    └─────────────┘    └─────────────┘
                              │
                              ▼
                    ┌─────────────┐
                    │   Server    │
                    │ (Port 5000)│
                    └─────────────┘
```

## Prerequisites

1. **AWS CLI** installed and configured
2. **Terraform** installed (version >= 1.0)
3. **Docker** installed locally
4. **GitHub repository** with proper access
5. **AWS credentials** with appropriate permissions

## Required AWS Services

- **ECR**: Container registry for Docker images
- **ECS**: Container orchestration service
- **Fargate**: Serverless compute for containers
- **ALB**: Application Load Balancer for routing
- **VPC**: Virtual Private Cloud with public/private subnets
- **CodePipeline**: CI/CD pipeline orchestration
- **CodeBuild**: Build service for containers
- **IAM**: Identity and access management
- **CloudWatch**: Logging and monitoring
- **ACM**: SSL certificate management (optional)

## Deployment Steps

### 1. Infrastructure Setup
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### 2. Build and Push Images
```bash
# Build images
docker build -t tabsur-client -f Dockerfile.client .
docker build -t tabsur-server -f Dockerfile.server .

# Tag for ECR
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker tag tabsur-client:latest <account-id>.dkr.ecr.<region>.amazonaws.com/tabsur-client:latest
docker tag tabsur-server:latest <account-id>.dkr.ecr.<region>.amazonaws.com/tabsur-server:latest

# Push to ECR
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/tabsur-client:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/tabsur-server:latest
```

### 3. Deploy Application
```bash
# Update ECS service
aws ecs update-service --cluster tabsur-cluster --service tabsur-service --force-new-deployment
```

## Environment Variables

### Client Environment
```bash
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Server Environment
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## Monitoring and Logging

- **CloudWatch Logs**: Container logs
- **CloudWatch Metrics**: ECS service metrics
- **ALB Access Logs**: HTTP request logs
- **ECS Service Events**: Deployment and scaling events

## Scaling

- **Client**: 2-10 instances based on CPU/memory
- **Server**: 2-10 instances based on CPU/memory
- **Auto-scaling**: Based on CPU utilization (70% threshold)

## Security

- **VPC**: Private subnets for containers
- **Security Groups**: Minimal required access
- **IAM Roles**: Least privilege principle
- **Secrets Management**: AWS Secrets Manager for sensitive data

## Cost Optimization

- **Fargate Spot**: For non-production workloads
- **Reserved Capacity**: For production workloads
- **Auto-scaling**: Scale down during low usage
- **S3 Lifecycle**: Clean up old logs and artifacts

## Troubleshooting

### Common Issues

1. **Container Health Checks Failing**
   - Check application logs in CloudWatch
   - Verify health check endpoint is responding

2. **ECS Service Not Starting**
   - Check IAM roles and permissions
   - Verify ECR repository access

3. **ALB Not Routing Traffic**
   - Check target group health
   - Verify security group rules

### Useful Commands

```bash
# Check ECS service status
aws ecs describe-services --cluster tabsur-cluster --services tabsur-service

# View container logs
aws logs tail /ecs/tabsur-service --follow

# Check ALB target health
aws elbv2 describe-target-health --target-group-arn <target-group-arn>
```

## Next Steps

1. Review and customize the Terraform configuration
2. Set up GitHub repository secrets for AWS credentials
3. Configure environment-specific variables
4. Test the deployment pipeline
5. Set up monitoring and alerting
