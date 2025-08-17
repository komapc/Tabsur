# Tabsur - Social Dining Platform

A modern social dining platform built with React, Node.js, and PostgreSQL, featuring real-time chat, meal coordination, and location-based services.

## 🚀 Current Status

**✅ PRODUCTION DEPLOYED AND OPERATIONAL**

- **Frontend**: ✅ Working perfectly through ALB
- **Backend API**: ✅ Working perfectly through ALB  
- **Infrastructure**: ✅ ALB + Auto Scaling + ECR fully deployed
- **Domain**: ⚠️ Pending DNS configuration for `bemyguest.dedyn.io`
- **HTTPS**: ⚠️ SSL certificate created, pending domain validation

## 🌐 Access URLs

### Production (Current)
- **Frontend**: http://prod-tabsur-alb-2109180600.eu-central-1.elb.amazonaws.com/
- **Backend API**: http://prod-tabsur-alb-2109180600.eu-central-1.elb.amazonaws.com/api/system/health
- **Health Check**: http://prod-tabsur-alb-2109180600.eu-central-1.elb.amazonaws.com/health

### Domain (Pending DNS Configuration)
- **Frontend**: https://bemyguest.dedyn.io/ (once configured)
- **Backend API**: https://bemyguest.dedyn.io/api/system/health (once configured)

## 🏗️ Architecture

### Infrastructure (AWS)
- **Application Load Balancer (ALB)**: Routes traffic to frontend/backend
- **Auto Scaling Group**: Automatically scales EC2 instances based on demand
- **ECR**: Container registry for Docker images
- **EC2**: Application servers running Docker containers
- **VPC**: Isolated network with public subnets
- **Security Groups**: Firewall rules for ALB and application instances

### Application Stack
- **Frontend**: React + Redux + Material-UI + Google Maps API
- **Backend**: Node.js + Express + PostgreSQL + JWT
- **Database**: PostgreSQL (external, not managed by AWS)
- **Load Balancer**: Nginx (containerized)
- **Containerization**: Docker + Docker Compose

## 🚀 Quick Start

### Local Development
```bash
# Start local development environment
docker-compose -f docker-compose.debug.yml up -d

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Database: localhost:5432
```

### Production Deployment
```bash
# Complete production deployment
./scripts/deploy-production.sh

# Or step by step:
# 1. Deploy infrastructure
cd terraform && terraform apply

# 2. Deploy application
./fast-ecr-deploy.sh
```

## 📋 Prerequisites

- AWS CLI configured with appropriate permissions
- Docker and Docker Compose
- Terraform
- Node.js 18+ (for local development)

## 🔧 Configuration

### Environment Variables
Copy `env.example` to `.env` and configure:
- Database connection details
- JWT secret
- Google Maps API key
- AWS credentials

### AWS Configuration
- Region: `eu-central-1`
- VPC CIDR: `172.16.0.0/16`
- Public Subnets: `172.16.1.0/24` (2 subnets for ALB)

## 📚 Documentation

- [HTTPS Setup Guide](HTTPS_SETUP.md) - Configure SSL and domain
- [Deployment Guide](DEPLOYMENT.md) - Detailed deployment instructions
- [Infrastructure Summary](ALB_Infrastructure_Summary.md) - ALB and auto-scaling details

## 🔍 Monitoring & Health Checks

### Health Endpoints
- **Frontend**: `/health` - Returns "healthy" if React app is running
- **Backend**: `/api/system/health` - Returns server status and database connectivity

### AWS Monitoring
- CloudWatch alarms for CPU utilization
- Auto-scaling based on CPU metrics
- ALB target group health checks

## 🚨 Troubleshooting

### Common Issues
1. **Server container restarting**: Check logs for missing modules
2. **ALB returning 502**: Verify target group health and container status
3. **Domain not resolving**: Check DNS configuration for `bemyguest.dedyn.io`

### Debug Commands
```bash
# Check container status
ssh ubuntu@[INSTANCE_IP] "cd /opt/tabsur && sudo docker-compose -f docker-compose.ecr.yml ps"

# Check container logs
ssh ubuntu@[INSTANCE_IP] "cd /opt/tabsur && sudo docker-compose -f docker-compose.ecr.yml logs server"

# Test ALB health
curl -f http://prod-tabsur-alb-2109180600.eu-central-1.elb.amazonaws.com/health
```

## 🔐 Security

- JWT-based authentication
- CORS configured for production
- Security headers enabled (HSTS, CSP, XSS protection)
- Rate limiting implemented
- Input sanitization and validation

## 📈 Performance

- Multi-stage Docker builds for optimized images
- Auto-scaling based on CPU utilization
- Load balancer with health checks
- Containerized services for easy scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

---

**Last Updated**: August 17, 2025  
**Deployment Status**: ✅ Production Operational  
**Next Steps**: Configure domain DNS and enable HTTPS