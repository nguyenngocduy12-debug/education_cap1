# ⚡ Quick Start Guide

## 🎯 Mục tiêu
Khởi động hệ thống Education Online trong 5 phút!

## ✅ Checklist trước khi bắt đầu

- [ ] Docker đã cài đặt và đang chạy
- [ ] Docker Compose đã cài đặt
- [ ] Có ít nhất 4GB RAM trống
- [ ] Port 3000, 5000, 27017 chưa bị chiếm

## 🚀 3 Bước đơn giản

### Bước 1: Cấu hình (30 giây)
```bash
cd education_online

# Tạo file .env
cp .env.example .env

# Chỉnh sửa AI API key (optional - có mock data)
nano .env
```

### Bước 2: Khởi động (2-3 phút)
```bash
# Cấp quyền cho scripts
chmod +x *.sh

# Khởi động hệ thống
./start.sh
```

### Bước 3: Truy cập (Ngay lập tức)
```
🌐 Frontend: http://localhost:3000
🔌 Backend:  http://localhost:5000
```

## 🎮 Test nhanh

### 1. Tạo tài khoản Teacher
1. Mở http://localhost:3000
2. Click "Đăng ký"
3. Nhập thông tin:
   - Name: `Teacher Test`
   - Email: `teacher@test.com`
   - Password: `123456`
   - Role: **Giáo viên**
4. Click "Đăng ký"

### 2. Tạo Slide với AI
1. Dashboard → Click "Tạo Slide AI"
2. Nhập:
   - Chủ đề: `Toán lớp 9`
   - Mức độ: `Trung bình`
   - Số slide: `5`
   - Ngôn ngữ: `Tiếng Việt`
3. Click "Tạo Slide"
4. Chờ 10-20 giây → Xong!

### 3. Tạo Quiz (Coming soon)
Dashboard → "Tạo Quiz"

### 4. Livestream (Coming soon)
Dashboard → "Livestream"

## 📊 Kiểm tra trạng thái

```bash
# Xem trạng thái services
./status.sh

# Hoặc
docker-compose ps
```

Expected output:
```
NAME                STATUS    PORTS
education_backend   running   0.0.0.0:5000->5000/tcp
education_frontend  running   0.0.0.0:3000->3000/tcp
mongo_primary       running   0.0.0.0:27017->27017/tcp
mongo_secondary     running   0.0.0.0:27018->27017/tcp
mongo_arbiter       running   0.0.0.0:27019->27017/tcp
redis_cache         running   0.0.0.0:6379->6379/tcp
```

## 🔍 Xem logs

```bash
# Tất cả services
docker-compose logs -f

# Chỉ backend
docker-compose logs -f backend

# Chỉ frontend
docker-compose logs -f frontend
```

## 🛑 Dừng hệ thống

```bash
./stop.sh
```

## 🔄 Restart

```bash
./restart.sh
```

## ⚠️ Troubleshooting

### Lỗi: Port already in use
```bash
# Kiểm tra port nào đang dùng
lsof -i :3000  # Frontend
lsof -i :5000  # Backend

# Kill process hoặc đổi port trong docker-compose.yml
```

### Lỗi: MongoDB connection failed
```bash
# Restart MongoDB services
docker-compose restart mongo-primary mongo-secondary mongo-arbiter

# Xem logs
docker-compose logs mongo-primary
```

### Lỗi: Cannot build images
```bash
# Clean build
docker-compose down -v
docker-compose up -d --build
```

## 🎓 Tính năng chính

### ✅ Đã hoàn thành
- [x] Authentication (Register/Login)
- [x] MongoDB Replica Set (Primary + Secondary + Arbiter)
- [x] AI Slide Generator
- [x] Slide Management
- [x] Quiz System với Retest
- [x] Livestream với Chat Moderation
- [x] WebSocket Real-time Chat
- [x] Bad Word Filter
- [x] Auto Ban (>2 violations = 1 hour ban)

### 🚧 Đang phát triển
- [ ] Quiz UI pages
- [ ] Livestream UI pages
- [ ] Video streaming
- [ ] File upload
- [ ] Analytics dashboard

## 📚 Documentation

- [README.md](README.md) - Tổng quan project
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Hướng dẫn chi tiết
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API docs
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Cấu trúc project

## 💡 Tips

### Development Mode
```bash
# Chạy backend local (không dùng Docker)
cd backend
npm install
npm run dev

# Chạn frontend local
cd frontend
npm install
npm run dev
```

### Database Access
```bash
# Vào MongoDB shell
docker exec -it mongo_primary mongosh -u admin -p admin123

# Xem databases
show dbs

# Sử dụng database
use education_db

# Xem collections
show collections

# Query
db.users.find()
```

### Redis Access
```bash
# Vào Redis CLI
docker exec -it redis_cache redis-cli

# Test
PING
# Response: PONG
```

## 🎯 Next Steps

1. ✅ Khởi động hệ thống
2. ✅ Tạo tài khoản
3. ✅ Test Slide Generator
4. 📖 Đọc API Documentation
5. 🔧 Tùy chỉnh theo nhu cầu
6. 🚀 Deploy to production

## 🆘 Need Help?

- Check [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Check logs: `docker-compose logs -f`
- Check status: `./status.sh`
- Open issue on GitHub

## 🎉 Success!

Nếu bạn thấy:
- ✅ Frontend running on http://localhost:3000
- ✅ Backend running on http://localhost:5000
- ✅ MongoDB connected
- ✅ Có thể login

🎊 **Chúc mừng! Hệ thống đã sẵn sàng!** 🎊
