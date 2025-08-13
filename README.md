# 🍽️ BeMyGuest - Food Sharing Social Dining App

[![CI/CD](https://github.com/yourusername/Tabsur/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/Tabsur/actions/workflows/ci.yml)
[![Security Scan](https://github.com/yourusername/Tabsur/actions/workflows/crunch42-analysis.yml/badge.svg)](https://github.com/yourusername/Tabsur/actions/workflows/crunch42-analysis.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

BeMyGuest is a full-stack social dining application that connects people through shared meals. Users can host dinner events, join others' meals, and build a community around food sharing.

## 🌟 Features

- **🏠 Host Meals**: Create and manage dinner events at your location
- **🔍 Discover Events**: Find nearby meals using interactive maps
- **👥 Social Networking**: Connect with fellow food enthusiasts
- **💬 Real-time Chat**: Message other users and coordinate meetups
- **📱 Mobile-First Design**: Responsive design for all devices
- **🗺️ Location Services**: Google Maps integration for meal discovery
- **🔔 Push Notifications**: Real-time updates via Firebase Cloud Messaging
- **📸 Photo Sharing**: Upload and share meal photos

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, Material-UI v7, Redux, React Router
- **Backend**: Node.js, Express.js, PostgreSQL
- **Authentication**: JWT with Google OAuth
- **Real-time**: Firebase Cloud Messaging
- **Maps**: Google Maps API
- **Storage**: AWS S3
- **Cache**: Redis
- **Deployment**: Docker, Docker Compose

### Project Structure
```
Tabsur/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── actions/        # Redux actions
│   │   ├── reducers/       # Redux reducers
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── routes/                 # Express API routes
│   └── api/                # API endpoints
├── db/                     # Database migrations
├── tests/                  # Test suites
├── docker/                 # Docker configurations
├── docs/                   # API documentation
└── .github/                # GitHub Actions workflows
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 24.4+ (for local development)
- PostgreSQL (if running without Docker)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/Tabsur.git
cd Tabsur
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit with your configuration
nano .env
```

### 3. Deploy with Docker
```bash
# Development environment
./deploy.sh debug

# Production environment  
./deploy.sh release
```

### 4. Access Application
- **Client**: http://localhost:3000
- **API**: http://localhost:5000
- **Database**: localhost:5432 (debug mode)

## 🔧 Development

### Local Development Setup
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client && npm install

# Start development servers
npm run debug
```

### Available Scripts
```bash
# Development
npm run debug          # Start both client and server in debug mode
npm run server-debug   # Start server in debug mode
npm run client         # Start client only

# Testing
npm test              # Run server tests
npm run test:full     # Run full test suite
./deploy.sh test      # Run all tests

# Database
npm run start-db      # Start PostgreSQL with Docker
npm run migrate-local-db  # Run database migrations

# Production
npm run build         # Build production bundle
npm start             # Start production server
```

### Testing
```bash
# Run unit tests
npm test

# Run client tests with coverage
cd client && npm test -- --coverage

# Run integration tests
npm run test:full

# Run all tests via deployment script
./deploy.sh test
```

## 📊 API Documentation

### OpenAPI Specification
API documentation is available in OpenAPI 3.0 format:
- **File**: `docs/openapi.yml`
- **Interactive Docs**: http://localhost:5000/api-docs (when server is running)

### Key Endpoints
```bash
# Authentication
POST /api/users/register    # Register new user
POST /api/users/login       # Login user

# Meals
GET  /api/meals            # List meals
POST /api/meals            # Create meal
GET  /api/meals/:id        # Get meal details
PUT  /api/meals/:id        # Update meal
DELETE /api/meals/:id      # Delete meal

# System
GET /api/system/health     # Health check
```

## 🐳 Docker Deployment

### Environment Configurations

#### Debug (Development)
- Local database and Redis
- Development optimizations
- Debug logging enabled
- Source code mounting

```bash
./deploy.sh debug
```

#### Release (Production)
- External database (AWS RDS)
- Production optimizations
- Security hardening
- Resource limits

```bash
./deploy.sh release
```

### Docker Commands
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

## 🔒 Security

### Authentication & Authorization
- JWT-based authentication
- Google OAuth integration
- Route-level authorization
- Token expiration handling

### Security Features
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting
- Secure headers
- Environment variable protection

### Security Scanning
- Automated vulnerability scanning via Trivy
- 42Crunch API security audit
- npm audit for dependencies
- Docker image scanning

## 🚀 Deployment & CI/CD

### GitHub Actions Workflows
- **CI/CD Pipeline**: Automated testing, building, and deployment
- **Security Scanning**: Vulnerability and API security audits
- **Manual Deployment**: Controlled staging and production deployments

### Deployment Environments
- **Staging**: Automatic deployment from `develop` branch
- **Production**: Automatic deployment from `main` branch
- **Manual**: On-demand deployment with version control

### Monitoring & Health Checks
- Application health endpoints
- Database connectivity checks
- Service availability monitoring
- Automated rollback on failures

## 🧪 Testing Strategy

### Test Coverage
- **Unit Tests**: Component and function testing
- **Integration Tests**: API endpoint testing
- **End-to-End Tests**: User workflow testing
- **Security Tests**: Vulnerability scanning

### Test Execution
```bash
# All tests
./deploy.sh test

# Server tests only
npm test

# Client tests only
cd client && npm test

# Coverage report
cd client && npm test -- --coverage
```

## 📱 Mobile Support

### Progressive Web App (PWA)
- Mobile-responsive design
- Offline capability (planned)
- Push notifications
- App-like experience

### Mobile Features
- Touch-friendly interface
- Swipeable tabs
- Location services
- Camera integration for photos

## 🤝 Contributing

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- ESLint for JavaScript linting
- Prettier for code formatting
- Jest for testing
- Conventional commits

### Pull Request Checklist
- [ ] Tests pass locally and in CI
- [ ] Code follows style guidelines
- [ ] Documentation updated if needed
- [ ] Security considerations addressed
- [ ] Performance impact assessed

## 📞 Support & Documentation

### Getting Help
1. **Documentation**: Check this README and `/docs` directory
2. **Issues**: Search existing [GitHub issues](https://github.com/yourusername/Tabsur/issues)
3. **Discussions**: Join [GitHub Discussions](https://github.com/yourusername/Tabsur/discussions)
4. **Wiki**: Additional documentation in the [project wiki](https://github.com/yourusername/Tabsur/wiki)

### Useful Links
- [Deployment Guide](DEPLOYMENT.md) - Detailed deployment instructions
- [API Documentation](docs/openapi.yml) - OpenAPI specification
- [GitHub Actions Guide](.github/README.md) - CI/CD documentation
- [Development Guide](DEVELOPMENT_GUIDE.md) - Local development setup

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React community for excellent documentation
- Material-UI team for beautiful components
- Google Maps team for location services
- Firebase team for real-time messaging
- 42Crunch for API security analysis
- Contributors and beta testers

---

**Made with ❤️ by the BeMyGuest Team**

*Bringing people together through shared meals* 🍽️