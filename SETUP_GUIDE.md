# 🚀 Hướng dẫn chạy hệ thống

## Bước 1: Chuẩn bị

### Yêu cầu hệ thống
- Docker và Docker Compose đã cài đặt
- Ít nhất 4GB RAM trống
- 10GB dung lượng ổ cứng

### Cấu hình API Key
```bash
# Tạo file .env từ template
cp .env.example .env

# Chỉnh sửa file .env và thêm API key
nano .env
```

Cập nhật dòng sau trong `.env`:
```
AI_API_KEY=your_actual_api_key_here
```

## Bước 2: Khởi động hệ thống

### Cách 1: Sử dụng script (Khuyến nghị)
```bash
# Cấp quyền thực thi cho scripts
chmod +x *.sh

# Khởi động
./start.sh
```

### Cách 2: Manual với Docker Compose
```bash
# Build và khởi động tất cả services
docker-compose up -d --build

# Xem logs
docker-compose logs -f
```

## Bước 3: Kiểm tra trạng thái

```bash
# Xem trạng thái tất cả services
./status.sh

# Hoặc dùng Docker Compose
docker-compose ps
```

## Bước 4: Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB Primary**: localhost:27017
- **Redis**: localhost:6379

## Bước 5: Tạo tài khoản

1. Truy cập http://localhost:3000
2. Click "Đăng ký"
3. Nhập thông tin và chọn vai trò (Giáo viên hoặc Học viên)
4. Đăng nhập

## Các lệnh hữu ích

### Xem logs
```bash
# Tất cả services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# MongoDB only
docker-compose logs -f mongo-primary
```

### Kiểm tra MongoDB Replica Set
```bash
# Vào MongoDB shell
docker exec -it mongo_primary mongosh -u admin -p admin123

# Kiểm tra replica status
rs.status()

# Thoát
exit
```

### Restart services
```bash
# Restart tất cả
./restart.sh

# Hoặc restart từng service
docker-compose restart backend
docker-compose restart frontend
```

### Dừng hệ thống
```bash
# Sử dụng script
./stop.sh

# Hoặc
docker-compose down

# Dừng và xóa volumes (⚠️ Mất dữ liệu)
docker-compose down -v
```

### Rebuild sau khi thay đổi code
```bash
# Rebuild tất cả
docker-compose up -d --build

# Rebuild một service cụ thể
docker-compose up -d --build backend
```

## Xử lý lỗi thường gặp

### MongoDB không kết nối được
```bash
# Xem logs MongoDB
docker-compose logs mongo-primary

# Restart MongoDB
docker-compose restart mongo-primary mongo-secondary mongo-arbiter

# Init replica set lại
docker exec -it mongo_primary bash /scripts/init-replica.sh
```

### Backend không connect được MongoDB
```bash
# Kiểm tra connection string trong .env
# Đảm bảo MONGO_URI đúng format

# Restart backend
docker-compose restart backend
```

### Frontend không gọi được API
```bash
# Kiểm tra VITE_API_URL trong frontend/.env
# Đảm bảo = http://localhost:5000

# Rebuild frontend
docker-compose up -d --build frontend
```

### Port bị chiếm
```bash
# Kiểm tra port đang dùng
lsof -i :3000  # Frontend
lsof -i :5000  # Backend
lsof -i :27017 # MongoDB

# Đổi port trong docker-compose.yml nếu cần
```

## Development

### Chạy backend local (không dùng Docker)
```bash
cd backend
npm install
npm run dev
```

### Chạy frontend local
```bash
cd frontend
npm install
npm run dev
```

## Production Deployment

⚠️ **Chú ý**: Cần thay đổi một số cấu hình trước khi deploy production:

1. Đổi JWT_SECRET
2. Đổi MongoDB password
3. Enable HTTPS
4. Cấu hình CORS đúng domain
5. Tối ưu Docker images (multi-stage build)
6. Setup reverse proxy (Nginx)
7. Enable monitoring và logging

## Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs: `docker-compose logs -f`
2. Kiểm tra status: `./status.sh`
3. Restart services: `./restart.sh`
4. Tạo issue trên GitHub
