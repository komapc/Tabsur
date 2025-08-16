# 🌐 Domain Setup Guide for bemyguest.dedyn.io

This guide explains how to set up your Tabsur application with the domain `bemyguest.dedyn.io` using deSEC.io DNS management.

## 📋 Overview

- **Main Domain**: `bemyguest.dedyn.io` (Frontend)
- **API Domain**: `api.bemyguest.dedyn.io` (Backend)
- **DNS Provider**: deSEC.io
- **Authorization Token**: `yNoJQUBJAsodeSJ2pJRAZyM5fTSv`

## 🚀 Quick Start

### 1. Update DNS Records

Run the DNS update script to point your domain to your EC2 server:

```bash
./scripts/update-desec-dns.sh
```

This script will:
- Detect your current public IP address
- Update A records for both domains
- Create CNAME for www subdomain
- Add verification TXT record

### 2. Deploy with Domain Configuration

Deploy your application with the new domain setup:

```bash
./scripts/deploy-domain.sh
```

## 🔧 Manual DNS Configuration

If you prefer to configure DNS manually through the deSEC.io web interface:

### A Records
- **Root Domain**: `bemyguest.dedyn.io` → `YOUR_EC2_IP`
- **API Subdomain**: `api.bemyguest.dedyn.io` → `YOUR_EC2_IP`

### CNAME Records
- **www**: `www.bemyguest.dedyn.io` → `bemyguest.dedyn.io`

### TXT Records
- **Verification**: Add a TXT record with any value for verification

## 📁 Configuration Files

### 1. `nginx-domain.conf`
- Optimized nginx configuration for domain setup
- Separate server blocks for frontend and API
- Rate limiting and security headers
- SSL-ready configuration

### 2. `docker-compose.ecr.yml`
- Updated with domain-specific environment variables
- CORS configured for `https://bemyguest.dedyn.io`
- API endpoint configured for `https://api.bemyguest.dedyn.io`

### 3. `env.domain`
- Environment configuration template
- All necessary variables for domain deployment
- Update with your actual values before deployment

## 🔒 SSL/HTTPS Setup

### Option 1: Let's Encrypt (Recommended)
```bash
# Install certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d bemyguest.dedyn.io -d www.bemyguest.dedyn.io
sudo certbot --nginx -d api.bemyguest.dedyn.io

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Option 2: Self-Signed Certificates (Development)
```bash
# Generate self-signed certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/bemyguest.dedyn.io.key \
  -out /etc/ssl/certs/bemyguest.dedyn.io.crt
```

## 🌍 Environment Variables

Update your environment variables:

```bash
# Copy template
cp env.domain .env

# Edit with your values
nano .env
```

Key variables to update:
- `DB_PASSWORD`: Your database password
- `JWT_SECRET`: Your JWT secret key
- `GOOGLE_MAPS_API_KEY`: Your Google Maps API key
- `GOOGLE_FIREBASE_CLOUD_MESSAGING_SERVER_KEY`: Your Firebase key

## 🐳 Docker Deployment

### Build and Push Images
```bash
# Login to ECR
aws ecr get-login-password --region eu-central-1 | \
  docker login --username AWS --password-stdin 272007598366.dkr.ecr.eu-central-1.amazonaws.com

# Build images
docker build -f Dockerfile.server.multistage -t 272007598366.dkr.ecr.eu-central-1.amazonaws.com/tabsur-server:latest .
docker build -f Dockerfile.client.multistage -t 272007598366.dkr.ecr.eu-central-1.amazonaws.com/tabsur-client:latest .

# Push images
docker push 272007598366.dkr.ecr.eu-central-1.amazonaws.com/tabsur-server:latest
docker push 272007598366.dkr.ecr.eu-central-1.amazonaws.com/tabsur-client:latest
```

### Deploy to EC2
```bash
# Copy configuration files
scp -i ~/.ssh/coolanu-postgres docker-compose.ecr.yml ubuntu@3.72.76.56:/opt/tabsur/
scp -i ~/.ssh/coolanu-postgres nginx-domain.conf ubuntu@3.72.76.56:/opt/tabsur/

# Deploy
ssh -i ~/.ssh/coolanu-postgres ubuntu@3.72.76.56
cd /opt/tabsur
docker-compose -f docker-compose.ecr.yml up -d
```

## 🧪 Testing

### Health Checks
```bash
# Test main domain
curl -f https://bemyguest.dedyn.io/health

# Test API domain
curl -f https://api.bemyguest.dedyn.io/health
```

### DNS Propagation
```bash
# Check DNS propagation
dig bemyguest.dedyn.io
dig api.bemyguest.dedyn.io

# Check from different locations
nslookup bemyguest.dedyn.io 8.8.8.8
nslookup api.bemyguest.dedyn.io 1.1.1.1
```

## 🔍 Troubleshooting

### Common Issues

1. **DNS Not Propagated**
   - Wait 5-15 minutes for propagation
   - Check with different DNS servers
   - Verify deSEC.io configuration

2. **SSL Certificate Issues**
   - Ensure domain points to correct IP
   - Check firewall settings (ports 80, 443)
   - Verify nginx configuration

3. **Connection Refused**
   - Check EC2 security groups
   - Verify Docker containers are running
   - Check nginx logs: `docker logs tabsur-lb`

### Logs
```bash
# Check container logs
docker logs tabsur-server
docker logs tabsur-client
docker logs tabsur-lb

# Check nginx logs
docker exec tabsur-lb tail -f /var/log/nginx/error.log
```

## 📊 Monitoring

### Health Monitoring
- **Frontend**: `https://bemyguest.dedyn.io/health`
- **API**: `https://api.bemyguest.dedyn.io/health`
- **Load Balancer**: `http://localhost:8080/health`

### Performance Monitoring
```bash
# Check container resources
docker stats

# Check nginx status
docker exec tabsur-lb nginx -t
```

## 🔄 Updates and Maintenance

### Regular DNS Updates
If your EC2 IP changes, update DNS:
```bash
./scripts/update-desec-dns.sh
```

### Application Updates
```bash
# Pull latest images and redeploy
docker-compose -f docker-compose.ecr.yml pull
docker-compose -f docker-compose.ecr.yml up -d
```

### SSL Certificate Renewal
```bash
# Let's Encrypt auto-renewal
sudo certbot renew

# Restart nginx after renewal
docker restart tabsur-lb
```

## 📞 Support

- **deSEC.io**: DNS management issues
- **AWS Support**: EC2 and ECR issues
- **Let's Encrypt**: SSL certificate issues
- **Project Issues**: Application-specific problems

## 📝 Notes

- DNS changes may take 5-15 minutes to propagate
- SSL certificates require valid DNS resolution
- Keep your deSEC authorization token secure
- Regular backups of configuration files recommended
- Monitor SSL certificate expiration dates
