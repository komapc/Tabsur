#!/bin/bash

echo "🐘 Setting up local PostgreSQL database for Tabsur..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "📦 Installing PostgreSQL..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
fi

# Start PostgreSQL service
echo "🚀 Starting PostgreSQL service..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
echo "🗄️ Creating database and user..."
sudo -u postgres psql -c "CREATE DATABASE tabsur;" 2>/dev/null || echo "Database already exists"
sudo -u postgres psql -c "CREATE USER tabsur_user WITH PASSWORD 'tabsur_password';" 2>/dev/null || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE tabsur TO tabsur_user;" 2>/dev/null || echo "Privileges already granted"

# Create basic tables for testing
echo "📋 Creating basic tables..."
sudo -u postgres psql -d tabsur -c "
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS meals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    host_id INTEGER REFERENCES users(id),
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attends (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    meal_id INTEGER REFERENCES meals(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
" 2>/dev/null || echo "Tables already exist"

# Insert test data
echo "📝 Inserting test data..."
sudo -u postgres psql -d tabsur -c "
INSERT INTO users (name, email) VALUES 
('Admin User', 'admin@tabsur.com'),
('Test User', 'test@tabsur.com')
ON CONFLICT DO NOTHING;

INSERT INTO meals (name, description, host_id, date) VALUES 
('Test Meal 1', 'A delicious test meal', 1, CURRENT_DATE),
('Test Meal 2', 'Another test meal', 2, CURRENT_DATE + INTERVAL '1 day')
ON CONFLICT DO NOTHING;
" 2>/dev/null || echo "Test data already exists"

echo "✅ Local database setup complete!"
echo "📊 Database: tabsur"
echo "👤 User: tabsur_user"
echo "🔑 Password: tabsur_password"
echo "🌐 Host: localhost"
echo "🔌 Port: 5432"
