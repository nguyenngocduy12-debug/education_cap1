#!/bin/bash

echo "📊 Education Online Platform - Status Check"
echo "=========================================="
echo ""

echo "🐳 Docker Containers:"
docker-compose ps
echo ""

echo "📦 MongoDB Replica Set Status:"
docker exec -it mongo_primary mongosh --quiet --eval "rs.status().members.forEach(m => print(m.name + ': ' + m.stateStr))" 2>/dev/null || echo "MongoDB not ready yet"
echo ""

echo "🌐 Services:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:5000"
echo "   MongoDB:   localhost:27017"
echo "   Redis:     localhost:6379"
echo ""

echo "💾 Volume Usage:"
docker system df -v | grep education
echo ""
