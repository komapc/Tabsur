# 🌐 Web Deployment Guide for Tabsur

## **🎯 Current Status**
Your Tabsur application is currently running **locally only** and needs to be deployed to make it accessible from the web.

## **🚀 Deployment Options**

### **Option 1: Deploy to Your EC2 Instance (Recommended)**
Since you already have an EC2 instance running PostgreSQL, you can deploy your app there.

**Pros:**
- ✅ Already have infrastructure
- ✅ No additional costs
- ✅ Full control over deployment
- ✅ Can use existing database

**Cons:**
- ⚠️ Single point of failure
- ⚠️ Manual scaling required
- ⚠️ Need to manage server maintenance

### **Option 2: Deploy to AWS ECS/Fargate**
Use AWS managed container service.

**Pros:**
- ✅ Fully managed by AWS
- ✅ Auto-scaling capabilities
- ✅ High availability
- ✅ Load balancer included

**Cons:**
- ❌ Additional costs (~$15-30/month)
- ❌ More complex setup
- ❌ AWS vendor lock-in

### **Option 3: Deploy to Vercel/Netlify (Frontend) + Railway (Backend)**
Use modern deployment platforms.

**Pros:**
- ✅ Very easy deployment
- ✅ Free tiers available
- ✅ Automatic deployments
- ✅ Global CDN

**Cons:**
- ❌ Limited customization
- ❌ Database hosting separate
- ❌ Potential vendor lock-in

## **🔧 Quick Deployment to EC2 (Recommended)**

### **Step 1: Build Your Application**
```bash
# Build the client
cd client
npm run build
cd ..

# Test locally first
npm start
```

### **Step 2: Deploy to EC2**
```bash
# Use the deployment script
./deploy-to-ec2.sh
```

### **Step 3: Access Your App**
After deployment, your app will be accessible at:
- **Main App**: http://3.249.94.227
- **API**: http://3.249.94.227/api
- **Health Check**: http://3.249.94.227/health

## **📋 Manual Deployment Steps**

If you prefer to deploy manually:

### **1. SSH into EC2 Instance**
```bash
ssh -i ~/.ssh/coolanu-postgres ubuntu@3.249.94.227
```

### **2. Create Application Directory**
```bash
sudo mkdir -p /opt/tabsur
sudo chown ubuntu:ubuntu /opt/tabsur
cd /opt/tabsur
```

### **3. Copy Application Files**
From your local machine:
```bash
scp -i ~/.ssh/coolanu-postgres -r . ubuntu@3.249.94.227:/opt/tabsur/
```

### **4. Install Dependencies**
```bash
cd /opt/tabsur
npm ci
cd client && npm ci && npm run build && cd ..
```

### **5. Create Production Environment**
```bash
# Create production .env
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=coolanu
PG_USER=coolanu_user
PG_PASSWORD=coolanu123
JWT_SECRET=your-production-jwt-secret
EOF
```

### **6. Start the Application**
```bash
# Install PM2 for process management
npm install -g pm2

# Start the application
pm2 start server.js --name "tabsur-app"

# Save PM2 configuration
pm2 save
pm2 startup
```

### **7. Configure Nginx (Optional)**
```bash
# Install nginx
sudo apt update
sudo apt install nginx

# Create nginx configuration
sudo tee /etc/nginx/sites-available/tabsur << 'EOF'
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/tabsur /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

## **🌍 Domain & SSL Setup**

### **1. Get a Domain Name**
- Purchase from Namecheap, GoDaddy, or AWS Route 53
- Point it to your EC2 instance IP: `3.249.94.227`

### **2. Configure DNS**
```
Type: A
Name: @
Value: 3.249.94.227
TTL: 300
```

### **3. Install SSL Certificate**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## **📊 Monitoring & Maintenance**

### **1. Application Monitoring**
```bash
# Check application status
pm2 status
pm2 logs tabsur-app

# Monitor system resources
htop
df -h
```

### **2. Database Monitoring**
```bash
# Check PostgreSQL status
sudo docker ps | grep postgres
sudo docker logs coolanu-postgres

# Monitor database performance
./scripts/monitor-postgres.sh
```

### **3. Backup Verification**
```bash
# Check backup status
./scripts/backup-postgres.sh
ls -la backups/
```

## **🚨 Troubleshooting**

### **Common Issues**

#### **1. Port Already in Use**
```bash
# Check what's using port 3000
sudo netstat -tlnp | grep :3000

# Kill the process
sudo kill -9 <PID>
```

#### **2. Database Connection Issues**
```bash
# Check PostgreSQL status
sudo docker ps | grep postgres

# Test connection
PGPASSWORD=coolanu123 psql -h localhost -U coolanu_user -d coolanu
```

#### **3. Nginx Configuration Errors**
```bash
# Test nginx config
sudo nginx -t

# Check nginx status
sudo systemctl status nginx
sudo journalctl -u nginx
```

## **🔒 Security Considerations**

### **1. Firewall Configuration**
```bash
# Allow only necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### **2. Environment Variables**
- ✅ Never commit `.env` files to git
- ✅ Use strong passwords and secrets
- ✅ Rotate JWT secrets regularly
- ✅ Limit database access to application only

### **3. Regular Updates**
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js dependencies
npm audit fix
npm update
```

## **📈 Scaling Considerations**

### **1. Load Balancing**
- Use AWS Application Load Balancer
- Deploy multiple EC2 instances
- Use auto-scaling groups

### **2. Database Scaling**
- Consider RDS read replicas
- Implement connection pooling
- Monitor query performance

### **3. Caching**
- No caching layer (sessions handled by JWT)
- CDN for static assets
- Application-level caching

## **🎯 Next Steps**

1. **Choose deployment option** (EC2 recommended for now)
2. **Deploy using the script**: `./deploy-to-ec2.sh`
3. **Test the deployment** at http://3.249.94.227
4. **Set up domain and SSL** for production use
5. **Configure monitoring and alerts**
6. **Set up CI/CD for automatic deployments**

---

**🚀 Your app will be accessible from anywhere in the world once deployed!**
