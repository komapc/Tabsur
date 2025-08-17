# Tabsur - Social Meal Planning App

## 🎯 Project Overview

Tabsur is a social meal planning application that connects people through shared dining experiences. Users can create meals, invite guests, and discover dining opportunities in their area.

## 🚀 Tech Stack

### Frontend
- **React** - Modern UI framework with Material-UI components
- **Redux** - State management
- **Google Maps API** - Location services and geolocation
- **Firebase** - Push notifications (when supported)

### Backend
- **Node.js/Express** - RESTful API server
- **PostgreSQL** - Primary database
- **JWT** - Authentication and session management
- **Nginx** - Load balancer and reverse proxy

### Infrastructure
- **Docker** - Containerization with multi-stage builds
- **AWS EC2** - Production hosting
- **AWS ECR** - Container registry
- **Docker Compose** - Local development environment

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
- Node.js 18+ (for local development)
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
- **Real-time Updates** - Push notifications (when supported)
- **Responsive Design** - Mobile-first UI with Material-UI v2
- **Admin Panel** - User and meal management dashboard

## 🚀 Deployment Status

### ✅ Production Environment
- **Status**: 🟢 **LIVE & RUNNING**
- **URL**: https://bemyguest.dedyn.io
- **API**: https://api.bemyguest.dedyn.io
- **Direct IP**: http://3.72.76.56:80
- **Last Deployed**: August 17, 2025
- **Version**: 2.0.0

### 🔧 Recent Fixes Deployed
- ✅ **Redux Runtime Errors** - Fixed undefined state returns
- ✅ **Authentication Issues** - Resolved user ID undefined errors
- ✅ **MUI Grid Warnings** - Updated to v2 syntax
- ✅ **React Lifecycle Warnings** - Replaced deprecated methods
- ✅ **Google OAuth Provider** - Fixed provider wrapper issues
- ✅ **Error Handling** - Comprehensive error payload validation

### 🧪 Testing
- **Fast Test Suite**: 4-6x faster execution with `jest.config.fast.js`
- **E2E Tests**: Optimized Playwright configuration
- **Coverage**: Full test coverage available with `npm run test:coverage`

## 🔒 Security

- JWT authentication with secure tokens
- Input validation and sanitization
- CORS protection via Nginx
- Environment-based configuration
- No hardcoded secrets

## 📊 Performance

- Multi-stage Docker builds for optimized images
- Nginx load balancing and caching
- Database connection pooling
- Optimized React bundle with code splitting

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:server
npm run test:client

# Test setup and cleanup
./test-mode.sh
./stop-test-mode.sh
```

## 📚 Documentation

- [Development Guide](DEVELOPMENT_GUIDE.md) - Local development setup
- [Deployment Guide](DEPLOYMENT.md) - Production deployment
- [Database Schema](DATABASE_SCHEMA.md) - Database structure
- [CI/CD Setup](CI_CD_SETUP.md) - GitHub Actions workflow

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