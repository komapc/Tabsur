# 🚀 Tabsur Quick Start Guide

Get Tabsur running locally in 10 minutes!

## ⚡ Quick Setup

### 1. Prerequisites Check
```bash
# Check if you have the required tools
docker --version
docker-compose --version
node --version  # Should be 24.4+
git --version
```

### 2. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd Tabsur

# Copy environment template
cp .env.example .env

# Edit .env with your configuration (optional for local dev)
# nano .env
```

### 3. Start Local Environment
```bash
# Start all services with Docker Compose
docker-compose -f docker-compose.debug.yml up -d

# Or use the deployment script
./deploy.sh debug
```

### 4. Access Your Application
```bash
# Frontend (React dev server)
http://localhost:3000

# Backend API
http://localhost:5000

# Database (if needed)
localhost:5432

# PgAdmin (database management)
http://localhost:5050
```

## 🎯 What You Get

- ✅ **Full Stack App**: React frontend + Node.js backend
- ✅ **Database**: PostgreSQL with sample data
- ✅ **Hot Reload**: Development server with auto-refresh
- ✅ **Testing**: Fast test suite (4-6x faster execution)
- ✅ **Docker**: Containerized development environment
- ✅ **Admin Panel**: User and meal management dashboard

## 🧪 Testing

```bash
# Run fast test suite
npm run test:fast

# Run specific tests
npm run test:unit

# Run E2E tests with Playwright
npm run test:playwright

# Run all tests with coverage
npm run test:coverage
```

## 🚀 Production Deployment

### Quick Deploy to AWS
```bash
# Deploy everything to AWS
./fast-ecr-deploy.sh

# Or use the full deployment script
./scripts/deploy-everything.sh
```

### Manual Deployment
```bash
# Build and deploy
./build.sh production

# Start production services
docker-compose -f docker-compose.yml up -d
```

## 🔧 Development Commands

```bash
# View logs
./deploy.sh logs

# Stop services
./deploy.sh stop

# Restart services
./deploy.sh restart

# Health check
curl http://localhost:5000/api/system/health
```

## 🆘 Need Help?

- 📖 Full documentation: [README.md](README.md)
- 🚀 Deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- 🧪 Testing guide: [TEST_PERFORMANCE_GUIDE.md](TEST_PERFORMANCE_GUIDE.md)
- 🐛 Troubleshooting: Check the troubleshooting section in DEPLOYMENT.md
- 💬 Issues: Create an issue on GitHub

## 🔄 Current Status

- **Version**: 2.0.0
- **Status**: 🟢 Production deployed and running
- **Production URL**: https://bemyguest.dedyn.io
- **Last Updated**: August 2025
- **Recent Improvements**: Performance optimization, security enhancements, Material-UI v7 upgrade

---

**🎉 That's it!** Tabsur is now running locally and ready for development.




