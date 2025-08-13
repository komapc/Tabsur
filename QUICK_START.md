# 🚀 Tabsur CI/CD Quick Start Guide

Get your CI/CD pipeline running in 10 minutes!

## ⚡ Quick Setup

### 1. Prerequisites Check
```bash
# Check if you have the required tools
terraform --version
aws --version
docker --version
node --version
```

### 2. AWS Setup
```bash
# Configure AWS credentials
aws configure

# Enter your AWS credentials when prompted
```

### 3. Deploy Everything
```bash
# Make the deployment script executable
chmod +x deploy-aws.sh

# Run the deployment
./deploy-aws.sh
```

### 4. Configure GitHub
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these secrets:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

### 5. Test the Pipeline
```bash
# Create a test branch
git checkout -b feature/test
echo "# Test" >> README.md
git add .
git commit -m "Test CI/CD"
git push origin feature/test

# Create PR on GitHub and merge to main
# Watch the automatic deployment!
```

## 🎯 What You Get

- ✅ **Automated Testing**: Every PR runs tests
- ✅ **Docker Builds**: Automatic image creation
- ✅ **AWS Deployment**: Zero-downtime deployments
- ✅ **Auto-scaling**: Handles traffic spikes
- ✅ **Monitoring**: Full observability
- ✅ **Security**: Production-grade security

## 🔗 Access Your App

After deployment, get your app URL:
```bash
cd terraform/environments/dev
terraform output alb_dns_name
```

Visit: `http://<alb-dns-name>`

## 🆘 Need Help?

- 📖 Full documentation: [CI_CD_SETUP.md](CI_CD_SETUP.md)
- 🐛 Troubleshooting: Check the troubleshooting section
- 💬 Issues: Create an issue on GitHub

---

**🎉 That's it!** Your CI/CD pipeline is now running automatically.


