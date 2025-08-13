# BeMyGuest - Meal Sharing Platform

BeMyGuest is a meal-sharing platform built with the MERN stack that allows users to create meal events, attend others' meals, chat, and share photos. Think of it as "table surfing" or "dinner sharing" - connecting people through food.

## 🏗️ Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: React 18.3.1 with Material-UI v7
- **Database**: PostgreSQL with Flyway-style migrations
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Storage**: AWS S3 integration
- **Real-time Features**: WebSocket support for chat and notifications
- **Maps**: Google Maps API integration
- **Social Login**: Google OAuth integration

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v24.4.x (specified in package.json)
- **Docker & Docker Compose**: For running PostgreSQL
- **PostgreSQL Client Tools**: For running migrations (psql)

### 1. Environment Setup

```bash
# Clone and navigate to project
cd /path/to/BeMyGuest

# Copy environment templates
cp .env.example .env
cp client/.env.example client/.env

# Edit .env files with your actual API keys and configurations
nano .env
nano client/.env
```

### 2. Database Setup

```bash
# Start PostgreSQL database
npm run start-db

# Run database migrations
npm run migrate-local-db
```

### 3. Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
npm run client-install
```

## 🎯 Running the Application

### Development Mode (Debug)

```bash
# Run both server and client in debug mode
npm run debug

# Or run separately:
npm run server-debug  # Server on http://localhost:5000
npm run client        # Client on http://localhost:3000
```

### Production Mode

```bash
# Build and start in production
npm run build
npm start
```

### Environment Modes

- **Debug Mode** (`NODE_ENV=debug`): Uses local database, detailed logging
- **Production Mode** (`NODE_ENV=production`): Uses environment variables for DB config
- **Test Mode** (`NODE_ENV=test`): Uses separate test database on port 5433

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode  
npm run test:watch

# Full test cycle (setup + test + cleanup)
npm run test:full
```

### Test Environment

```bash
# Setup test environment manually
npm run test-setup

# Run server in test mode
npm run test-server

# Run client in test mode  
npm run test-client

# Run both in test mode
npm run test-dev

# Cleanup test environment
npm run test-cleanup
```

### Test Coverage

Our test suite includes:
- ✅ User registration with validation
- ✅ User login with JWT token generation
- ✅ Email and password validation
- ✅ Duplicate email handling
- ✅ Wrong password rejection
- ✅ Integration tests with real database

## 🗄️ Database Management

### Available Scripts

```bash
# Start/stop main database
npm run start-db
npm run stop-db

# Run migrations
npm run migrate-local-db

# Test database operations
./test-mode.sh          # Setup test environment
./stop-test-mode.sh     # Cleanup test environment
```

### Database Configuration

The application uses different database configurations based on `NODE_ENV`:

- **Debug**: `localhost:5432/coolanu` 
- **Test**: `localhost:5433/coolanu_test`
- **Production**: Uses environment variables

## 🔧 Configuration Files

### Server Environment (`.env`)
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coolanu
DB_USER=coolanu
DB_PASSWORD=coolanu

# JWT Configuration
SECRET_OR_KEY=your_jwt_secret_change_in_production

# API Keys
GOOGLE_API_KEY=your_google_api_key
FACEBOOK_APP_ID=your_facebook_app_id

# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET=your_s3_bucket_name

# Server Configuration  
NODE_ENV=development
PORT=5000
```

### Client Environment (`client/.env`)
```bash
# Google API Key for client-side usage
REACT_APP_GOOGLE_API_KEY=your_google_api_key

# Development server host
REACT_APP_SERVER_HOST_DEV=http://localhost:5000
```

## 📱 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/loginFB` - Facebook login

### Meals
- `GET /api/meals/:userId` - Get meals for user
- `POST /api/meals` - Create new meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal

### Social Features
- `POST /api/follow` - Follow/unfollow users
- `GET /api/chat/:userId` - Get chat messages
- `POST /api/chat` - Send message
- `GET /api/notifications/:userId` - Get notifications

### Images
- `POST /api/images/upload` - Upload image to S3
- `GET /api/images/:imageId` - Get image
- `GET /api/images/gallery/:userId` - User gallery

## 🔐 Security Features

✅ **Implemented Security Measures:**
- Environment variables for all API keys and secrets
- JWT token authentication
- Bcrypt password hashing with salt
- SQL injection protection with parameterized queries
- CORS enabled for cross-origin requests
- Input validation on all user inputs
- AWS S3 integration for secure file storage

⚠️ **Security Notes:**
- Change default JWT secret in production
- Use HTTPS in production
- Regularly update dependencies
- Review AWS S3 bucket permissions
- Monitor for security vulnerabilities

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill processes on port 3000/5000
pkill -f "react-scripts\|nodemon"
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

**Database Connection Issues:**
```bash
# Check if database is running
docker ps | grep coolanu

# Restart database
npm run stop-db && npm run start-db

# Check database logs
docker logs coolanu-db_coolanu-db_1
```

**Migration Errors:**
```bash
# Run migrations with password
cd db && PGPASSWORD=coolanu bash ./migrate.sh
```

**Environment Variables Not Loading:**
- Ensure `.env` files exist and are not in `.gitignore`
- Restart server after changing environment variables
- Check for syntax errors in `.env` files

## 📊 Monitoring & Logging

### Server Logs
- Registration attempts and results
- Login attempts and JWT generation
- Database query logs
- Error handling and stack traces

### Client Logs  
- Authentication state changes
- API request/response logging
- Error boundary catches
- User interaction events

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**
   - Set all production API keys
   - Use strong JWT secret
   - Configure production database
   
2. **Database**
   - Run all migrations
   - Set up database backups
   - Configure connection pooling
   
3. **Security**
   - Enable HTTPS
   - Set up proper CORS origins
   - Review AWS S3 permissions
   - Update all dependencies

4. **Performance**
   - Build client for production
   - Enable gzip compression
   - Set up CDN for static assets
   - Monitor server performance

## 👥 Development Team

- **Authors**: Mark & Yana
- **License**: MIT
- **Repository**: https://github.com/komapc/BeMyGuest

## 📝 Recent Updates

- ✅ Fixed security vulnerabilities by moving API keys to environment variables
- ✅ Updated AWS SDK from v2 to v3 for better performance
- ✅ Added comprehensive test suite with integration tests
- ✅ Improved error handling in authentication flows
- ✅ Created test environment with separate database
- ✅ Fixed React 18 compatibility issues
- ✅ Added proper environment configuration management
