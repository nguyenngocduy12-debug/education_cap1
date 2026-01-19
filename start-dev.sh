#!/bin/bash

echo "🎯 KHỞI ĐỘNG DEVELOPMENT MODE - LOCALHOST:3000"
echo "==============================================="
echo ""
echo "Chế độ này chạy:"
echo "  - Database: Docker containers"
echo "  - Backend: npm (Port 5000)"
echo "  - Frontend: npm (Port 3000)"
echo ""
echo "==============================================="
echo ""

# Check if Docker is running
if ! sudo docker info > /dev/null 2>&1; then
    echo "❌ Docker chưa chạy!"
    echo "Hãy khởi động Docker Desktop hoặc Docker daemon"
    echo ""
    echo "Sau đó chạy lại script này"
    exit 1
fi

echo "✅ Docker đang chạy"
echo ""

# Start database containers
echo "🗄️  BƯỚC 1: Khởi động Database containers..."
echo "Lệnh: sudo docker compose up -d mongo-primary mongo-secondary mongo-arbiter redis"
echo ""

cd /home/ngocduy/education_online

sudo docker compose up -d mongo-primary mongo-secondary mongo-arbiter redis

if [ $? -eq 0 ]; then
    echo "✅ Database containers đã khởi động!"
    echo ""
    echo "Chờ 10 giây để MongoDB khởi động hoàn toàn..."
    sleep 10
else
    echo "❌ Lỗi khi khởi động database containers"
    exit 1
fi

# Initialize MongoDB Replica Set (if needed)
echo "🔧 Khởi tạo MongoDB Replica Set..."
sudo docker exec -it mongo_primary mongosh -u admin -p admin123 --authenticationDatabase admin --eval "
try {
    rs.status();
    print('Replica set already initialized');
} catch(e) {
    rs.initiate({
        _id: 'rs0',
        members: [
            { _id: 0, host: 'mongo-primary:27017', priority: 2 },
            { _id: 1, host: 'mongo-secondary:27017', priority: 1 },
            { _id: 2, host: 'mongo-arbiter:27017', arbiterOnly: true }
        ]
    });
    print('Replica set initialized');
}
" 2>/dev/null

echo "✅ MongoDB Replica Set sẵn sàng!"
echo ""

echo "==============================================="
echo "✅ DATABASE ĐÃ SẴN SÀNG!"
echo ""
echo "📝 TIẾP THEO, MỞ 2 TERMINALS MỚI:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TERMINAL 2 - Chạy Backend:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  cd /home/ngocduy/education_online/backend"
echo "  npm run dev"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TERMINAL 3 - Chạy Frontend:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  cd /home/ngocduy/education_online/frontend"
echo "  npm run dev"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Sau khi cả 2 đã chạy, truy cập:"
echo "  🌐 Frontend: http://localhost:3000"
echo "  🔌 Backend:  http://localhost:5000"
echo ""
echo "==============================================="
