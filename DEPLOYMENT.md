# BeMyGuest - Deployment Guide

This guide covers deploying BeMyGuest using Docker in both development and production environments.

## 🏗️ Architecture Overview

### Development (Debug) Environment
- **Client**: React app served by Nginx (port 3000)
- **Server**: Node.js/Express API (port 5000)
- **Database**: PostgreSQL (port 5432)
- **Cache**: Redis (port 6379)
- **All services**: Run locally with Docker Compose

### Production (Release) Environment
- **Client**: Optimized React build with Nginx
- **Server**: Node.js/Express with production optimizations
- **Database**: External (AWS RDS, etc.)
- **Cache**: External Redis (AWS ElastiCache, etc.)
- **Load Balancer**: Nginx (optional scaling)

## 🚀 Quick Start

### Prerequisites
- Docker (20.10+)
- Docker Compose (1.29+)
- Node.js 24.4+ (for local development)
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd Tabsur
cp .env.example .env
# Edit .env with your configuration
```

### 2. Deploy
```bash
# Development environment
./deploy.sh debug

# Production environment
./deploy.sh release
```

## 🔧 Environment Configuration

### Environment Variables

#### Database Configuration
```bash
DB_HOST=localhost              # Database host
DB_PORT=5432                  # Database port
DB_NAME=coolanu_dev           # Database name
DB_USER=postgres              # Database user
DB_PASSWORD=your_password     # Database password
DB_SSL=false                  # SSL connection (true for production)
```

#### Security
```bash
JWT_SECRET=your-super-secret-jwt-key-change-this
```

#### External Services
```bash
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name

# Google Maps
GOOGLE_MAPS_API_KEY=your_api_key

# Firebase Cloud Messaging
FIREBASE_SERVER_KEY=your_firebase_key
```

#### Client Configuration
```bash
REACT_APP_SERVER_HOST=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key
REACT_APP_FIREBASE_CONFIG='{"apiKey":"...","authDomain":"..."}'
```

## 🐳 Docker Commands

### Development Deployment
```bash
# Full deployment
./deploy.sh debug

# Manual Docker Compose
docker-compose -f docker-compose.debug.yml up -d

# View logs
docker-compose -f docker-compose.debug.yml logs -f

# Stop services
docker-compose -f docker-compose.debug.yml down
```

### Production Deployment
```bash
# Full deployment (requires production env vars)
./deploy.sh release

# Manual Docker Compose
docker-compose -f docker-compose.release.yml up -d
```

### Utility Commands
```bash
# Show logs
./deploy.sh logs

# Stop all services
./deploy.sh stop

# Restart services
./deploy.sh restart

# Run tests
./deploy.sh test
```

## 🏥 Health Checks

### Service Health Endpoints
- **Server**: `http://localhost:5000/api/system/health`
- **Client**: `http://localhost:3000/health` (debug only)

### Health Check Response
```json
{
  "DB": true,
  "server": true,
  "mealsCreatedToday": 5,
  "users": 150,
  "onlineUsers": 45,
  "activeMeals": 12
}
```

## 📊 Monitoring & Logging

### Log Locations
- **Application logs**: `./logs/` directory
- **Docker logs**: `docker logs <container-name>`
- **Nginx logs**: Inside nginx containers

### Viewing Logs
```bash
# All services
./deploy.sh logs

# Specific service
docker logs tabsur-server-debug
docker logs tabsur-client-debug

# Follow logs
docker logs -f tabsur-server-debug
```

## 🔒 Security Considerations

### Development
- Default passwords (change in production)
- HTTP connections
- Debug mode enabled
- Exposed database ports

### Production
- Strong JWT secrets
- HTTPS only
- Database SSL enabled
- Limited container resources
- Security headers in Nginx
- No debug information exposed

## 🛠️ Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill processes using ports
sudo lsof -ti:3000,5000,5432 | xargs kill -9

# Or change ports in docker-compose files
```

#### 2. Database Connection Failed
```bash
# Check database is running
docker ps | grep postgres

# Check database logs
docker logs tabsur-db-debug

# Connect to database
docker exec -it tabsur-db-debug psql -U postgres -d coolanu_dev
```

#### 3. Build Failures
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

#### 4. Service Not Healthy
```bash
# Check specific service
curl -f http://localhost:5000/api/system/health

# Check all container statuses
docker ps

# Inspect specific container
docker inspect tabsur-server-debug
```

### Debug Steps
1. Check container status: `docker ps`
2. View logs: `./deploy.sh logs`
3. Check environment variables: `docker exec <container> env`
4. Test endpoints manually: `curl http://localhost:5000/api/system/health`
5. Connect to database: `docker exec -it tabsur-db-debug psql -U postgres`

## 📈 Performance Tuning

### Resource Limits (Production)
- **Server**: 1GB RAM, 0.5 CPU
- **Client**: 256MB RAM, 0.25 CPU
- **Database**: Configure based on load

### Scaling Options
1. **Horizontal scaling**: Multiple server instances with load balancer
2. **Database scaling**: Read replicas, connection pooling
3. **CDN**: Static asset delivery
4. **Caching**: Redis for sessions and data

## 🚨 Production Checklist

- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] SSL certificates installed
- [ ] Domain configured
- [ ] Monitoring setup
- [ ] Log aggregation configured
- [ ] Security scanning completed
- [ ] Performance testing done
- [ ] Disaster recovery plan ready

## 📞 Support

### Getting Help
1. Check this documentation
2. Review logs for errors
3. Check GitHub issues
4. Contact development team

### Useful Commands Reference
```bash
# Quick health check
curl http://localhost:5000/api/system/health

# Database backup
docker exec tabsur-db-debug pg_dump -U postgres coolanu_dev > backup.sql

# Database restore
docker exec -i tabsur-db-debug psql -U postgres coolanu_dev < backup.sql

# Update single service
docker-compose -f docker-compose.debug.yml up -d --no-deps server

# Scale service
docker-compose -f docker-compose.release.yml up -d --scale server=3
```

---

For more information, see the main [README.md](README.md) or development documentation.