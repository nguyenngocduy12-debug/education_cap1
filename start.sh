#!/bin/bash

echo "🚀 Starting Education Online Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create .env file if not exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your AI API key"
fi

# Build and start containers
echo "🏗️  Building and starting containers..."
docker-compose up -d --build

echo ""
echo "✅ Services are starting up..."
echo ""
echo "📊 Check status:"
echo "   docker-compose ps"
echo ""
echo "📝 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   MongoDB:  localhost:27017 (Primary)"
echo ""
echo "🛑 To stop:"
echo "   docker-compose down"
echo ""
