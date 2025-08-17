#!/bin/bash

# Setup SSL for Development Environment
# This script generates self-signed SSL certificates for local development

set -e

echo "🔐 Setting up SSL certificates for development..."

# Create SSL directory
mkdir -p ssl

# Check if certificates already exist
if [ -f "ssl/cert.pem" ] && [ -f "ssl/key.pem" ]; then
    echo "✅ SSL certificates already exist"
    echo "📅 Certificate expires: $(openssl x509 -in ssl/cert.pem -noout -enddate)"
    
    # Check if certificate is expired
    if openssl x509 -checkend 86400 -noout -in ssl/cert.pem; then
        echo "✅ Certificate is still valid"
        exit 0
    else
        echo "⚠️  Certificate is expired or will expire soon, regenerating..."
    fi
fi

# Generate private key
echo "🔑 Generating private key..."
openssl genrsa -out ssl/key.pem 2048

# Generate certificate signing request
echo "📝 Generating certificate signing request..."
openssl req -new -key ssl/key.pem -out ssl/cert.csr -subj "/C=US/ST=Development/L=Local/O=Tabsur/OU=Dev/CN=localhost"

# Generate self-signed certificate
echo "🎫 Generating self-signed certificate..."
openssl x509 -req -in ssl/cert.csr -signkey ssl/key.pem -out ssl/cert.pem -days 365

# Set proper permissions
chmod 600 ssl/key.pem
chmod 644 ssl/cert.pem

# Clean up CSR
rm ssl/cert.csr

echo "✅ SSL certificates generated successfully!"
echo "📁 Certificates saved in: ssl/"
echo "🔑 Private key: ssl/key.pem"
echo "🎫 Certificate: ssl/cert.pem"
echo "📅 Valid until: $(openssl x509 -in ssl/cert.pem -noout -enddate)"
echo ""
echo "⚠️  IMPORTANT: These are self-signed certificates for development only!"
echo "   Your browser will show a security warning - this is normal for dev."
echo "   Click 'Advanced' -> 'Proceed to localhost (unsafe)' to continue."
echo ""
echo "🚀 You can now start the admin panel with:"
echo "   docker-compose -f docker-compose-admin.yml up -d"
echo ""
echo "🌐 Access your admin panel at:"
echo "   https://localhost/admin"
echo "   https://localhost:3000 (direct client)"
echo "   https://localhost:5000 (direct server)"
echo "   http://localhost:5050 (PgAdmin - admin@tabsur.com / admin123)"
