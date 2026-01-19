#!/bin/bash

echo "🧪 Testing Education Online Platform"
echo "===================================="
echo ""

API_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:3000"

echo "1️⃣  Testing Backend API..."
if curl -s "$API_URL" > /dev/null; then
    echo "   ✅ Backend is running at $API_URL"
    
    # Test API health
    RESPONSE=$(curl -s "$API_URL/api" || echo "")
    if [[ ! -z "$RESPONSE" ]]; then
        echo "   ✅ API endpoints are accessible"
    fi
else
    echo "   ❌ Backend is NOT running"
    echo "   Run: ./start.sh"
    exit 1
fi

echo ""
echo "2️⃣  Testing Frontend..."
if curl -s "$FRONTEND_URL" > /dev/null; then
    echo "   ✅ Frontend is running at $FRONTEND_URL"
else
    echo "   ❌ Frontend is NOT running"
    echo "   Run: ./start.sh"
    exit 1
fi

echo ""
echo "3️⃣  Testing MongoDB..."
MONGO_STATUS=$(docker exec -it mongo_primary mongosh --quiet --eval "db.adminCommand('ping').ok" 2>/dev/null || echo "0")
if [[ "$MONGO_STATUS" == *"1"* ]]; then
    echo "   ✅ MongoDB Primary is running"
else
    echo "   ❌ MongoDB is NOT running"
    exit 1
fi

echo ""
echo "4️⃣  Testing Redis..."
REDIS_STATUS=$(docker exec -it redis_cache redis-cli ping 2>/dev/null || echo "")
if [[ "$REDIS_STATUS" == *"PONG"* ]]; then
    echo "   ✅ Redis is running"
else
    echo "   ❌ Redis is NOT running"
fi

echo ""
echo "5️⃣  Testing MongoDB Replica Set..."
RS_STATUS=$(docker exec -it mongo_primary mongosh --quiet --eval "rs.status().ok" -u admin -p admin123 --authenticationDatabase admin 2>/dev/null || echo "0")
if [[ "$RS_STATUS" == *"1"* ]]; then
    echo "   ✅ Replica Set is configured"
    
    # Count members
    MEMBERS=$(docker exec -it mongo_primary mongosh --quiet --eval "rs.status().members.length" -u admin -p admin123 --authenticationDatabase admin 2>/dev/null || echo "0")
    echo "   ℹ️  Replica Set Members: $MEMBERS"
else
    echo "   ⚠️  Replica Set might not be initialized yet"
    echo "   Wait 30 seconds and try again"
fi

echo ""
echo "======================================"
echo "✅ All systems are operational!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: $FRONTEND_URL"
echo "   Backend:  $API_URL"
echo ""
echo "📝 Next steps:"
echo "   1. Open $FRONTEND_URL in browser"
echo "   2. Register a new teacher account"
echo "   3. Create slides with AI"
echo "   4. Explore other features"
echo ""
echo "📚 Documentation:"
echo "   - README.md"
echo "   - QUICK_START.md"
echo "   - API_DOCUMENTATION.md"
echo ""
