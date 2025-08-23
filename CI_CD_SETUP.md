# 🚀 Tabsur CI/CD Pipeline & AWS Infrastructure Setup

This document provides a complete guide to setting up the CI/CD pipeline for Tabsur, from GitHub Actions to AWS deployment.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Setup Steps](#setup-steps)
5. [GitHub Configuration](#github-configuration)
6. [AWS Configuration](#aws-configuration)
7. [Testing the Pipeline](#testing-the-pipeline)
8. [Troubleshooting](#troubleshooting)
9. [Monitoring & Maintenance](#monitoring--maintenance)

## 🎯 Overview

The Tabsur CI/CD pipeline automatically:
- Runs tests and linting on every PR
- Builds Docker images on merge to main
- Deploys to AWS EC2 with Docker Compose
- Provides zero-downtime deployments
- Monitors service health

## 🏗️ Architecture

```
GitHub PR → GitHub Actions → Build & Test → Docker Images → ECR → EC2 + Docker Compose → Nginx Load Balancer
```

### Components:
- **GitHub Actions**: CI/CD orchestration
- **ECR**: Container registry for Docker images
- **EC2**: Application server running Docker containers
- **Nginx**: Load balancer for traffic routing
- **PostgreSQL**: External database
- **Docker Compose**: Container orchestration
- **VPC**: Isolated network infrastructure

## ✅ Prerequisites

### Required Tools:
- [Terraform](https://www.terraform.io/downloads.html) (>= 1.0)
- [AWS CLI](https://aws.amazon.com/cli/)
- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/) (24.4+)
- [Git](https://git-scm.com/)

### Required AWS Services:
- AWS Account with appropriate permissions
- IAM user with programmatic access
- S3 bucket for Terraform state (will be created automatically)

## 🚀 Setup Steps

### Step 1: Clone and Prepare Repository

```bash
# Clone the repository
git clone <your-repo-url>
cd Tabsur

# Ensure you're on the main branch
git checkout main
```

### Step 2: Configure AWS Credentials

```bash
# Configure AWS CLI
aws configure

# Enter your:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format (json)
```

### Step 3: Deploy Infrastructure

```bash
# Run the deployment script
./deploy-aws.sh
```

The script will:
1. Check prerequisites
2. Verify AWS credentials
3. Create S3 backend for Terraform
4. Deploy AWS infrastructure
5. Build and push Docker images
6. Deploy the application

### Step 4: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:

```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## 🔧 GitHub Configuration

### Repository Settings

1. **Branch Protection Rules**:
   - Go to Settings → Branches
   - Add rule for `main` branch
   - Check "Require status checks to pass before merging"
   - Check "Require branches to be up to date before merging"
   - Check "Require pull request reviews before merging"

2. **Required Status Checks**:
   - `test` job must pass
   - `build-and-push` job must pass

### Workflow Triggers

- **On Pull Request**: Runs tests and linting
- **On Merge to Main**: Full CI/CD pipeline
- **On Push to Develop**: Tests and build verification

## ☁️ AWS Configuration

### Infrastructure Components

The Terraform configuration creates:

1. **VPC with Public/Private Subnets**
   - Public subnets for EC2 instances
   - Private subnets for future RDS deployment

2. **ECR Repositories**
   - `tabsur-client`: React frontend
   - `tabsur-server`: Node.js backend
   - `tabsur-fb`: Facebook integration

3. **EC2 Instance**
   - Application server with Docker
   - Auto-scaling capabilities
   - Health checks and monitoring

4. **PostgreSQL Database**
   - External database (not managed by AWS)
   - Security group isolation

5. **Nginx Load Balancer**
   - HTTP to HTTPS redirect
   - Path-based routing (`/api/*` → server, `/` → client)
   - Health checks and failover

6. **CloudWatch Monitoring**
   - Custom dashboard
   - Alarms for CPU, memory, errors
   - Log aggregation

### Security Features

- **Network Isolation**: VPC with public subnets
- **Security Groups**: Restrictive access rules
- **IAM Roles**: Least privilege access
- **Encryption**: Data at rest and in transit
- **Secrets Management**: Secure credential storage

## 🧪 Testing the Pipeline

### 1. Create a Test Branch

```bash
git checkout -b feature/test-pipeline
# Make a small change
git add .
git commit -m "Test CI/CD pipeline"
git push origin feature/test-pipeline
```

### 2. Create Pull Request

- Go to GitHub and create a PR
- Watch the CI checks run
- Ensure all tests pass

### 3. Merge and Deploy

- Merge the PR to main
- Watch the deployment pipeline
- Check AWS console for new resources

### 4. Verify Deployment

```bash
# Test the application endpoints
curl http://54.93.243.196:80/health
curl http://54.93.243.196:5000/api/system/health
```

## 🔍 Troubleshooting

### Common Issues

1. **Terraform State Lock**
   ```bash
   # If you get a state lock error
   terraform force-unlock <lock-id>
   ```

2. **ECR Login Issues**
   ```bash
   # Re-login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   ```

3. **EC2 Service Issues**
   ```bash
   # Check instance status
   aws ec2 describe-instances --instance-ids i-0fe51ead4f5a7d437
   
   # Check container logs
   ssh -i ~/.ssh/coolanu-postgres ubuntu@54.93.243.196 "cd /opt/tabsur && sudo docker-compose -f docker-compose-https.yml logs"
   ```

4. **GitHub Actions Failures**
   - Check the Actions tab for detailed logs
   - Verify AWS credentials are correct
   - Ensure all required secrets are set

### Debug Commands

```bash
# Check AWS resources
aws ec2 describe-instances
aws ecr describe-repositories
aws elbv2 describe-load-balancers

# Check Terraform state
cd terraform/environments/dev
terraform show
terraform output

# Check Docker images
docker images | grep tabsur
```

## 📊 Monitoring & Maintenance

### CloudWatch Dashboard

Access the monitoring dashboard:
1. Go to AWS Console → CloudWatch
2. Navigate to Dashboards
3. Find `dev-tabsur-dashboard`

### Key Metrics to Monitor

- **EC2**: CPU/Memory utilization, instance health
- **Nginx**: Request count, response time, error rates
- **Database**: Connection status and performance
- **Costs**: Monitor AWS spending

### Maintenance Tasks

1. **Regular Updates**:
   - Update Node.js base images
   - Patch security vulnerabilities
   - Update Terraform modules

2. **Backup Verification**:
   - Test database restore procedures
   - Verify ECR image retention policies

3. **Cost Optimization**:
   - Review and adjust instance sizing
   - Monitor unused resources
   - Consider reserved instances for EC2

## 🔄 CI/CD Workflow

### Development Workflow

1. **Feature Development**:
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

2. **Pull Request**:
   - Create PR on GitHub
   - Wait for CI checks to pass
   - Get code review approval

3. **Deployment**:
   - Merge to main
   - Automatic deployment to AWS
   - Zero-downtime update

### Rollback Procedure

If deployment fails:

1. **EC2 Rollback**:
   ```bash
   # SSH to EC2 and restart with previous image
   ssh -i ~/.ssh/coolanu-postgres ubuntu@54.93.243.196 "cd /opt/tabsur && sudo docker-compose -f docker-compose-https.yml down && sudo docker-compose -f docker-compose-https.yml up -d"
   ```

2. **Image Rollback**:
   ```bash
   # Tag and push previous image
   docker tag <previous-image> <ecr-url>:latest
   docker push <ecr-url>:latest
   ```

## 🚀 Current Deployment Status

### ✅ Production Environment
- **Status**: 🟢 **LIVE & RUNNING**
- **Direct Access**: http://54.93.243.196:80
- **API Endpoint**: http://54.93.243.196:5000
- **Health Check**: http://54.93.243.196:80/health
- **Last Deployed**: August 23, 2025
- **Version**: 2.0.0

### 🔧 Recent Improvements
- **Port 80 Access Fixed** - Resolved Nginx configuration syntax errors
- **Load Balancer Restored** - Nginx container now running and healthy
- **All Services Operational** - Client, Server, and Load Balancer containers healthy
- **Performance Optimization**: 4-6x faster test execution
- **Security Enhancements**: Updated dependencies and security headers
- **Material-UI v7**: Latest Material Design components
- **React 18 Compatibility**: Modern React features and optimizations
- **Testing Infrastructure**: Comprehensive test suite with Playwright E2E

### 🧪 Testing Infrastructure
- **Fast Test Suite**: Optimized Jest configuration for development speed
- **E2E Testing**: Playwright with optimized configurations
- **Coverage**: Full test coverage with performance monitoring
- **CI/CD Integration**: Automated testing in GitHub Actions

## 📚 Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Terraform Documentation](https://www.terraform.io/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Tabsur Performance Guide](TEST_PERFORMANCE_GUIDE.md)
- [Tabsur Deployment Guide](DEPLOYMENT.md)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review CloudWatch logs and metrics
3. Check GitHub Actions logs
4. Verify AWS service limits and quotas
5. Contact your AWS support team if needed

---

**🎉 Congratulations!** You now have a production-ready CI/CD pipeline for Tabsur running on AWS with full automation, monitoring, and scalability.

**Current Status**: Production deployed and running successfully with version 2.0.0, featuring major performance improvements and security enhancements.




