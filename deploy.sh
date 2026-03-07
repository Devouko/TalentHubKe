#!/bin/bash

# Production Deployment Script for Talent Marketplace

set -e

echo "🚀 Starting production deployment..."

# Check if required environment variables are set
if [ ! -f .env.production ]; then
    echo "❌ .env.production file not found!"
    echo "Please create .env.production with all required variables"
    exit 1
fi

# Load production environment
export $(cat .env.production | xargs)

# Validate required environment variables
required_vars=(
    "DATABASE_URL"
    "NEXTAUTH_URL" 
    "NEXTAUTH_SECRET"
    "MPESA_CONSUMER_KEY"
    "MPESA_CONSUMER_SECRET"
    "MPESA_SHORTCODE"
    "MPESA_PASSKEY"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Required environment variable $var is not set"
        exit 1
    fi
done

echo "✅ Environment variables validated"

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build --no-cache

echo "🗄️ Running database migrations..."
docker-compose run --rm app npx prisma migrate deploy

echo "🌱 Seeding database..."
docker-compose run --rm app npm run db:seed

echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be healthy..."
sleep 30

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:3000/api/health; then
    echo "✅ Application is healthy and running!"
    echo "🌐 Access your application at: $NEXTAUTH_URL"
else
    echo "❌ Health check failed!"
    docker-compose logs app
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "📝 Next Steps:"
echo "1. Configure your domain DNS to point to this server"
echo "2. Set up SSL certificates in ./ssl/ directory"
echo "3. Configure monitoring and alerting"
echo "4. Set up automated backups"