#!/bin/bash

echo "🔄 Restarting Education Online Platform..."

docker-compose restart

echo "✅ Services restarted"
echo ""
echo "📝 View logs:"
echo "   docker-compose logs -f"
