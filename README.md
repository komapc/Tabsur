# Tabsur - Social Dining Platform

A modern social dining platform built with React, Node.js, and PostgreSQL, featuring real-time chat, meal coordination, and location-based services.

## 🚀 Current Status

**✅ PRODUCTION DEPLOYED AND OPERATIONAL**

- **Frontend**: ✅ Working perfectly on EC2 direct access
- **Backend API**: ✅ Working perfectly on EC2 direct access  
- **Infrastructure**: ✅ EC2 + Docker + Nginx load balancer fully deployed
- **Direct Access**: ✅ Working via EC2 IP address
- **Domain**: ⚠️ Pending DNS configuration for `bemyguest.dedyn.io`
- **HTTPS**: ⚠️ SSL certificate created, pending domain validation

## 🌐 Access URLs

### Production (Current - Working)
- **Frontend**: http://54.93.243.196:80
- **Backend API**: http://54.93.243.196:5000/api/system/health
- **Health Check**: http://54.93.243.196:80/health

### Domain (Pending DNS Configuration)
- **Frontend**: https://bemyguest.dedyn.io/ (once configured)
- **Backend API**: https://bemyguest.dedyn.io/api/system/health (once configured)

## 🏗️ Architecture

### Infrastructure (Current)
- **EC2 Instance**: Running Docker containers with Nginx load balancer
- **Docker Services**: Client, Server, and Nginx load balancer
- **Nginx Load Balancer**: Routes traffic between frontend and backend
- **PostgreSQL**: External database (not managed by AWS)
- **Security Groups**: Firewall rules for EC2 instance

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

### Production Access
```bash
# Access the live application
# Frontend: http://54.93.243.196:80
# Backend: http://54.93.243.196:5000
# Health: http://54.93.243.196:80/health
```

## 📋 Prerequisites

- AWS CLI configured with appropriate permissions
- Docker and Docker Compose
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
- Instance: `i-0fe51ead4f5a7d437`
- Public IP: `54.93.243.196`
- Private IP: `172.16.1.88`

## 📚 Documentation

- [HTTPS Setup Guide](HTTPS_SETUP.md) - Configure SSL and domain
- [Deployment Guide](DEPLOYMENT.md) - Detailed deployment instructions
- [ALB Implementation Summary](ALB_IMPLEMENTATION_SUMMARY.md) - Infrastructure details

## 🔍 Monitoring & Health Checks

### Health Endpoints
- **Frontend**: `http://54.93.243.196:80/health` - Returns "healthy" if React app is running
- **Backend**: `http://54.93.243.196:5000/api/system/health` - Returns server status and database connectivity

### Docker Services Monitoring
- **Client**: React frontend container
- **Server**: Node.js backend container  
- **Load Balancer**: Nginx routing container

## 🚨 Troubleshooting

### Common Issues
1. **Port 80 not accessible**: Check Nginx load balancer container status
2. **API returning errors**: Check server container logs
3. **Frontend not loading**: Check client container status

### Debug Commands
```bash
# Check container status
ssh -i ~/.ssh/coolanu-postgres ubuntu@54.93.243.196 "cd /opt/tabsur && sudo docker-compose -f docker-compose-https.yml ps"

# Check container logs
ssh -i ~/.ssh/coolanu-postgres ubuntu@54.93.243.196 "cd /opt/tabsur && sudo docker-compose -f docker-compose-https.yml logs server"

# Test endpoints
curl http://54.93.243.196:80/health
curl http://54.93.243.196:5000/api/system/health
```

## 🔐 Security

- JWT-based authentication
- CORS configured for production
- Security headers enabled (HSTS, CSP, XSS protection)
- Rate limiting implemented
- Input sanitization and validation

## 📈 Performance

- Multi-stage Docker builds for optimized images
- Nginx load balancer with health checks
- Containerized services for easy scaling
- Optimized React production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

---

**Last Updated**: August 23, 2025  
**Deployment Status**: ✅ Production Operational via EC2 Direct Access  
**Next Steps**: Configure domain DNS and enable HTTPS