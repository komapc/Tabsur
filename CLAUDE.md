# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development Setup
```bash
# Quick setup for development
npm run start-db                # Start PostgreSQL database with Docker
npm install && npm run client-install  # Install dependencies
cd db && PGPASSWORD=coolanu bash ./migrate.sh && cd ..  # Run database migrations
npm run debug                   # Start both server (5000) and client (3000)
```

### Health Checks & Verification
```bash
# Check all services (server, client, database)
npm run health

# Test individual components
curl http://localhost:5000/health   # Server health endpoint
curl http://localhost:3000          # Client accessibility
```

### Linting & Code Quality
```bash
# Server-side linting
npm run lint:server         # Check server code
npm run lint:fix:server     # Fix server linting issues

# Client-side linting  
npm run lint:client         # Check client code
npm run lint:fix:client     # Fix client linting issues
```

### Testing
```bash
# Full test suite (recommended)
npm run test:full

# Step-by-step testing
./test-mode.sh        # Setup test database and environment
npm test              # Run server-side tests
cd client && npm test # Run client-side tests
./stop-test-mode.sh   # Cleanup test environment

# Single test file
npm test -- --testNamePattern="auth.test.js"
```

### Database Operations
```bash
# Database management
npm run start-db      # Start PostgreSQL (port 5432)
npm run stop-db       # Stop database
npm run migrate-local-db  # Run migrations

# Test database (port 5433)
npm run test-setup    # Setup test database
npm run test-cleanup  # Cleanup test database
```

## Architecture Overview

### Tech Stack & Structure
- **Monorepo**: Server (Express.js/Node.js) + Client (React 18) + shared database
- **Database**: PostgreSQL with 23 Flyway-style migrations (`/db/migrations/`)
- **Authentication**: JWT with bcrypt, Google OAuth integration
- **Real-time**: Firebase Cloud Messaging for notifications
- **File Storage**: AWS S3 integration for image uploads
- **Maps**: Google Maps API for location-based meal discovery

### Key Directories
```
Tabsur/
├── server.js              # Main Express server entry point
├── routes/api/            # API endpoints (users, meals, attends, etc.)
├── validation/            # Request validation schemas
├── client/                # React frontend application
│   ├── src/components/    # React components organized by feature
│   ├── src/actions/       # Redux actions
│   ├── src/reducers/      # Redux state management
│   └── src/resources/     # Static assets (SVGs, images)
├── db/migrations/         # Sequential database schema migrations
└── tests/                 # Server-side integration tests
```

### Core Data Models
- **Users**: Authentication, profile info, location, Facebook integration
- **Meals**: Hosted events with location, date, capacity, visibility
- **Attends**: Many-to-many relationship between users and meals
- **Follow**: Social networking (followers/followees)
- **Images**: S3-backed file storage linked to meals/users
- **Chat**: Direct messaging between users
- **Notifications**: Push notifications for meal updates, follows, etc.
- **Hungry**: "Looking for meal" posts by location

### API Architecture Patterns
- **Authentication**: Routes use `authenticateJWT` middleware for protected endpoints
- **Database**: PostgreSQL pool connections with manual `.then()/.catch()/.finally()` promise chains
- **Validation**: Input validation using dedicated validation functions in `/validation/`
- **Error Handling**: Structured error responses with proper HTTP status codes
- **Location Data**: PostGIS-style coordinate storage as `(lng, lat)` strings

## Development Environment Notes

### Environment Configuration
- **Debug Mode**: `NODE_ENV=debug` enables detailed logging, uses port 5000
- **Test Mode**: `NODE_ENV=test` uses separate database on port 5433
- **Production Mode**: `NODE_ENV=production` optimized for deployment

### Client-Server Integration
- **Development**: Client dev server (3000) proxies API calls to server (5000)
- **State Management**: Redux with thunk middleware for async actions
- **UI Framework**: Material-UI v7 with custom theming and responsive design
- **Date Pickers**: Uses `@mui/x-date-pickers` with `AdapterDateFns` and `LocalizationProvider`

### Database Migration System
- **Migration Files**: Follow `V{number}__{description}.sql` pattern
- **Execution**: Migrations run sequentially and are tracked in database
- **Local Development**: Use `PGPASSWORD=coolanu bash ./migrate.sh` in `/db/` directory
- **Schema Documentation**: See `DATABASE_SCHEMA.md` for complete ER diagram

### Common Debugging
- **Port Conflicts**: Kill processes with `lsof -ti:3000 | xargs kill -9` and `lsof -ti:5000 | xargs kill -9`
- **Database Connection**: Ensure Docker container is running with `docker ps | grep coolanu`
- **Migration Errors**: Run migrations with explicit password: `cd db && PGPASSWORD=your_db_password bash ./migrate.sh`
- **Test Database**: Tests require separate database instance on port 5433

### Code Quality Standards
- **Server**: ESLint with Node.js rules, single quotes, semicolons required
- **Client**: React ESLint rules, JSX support, hooks exhaustive-deps warnings
- **Promise Chains**: Server uses manual `.then()/.catch()/.finally()` patterns (not async/await)
- **Database Queries**: Always use parameterized queries with `$1, $2, etc.` for security

## Important Implementation Details

When working with this codebase:
- **Database connections**: Always release connections in `.finally()` blocks
- **JWT Authentication**: Tokens expire after 1 year, stored as `Bearer {token}`
- **File Uploads**: Use multiparty for parsing, AWS S3 for storage
- **Location Services**: Store coordinates as PostGIS points: `(longitude, latitude)`
- **React Components**: Use class components in older parts, hooks in newer components
- **Material-UI**: Uses v7 with emotion-based theming and sx props
- **API Responses**: Consistent JSON responses with proper HTTP status codes
- **Testing**: Integration tests focus on API endpoints, client tests use React Testing Library

The application is a fully functional social dining platform where users can host meals, join others' events, and connect through food sharing.