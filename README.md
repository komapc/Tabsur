# Tabsur - Social Meal Planning App

## 🎯 Project Overview

Tabsur is a social meal planning application that connects people through shared dining experiences. Users can create meals, invite guests, and discover dining opportunities in their area.

## 🚀 Tech Stack

### Frontend
- **React 18.3.1** - Modern UI framework with Material-UI v7 components
- **Redux 4.0.1** - State management with Redux Thunk
- **Material-UI v7.2.0** - Latest Material Design components
- **Google Maps API** - Location services and geolocation
- **Firebase 12.0.0** - Push notifications and cloud services

### Backend
- **Node.js 24.4+** - Latest LTS version
- **Express 4.17.1** - RESTful API server
- **PostgreSQL** - Primary database with connection pooling
- **JWT** - Authentication and session management
- **Nginx** - Load balancer and reverse proxy

### Infrastructure
- **Docker** - Containerization with multi-stage builds
- **AWS EC2** - Production hosting
- **AWS ECR** - Container registry
- **Docker Compose** - Local development environment
- **Terraform** - Infrastructure as Code

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx (LB)   │───▶│  React Client   │    │  PostgreSQL    │
│   Port 8080    │    │   Port 80       │    │   Port 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┼───▶ Express API Server
                                 │      Port 5000
                                 └───▶ Authentication (JWT)
```

## 🔧 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 24.4+ (for local development)
- PostgreSQL client tools

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd Tabsur

# Start local environment
docker-compose -f docker-compose.debug.yml up -d

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Database: localhost:5432
# PgAdmin: http://localhost:5050
```

### Production Deployment
```bash
# Deploy to AWS EC2
./fast-ecr-deploy.sh

# Or build locally and deploy
./build.sh production
```

## 📁 Project Structure

```
Tabsur/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── actions/       # Redux actions
│   │   ├── reducers/      # Redux reducers
│   │   └── config.js      # Frontend configuration
├── routes/                 # Express API routes
├── config/                 # Server configuration
├── validation/             # Input validation
├── db/                     # Database migrations
├── docker/                 # Docker configurations
├── terraform/              # Infrastructure as Code
└── docs/                   # Documentation
```

## 🚀 Key Features

- **User Authentication** - JWT-based login/registration with Google OAuth support
- **Meal Creation** - Multi-step wizard for creating meals
- **Location Services** - Google Maps integration for meal locations
- **Social Features** - Follow users, attend meals, chat
- **Real-time Updates** - Push notifications via Firebase
- **Responsive Design** - Mobile-first UI with Material-UI v7
- **Admin Panel** - User and meal management dashboard
- **Advanced Testing** - Jest + Playwright with optimized configurations

## 🚀 Deployment Status

### ✅ Production Environment
- **Status**: 🟢 **LIVE & RUNNING**
- **URL**: https://bemyguest.dedyn.io
- **API**: https://api.bemyguest.dedyn.io
- **Direct IP**: http://3.72.76.56:80
- **Last Deployed**: August 17, 2025
- **Version**: 2.0.0

### 🔧 Recent Critical Fixes Deployed
- ✅ **Redux Runtime Errors** - Fixed undefined state returns in errorReducer
- ✅ **Authentication Issues** - Resolved user ID undefined errors across components
- ✅ **MUI Grid Warnings** - Updated all Grid components to v7 syntax
- ✅ **React Lifecycle Warnings** - Replaced deprecated methods with modern alternatives
- ✅ **Google OAuth Provider** - Fixed provider wrapper implementation
- ✅ **Error Handling** - Comprehensive error payload validation in all actions
- ✅ **Performance Optimization** - 4-6x faster test execution with optimized configurations

### 🧪 Testing Infrastructure
- **Fast Test Suite**: 4-6x faster execution with `jest.config.fast.js`
- **E2E Tests**: Optimized Playwright configuration with `playwright.config.fast.js`
- **Coverage**: Full test coverage available with `npm run test:coverage`
- **Performance Testing**: Comprehensive performance monitoring and optimization

## 🔒 Security

- JWT authentication with secure tokens
- Input validation and sanitization using Joi
- CORS protection via Nginx
- Environment-based configuration
- No hardcoded secrets
- Security headers via Helmet
- Rate limiting and request sanitization

## 📊 Performance

- Multi-stage Docker builds for optimized images
- Nginx load balancing and caching
- Database connection pooling
- Optimized React bundle with code splitting
- Performance monitoring and optimization tools
- Fast test execution for development efficiency

## 🧪 Testing

```bash
# Run all tests
npm test

# Run fast test suite (4-6x faster)
npm run test:fast

# Run specific test suites
npm run test:unit
npm run test:server
npm run test:client

# E2E testing with Playwright
npm run test:playwright

# Test setup and cleanup
./test-mode.sh
./stop-test-mode.sh
```

## 📚 Documentation

- [Development Guide](DEVELOPMENT_GUIDE.md) - Local development setup
- [Deployment Guide](DEPLOYMENT.md) - Production deployment
- [Database Schema](DATABASE_SCHEMA.md) - Database structure
- [CI/CD Setup](CI_CD_SETUP.md) - GitHub Actions workflow
- [Performance Guide](TEST_PERFORMANCE_GUIDE.md) - Testing optimization
- [Security Guide](SECURITY_VULNERABILITIES.md) - Security best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is part of the Tabsur application infrastructure.

## 🆘 Support

For issues or questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

## 🔄 Recent Updates

- **August 2025**: Major performance improvements and testing optimization
- **August 2025**: Security enhancements and vulnerability fixes
- **August 2025**: Material-UI v7 upgrade and React 18 compatibility
- **August 2025**: Comprehensive error handling and validation improvements