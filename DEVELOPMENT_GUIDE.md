# Tabsur Development Guide

## 🚀 Quick Setup for Development

### 1. Initial Setup
```bash
# Start database
npm run start-db

# Install dependencies  
npm install
npm run client-install

# Run migrations
cd db && PGPASSWORD=coolanu bash ./migrate.sh && cd ..
```

### 2. Environment Configuration
```bash
# Copy environment templates
cp .env.example .env
cp client/.env.example client/.env

# Edit with your API keys (optional for basic development)
nano .env
```

### 3. Start Development Mode
```bash
# Start both server and client
npm run debug

# Server runs on http://localhost:5000
# Client runs on http://localhost:3000
```

## 🧪 Testing

### Run Integration Tests
```bash
# Full test cycle (recommended)
npm run test:full

# Or step by step:
./test-mode.sh        # Setup test environment
npm test              # Run tests  
./stop-test-mode.sh   # Cleanup
```

### Manual API Testing
```bash
# Test user registration
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123", 
    "password2": "password123",
    "location": "40.7128,-74.0060",
    "address": "123 Test Street"
  }'

# Test user login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## 🔧 Common Development Tasks

### Database Management
```bash
# Reset database
npm run stop-db
npm run start-db
cd db && PGPASSWORD=coolanu bash ./migrate.sh && cd ..

# Check database status
docker ps | grep coolanu
```

### Debugging Issues
```bash
# Check server logs (when running npm run debug)
# Logs appear in terminal

# Check database connections
docker logs coolanu-db_coolanu-db_1

# Kill stuck processes
pkill -f "react-scripts\|nodemon"
```

### Environment Switching
```bash
# Debug mode (detailed logging)
NODE_ENV=debug npm run server-debug

# Production mode
NODE_ENV=production npm run server

# Test mode
NODE_ENV=test npm run test-server
```

## 📊 Current Status

### ✅ Working Features
- User registration with validation
- User login with JWT tokens
- Database connectivity (PostgreSQL)
- Environment configuration
- Comprehensive test suite
- Security improvements (environment variables)
- AWS S3 integration ready
- Google Maps API ready

### ⚠️ Known Issues Fixed
- ✅ Fixed hardcoded API keys security vulnerability  
- ✅ Fixed AWS SDK v2 deprecation warnings
- ✅ Fixed React 18 compatibility issues
- ✅ Fixed error handling in authentication
- ✅ Fixed database configuration for different environments
- ✅ Fixed migration conflicts in chat system

### 🔄 Architecture Notes
- **Frontend**: React 18.3.1 with Material-UI v7
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with 23 migrations applied
- **Authentication**: JWT with bcrypt password hashing
- **File Storage**: AWS S3 integration (configured)
- **Testing**: Jest with Supertest for API testing

### 🗄️ Database Schema
See `DATABASE_SCHEMA.md` for complete schema documentation including:
- 11+ core tables (users, meals, attends, notifications, chat, etc.)
- Proper foreign key relationships  
- Spatial data support for location features
- Migration history and versioning

## 🐛 Troubleshooting

### "Connection Refused" Error
- Ensure database is running: `docker ps | grep coolanu`
- Ensure server is running: `npm run server-debug`
- Check port availability: `lsof -i :5000`

### "Port Already in Use" Error  
```bash
# Kill processes on common ports
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
pkill -f "react-scripts\|nodemon"
```

### Migration Errors
```bash
# Run migrations with explicit password
cd db && PGPASSWORD=coolanu bash ./migrate.sh
```

### Environment Variables Not Loading
- Restart server after changing `.env` files
- Ensure `.env` files are in correct locations
- Check file syntax (no quotes needed for values)

## 📝 Next Steps for Production

1. **Security**:
   - Replace all placeholder API keys with real ones
   - Use strong JWT secret
   - Set up HTTPS
   - Review AWS S3 permissions

2. **Performance**:
   - Add database indexes for production queries
   - Set up connection pooling
   - Enable gzip compression
   - Use CDN for static assets

3. **Monitoring**:
   - Set up error tracking
   - Add performance monitoring  
   - Configure logging aggregation
   - Set up database backups

4. **Testing**:
   - Expand test coverage
   - Add end-to-end tests
   - Set up CI/CD pipeline
   - Load testing for scalability

The application is now fully functional for development with proper security practices, comprehensive testing, and clean architecture! 🎉