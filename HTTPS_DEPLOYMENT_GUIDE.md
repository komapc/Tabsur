# 🔒 HTTPS Deployment Guide for bemyguest.dedyn.io

This guide provides step-by-step instructions for deploying your Tabsur application with HTTPS support and fixing CORS issues.

## 📋 Prerequisites

- EC2 instance running Ubuntu 22.04 LTS
- Domain `bemyguest.dedyn.io` configured with DNS records
- SSH access to EC2 instance
- Docker and Docker Compose installed on EC2

## 🚀 Quick Deployment

### Step 1: Set Environment Variables

Create a `.env` file on your EC2 instance:

```bash
# Copy the template
cp env.https.template .env

# Edit with your actual values
nano .env
```

**Required Variables:**
```bash
DB_PASSWORD=your_actual_db_password
JWT_SECRET=your_actual_jwt_secret
GOOGLE_MAPS_API_KEY=your_actual_google_maps_key
REACT_APP_FIREBASE_API_KEY=your_actual_firebase_key
```

### Step 2: Deploy HTTPS Configuration

```bash
# Run the complete deployment script
./scripts/deploy-https-complete.sh
```

This script will:
- Install certbot
- Generate SSL certificates
- Deploy HTTPS configuration
- Start all services
- Configure auto-renewal

## 🔧 Manual Deployment Steps

### Step 1: SSL Certificate Generation

```bash
# Install certbot
sudo apt update
sudo apt install -y certbot

# Stop nginx temporarily
sudo systemctl stop nginx

# Generate certificates for all domains
sudo certbot certonly --standalone \
    -d bemyguest.dedyn.io \
    -d www.bemyguest.dedyn.io \
    -d api.bemyguest.dedyn.io \
    --email admin@bemyguest.dedyn.io \
    --agree-tos \
    --non-interactive
```

### Step 2: Deploy Configuration Files

```bash
# Copy configuration files
scp nginx-https.conf ubuntu@your-ec2-ip:/opt/tabsur/
scp docker-compose.ecr.yml ubuntu@your-ec2-ip:/opt/tabsur/

# SSH to EC2 and start services
ssh ubuntu@your-ec2-ip
cd /opt/tabsur
docker-compose -f docker-compose.ecr.yml up -d
```

### Step 3: Test Deployment

```bash
# Test HTTP redirect
curl -I http://bemyguest.dedyn.io

# Test HTTPS frontend
curl -k https://bemyguest.dedyn.io/health

# Test HTTPS API
curl -k https://api.bemyguest.dedyn.io/health
```

## 🌐 CORS Configuration

### Current CORS Settings

The server is configured with:
```javascript
CORS_ORIGIN=https://bemyguest.dedyn.io
```

### CORS Issues and Solutions

**Problem**: CORS error when accessing from domain
```
Access to XMLHttpRequest at 'http://bemyguest.dedyn.io:8080/api/users/register' 
from origin 'http://bemyguest.dedyn.io' has been blocked by CORS policy
```

**Root Cause**: 
1. Domain not resolving to EC2 IP
2. Client trying to access HTTP instead of HTTPS
3. Port mismatch (8080 vs 80/443)

**Solutions**:

#### 1. Fix DNS Resolution
Ensure your domain points to the EC2 instance:
```bash
# Check current DNS resolution
dig bemyguest.dedyn.io
dig api.bemyguest.dedyn.io

# Should resolve to: 3.72.76.56
```

#### 2. Update Client Configuration
Update client environment variables:
```bash
# In your .env file
REACT_APP_SERVER_HOST=https://api.bemyguest.dedyn.io
```

#### 3. Test HTTPS Endpoints
```bash
# Test from EC2
curl -k https://localhost:8443/health
curl -k https://localhost:8443/api/system/health

# Test from external
curl -k https://bemyguest.dedyn.io/health
curl -k https://api.bemyguest.dedyn.io/health
```

## 🔍 Troubleshooting

### SSL Certificate Issues

**Problem**: Certificate not found
```
cannot load certificate "/etc/letsencrypt/live/api.bemyguest.dedyn.io/fullchain.pem"
```

**Solution**: Use the main domain certificate for all subdomains
```nginx
ssl_certificate /etc/letsencrypt/live/bemyguest.dedyn.io/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/bemyguest.dedyn.io/privkey.pem;
```

### Port Conflicts

**Problem**: Port 80 already allocated
```
Bind for 0.0.0.0:80 failed: port is already allocated
```

**Solution**: Use alternative ports temporarily
```yaml
ports:
  - "8080:80"    # HTTP
  - "8443:443"   # HTTPS
```

### Service Health Issues

**Problem**: Loadbalancer restarting
```bash
# Check logs
docker-compose -f docker-compose.ecr.yml logs loadbalancer

# Check nginx config syntax
docker exec tabsur-lb nginx -t
```

## 📊 Monitoring and Maintenance

### Health Checks

```bash
# Check service status
docker-compose -f docker-compose.ecr.yml ps

# Check individual service health
curl http://localhost:8080/health
curl http://localhost:5000/api/system/health
```

### SSL Certificate Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Manual renewal
sudo certbot renew

# Check certificate expiry
sudo certbot certificates
```

### Logs and Debugging

```bash
# View all logs
docker-compose -f docker-compose.ecr.yml logs

# View specific service logs
docker-compose -f docker-compose.ecr.yml logs server
docker-compose -f docker-compose.ecr.yml logs client
docker-compose -f docker-compose.ecr.yml logs loadbalancer
```

## 🔐 Security Considerations

### SSL Configuration
- TLS 1.2 and 1.3 only
- Strong cipher suites
- HSTS headers enabled
- Security headers configured

### Rate Limiting
- API: 100 requests per 15 minutes
- Login: 5 requests per minute
- Upload: 10 requests per hour

### Security Headers
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Strict-Transport-Security

## 📱 Client Configuration

### Environment Variables
```bash
# Frontend (.env)
REACT_APP_SERVER_HOST=https://api.bemyguest.dedyn.io
REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
REACT_APP_FIREBASE_API_KEY=your_key_here

# Backend (.env)
CORS_ORIGIN=https://bemyguest.dedyn.io
JWT_SECRET=your_secret_here
GOOGLE_MAPS_API_KEY=your_key_here
```

### API Endpoints
```javascript
// Use HTTPS URLs
const API_BASE = 'https://api.bemyguest.dedyn.io';
const FRONTEND_BASE = 'https://bemyguest.dedyn.io';

// Example API calls
fetch(`${API_BASE}/api/users/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
});
```

## 🚀 Production Deployment Checklist

- [ ] Environment variables configured
- [ ] SSL certificates generated
- [ ] DNS records updated
- [ ] HTTPS configuration deployed
- [ ] All services running and healthy
- [ ] CORS configuration tested
- [ ] SSL certificate auto-renewal configured
- [ ] Monitoring and logging enabled
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] Backup strategy implemented

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify SSL certificates: `sudo certbot certificates`
3. Test endpoints locally: `curl -k https://localhost:8443/health`
4. Check DNS resolution: `dig bemyguest.dedyn.io`
5. Verify environment variables are set correctly

## 🔄 Updates and Maintenance

### Regular Maintenance
- Monitor SSL certificate expiry
- Check service health daily
- Review logs for errors
- Update dependencies monthly
- Test backup and restore procedures

### Emergency Procedures
- Service down: `docker-compose restart`
- SSL issues: `sudo certbot renew`
- Port conflicts: Restart Docker service
- Configuration errors: Check nginx syntax
