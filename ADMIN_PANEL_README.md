# 🛡️ Tabsur Admin Panel

A comprehensive, secure admin panel for managing users, meals, and system operations with full HTTPS support.

## ✨ Features

### 🔐 **Security & Authentication**
- **HTTPS/TLS 1.3** encryption for all communications
- **JWT-based authentication** with secure token management
- **Rate limiting** with different limits for admin vs regular users
- **CORS protection** with strict origin policies
- **Security headers** (HSTS, CSP, XSS Protection, etc.)

### 👥 **User Management**
- **View all users** with detailed statistics
- **User profiles** including followers, following, and meal history
- **Edit user information** (name, email, location, address)
- **Delete users** with cascade cleanup of related data
- **User statistics** and activity tracking

### 🍽️ **Meal Management**
- **View all meals** with host information and attendee counts
- **Meal details** including description, date, location, and status
- **Edit meal information** (title, description, date, location, max attendees)
- **Delete meals** with proper cleanup of attendee records
- **Meal status tracking** (Past, Active, Upcoming)

### 📊 **Dashboard & Analytics**
- **Real-time statistics** (total users, meals, active sessions)
- **System monitoring** with database and server metrics
- **Performance tracking** and health monitoring
- **Database insights** with table sizes and counts

### 🗄️ **Database Management**
- **PgAdmin integration** for advanced database operations
- **Database health monitoring** with connection pooling
- **Migration support** for schema updates
- **Backup and restore** capabilities

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- OpenSSL (for SSL certificate generation)
- At least 4GB RAM available

### 1. Setup SSL Certificates
```bash
# Generate self-signed certificates for development
./scripts/setup-ssl-dev.sh
```

### 2. Start Admin Panel
```bash
# Start all services with HTTPS support
./scripts/start-admin-panel.sh
```

### 3. Access Admin Panel
- **Admin Panel**: https://localhost/admin
- **Frontend**: https://localhost:3000
- **Backend API**: https://localhost:5000
- **PgAdmin**: http://localhost:5050

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```bash
# Database Configuration
DB_NAME=tabsur
DB_USER=tabsur_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this

# CORS Configuration
CORS_ORIGIN=https://localhost:3000

# PgAdmin Configuration
PGADMIN_EMAIL=admin@tabsur.com
PGADMIN_PASSWORD=admin123

# Firebase Configuration (if using)
REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Google Maps API (if using)
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### SSL Certificates
For production, replace the self-signed certificates with proper SSL certificates:

1. **Place your certificates** in the `ssl/` directory:
   - `ssl/cert.pem` - Your SSL certificate
   - `ssl/key.pem` - Your private key

2. **Update nginx configuration** if needed in `nginx-admin-https.conf`

## 🏗️ Architecture

### Service Stack
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx (443)   │───▶│  React Client   │───▶│  Node.js API    │
│   (Load Balancer)│    │   (Port 3000)   │    │   (Port 5000)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │      Redis      │    │     PgAdmin     │
│   (Port 5432)   │    │   (Port 6379)   │    │   (Port 5050)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Security Layers
1. **Network Level**: Docker network isolation
2. **Transport Level**: HTTPS/TLS encryption
3. **Application Level**: JWT authentication, rate limiting
4. **Database Level**: Connection pooling, prepared statements

## 📱 API Endpoints

### Admin API (`/api/admin/`)

#### Dashboard
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/system` - Get system information

#### User Management
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get specific user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

#### Meal Management
- `GET /api/admin/meals` - Get all meals
- `GET /api/admin/meals/:id` - Get specific meal
- `PUT /api/admin/meals/:id` - Update meal
- `DELETE /api/admin/meals/:id` - Delete meal

## 🛠️ Development

### Local Development
```bash
# Start only specific services
docker-compose -f docker-compose-admin.yml up postgres server

# View logs
docker-compose -f docker-compose-admin.yml logs -f

# Access database
docker-compose -f docker-compose-admin.yml exec postgres psql -U tabsur_user -d tabsur

# Restart services
docker-compose -f docker-compose-admin.yml restart
```

### Adding New Admin Features
1. **Backend**: Add routes in `routes/api/admin.js`
2. **Frontend**: Add components in `client/src/components/admin/`
3. **Database**: Add migrations in `db/migrations/`
4. **Testing**: Add tests in `tests/`

## 🔍 Monitoring & Debugging

### Health Checks
- **Application**: https://localhost/health
- **Database**: Automatic health checks in Docker
- **Services**: Health check endpoints for each service

### Logs
```bash
# View all logs
docker-compose -f docker-compose-admin.yml logs -f

# View specific service logs
docker-compose -f docker-compose-admin.yml logs -f server
docker-compose -f docker-compose-admin.yml logs -f nginx
```

### Performance Monitoring
- **Backend metrics**: `/performance` endpoint
- **Database performance**: Connection pooling stats
- **Nginx metrics**: Access and error logs

## 🚨 Troubleshooting

### Common Issues

#### SSL Certificate Errors
```bash
# Regenerate certificates
./scripts/setup-ssl-dev.sh

# Check certificate validity
openssl x509 -in ssl/cert.pem -noout -text
```

#### Port Conflicts
```bash
# Check what's using the ports
sudo netstat -tulpn | grep :443
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :5000

# Stop conflicting services
sudo systemctl stop nginx  # if running system nginx
```

#### Database Connection Issues
```bash
# Check database status
docker-compose -f docker-compose-admin.yml exec postgres pg_isready

# Reset database
docker-compose -f docker-compose-admin.yml down -v
docker-compose -f docker-compose-admin.yml up -d
```

### Performance Issues
- **Increase Docker memory** allocation
- **Optimize database queries** in admin routes
- **Enable Redis caching** for frequently accessed data
- **Monitor resource usage** with `docker stats`

## 🔒 Security Best Practices

### Production Deployment
1. **Use proper SSL certificates** from a trusted CA
2. **Enable admin authentication** in admin routes
3. **Implement IP whitelisting** for admin access
4. **Regular security updates** for all containers
5. **Monitor access logs** for suspicious activity

### Access Control
- **Admin role verification** in JWT tokens
- **Session management** with Redis
- **Audit logging** for all admin actions
- **Rate limiting** to prevent abuse

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [PostgreSQL Administration](https://www.postgresql.org/docs/)
- [React Admin Components](https://mui.com/material-ui/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests** for new functionality
5. **Submit a pull request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Need help?** Check the [issues](https://github.com/komapc/tabsur/issues) or create a new one with detailed information about your problem.
