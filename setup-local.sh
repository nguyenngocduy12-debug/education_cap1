#!/bin/bash

echo "🚀 HƯỚNG DẪN KHỞI ĐỘNG HỆ THỐNG - LOCALHOST:3000"
echo "=================================================="
echo ""

echo "📋 CHUẨN BỊ:"
echo "1. Cài đặt dependencies"
echo "2. Khởi động Database (Docker)"
echo "3. Khởi động Backend (Port 5000)"
echo "4. Khởi động Frontend (Port 3000)"
echo ""
echo "=================================================="
echo ""

# Step 1: Install Backend Dependencies
echo "📦 BƯỚC 1: Cài đặt Backend Dependencies..."
echo "Lệnh: cd backend && npm install"
echo ""

cd /home/ngocduy/education_online/backend

if [ ! -d "node_modules" ]; then
    echo "⏳ Đang cài đặt backend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Backend dependencies đã cài đặt!"
    else
        echo "❌ Lỗi khi cài đặt backend dependencies"
        exit 1
    fi
else
    echo "✅ Backend dependencies đã có sẵn"
fi

echo ""

# Step 2: Install Frontend Dependencies
echo "📦 BƯỚC 2: Cài đặt Frontend Dependencies..."
echo "Lệnh: cd frontend && npm install"
echo ""

cd /home/ngocduy/education_online/frontend

if [ ! -d "node_modules" ]; then
    echo "⏳ Đang cài đặt frontend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Frontend dependencies đã cài đặt!"
    else
        echo "❌ Lỗi khi cài đặt frontend dependencies"
        exit 1
    fi
else
    echo "✅ Frontend dependencies đã có sẵn"
fi

echo ""
echo "=================================================="
echo "✅ HOÀN TẤT CÀI ĐẶT!"
echo ""
echo "🎯 TIẾP THEO:"
echo ""
echo "OPTION 1: Chạy với Docker (Khuyến nghị)"
echo "  sudo docker compose up -d"
echo "  Sau đó mở: http://localhost:3000"
echo ""
echo "OPTION 2: Chạy local (Development)"
echo "  Cần 3 terminals:"
echo ""
echo "  Terminal 1 - Database:"
echo "    sudo docker compose up -d mongo-primary mongo-secondary mongo-arbiter redis"
echo ""
echo "  Terminal 2 - Backend:"
echo "    cd backend && npm run dev"
echo ""
echo "  Terminal 3 - Frontend:"
echo "    cd frontend && npm run dev"
echo ""
echo "=================================================="
