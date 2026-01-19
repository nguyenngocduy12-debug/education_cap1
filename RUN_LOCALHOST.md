# 🚀 HƯỚNG DẪN CHẠY LOCALHOST:3000

## ✅ Đã hoàn thành
- [x] Cài đặt Backend dependencies
- [x] Cài đặt Frontend dependencies

## 🎯 3 CÁCH KHỞI ĐỘNG

### CÁCH 1: Toàn bộ với Docker (Đơn giản nhất)

```bash
# Khởi động tất cả services
sudo docker compose up -d

# Xem logs
sudo docker compose logs -f

# Truy cập
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

**Ưu điểm:** Dễ dàng, một lệnh duy nhất  
**Nhược điểm:** Chậm khi sửa code (cần rebuild)

---

### CÁCH 2: Development Mode (Khuyến nghị) ⭐

Chạy database bằng Docker, code chạy local (hot reload).

#### Terminal 1 - Database (Script tự động)
```bash
cd /home/ngocduy/education_online
chmod +x start-dev.sh
./start-dev.sh
```

Hoặc thủ công:
```bash
sudo docker compose up -d mongo-primary mongo-secondary mongo-arbiter redis
```

#### Terminal 2 - Backend
```bash
cd /home/ngocduy/education_online/backend
npm run dev
```

Bạn sẽ thấy:
```
✅ MongoDB Replica Set connected successfully
🚀 Server running on port 5000
🌐 Environment: development
```

#### Terminal 3 - Frontend
```bash
cd /home/ngocduy/education_online/frontend
npm run dev
```

Bạn sẽ thấy:
```
  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Truy cập:** http://localhost:3000

**Ưu điểm:**
- ✅ Hot reload (code update ngay lập tức)
- ✅ Dễ debug
- ✅ Logs rõ ràng

**Nhược điểm:** Cần 3 terminals

---

### CÁCH 3: Hoàn toàn Local (Advanced)

Không dùng Docker, cần MongoDB và Redis cài sẵn.

**Không khuyến nghị** - Quá phức tạp để setup.

---

## 🔍 KIỂM TRA HỆ THỐNG

### 1. Kiểm tra Database đang chạy
```bash
sudo docker compose ps

# Kết quả mong đợi:
# mongo-primary    running
# mongo-secondary  running
# mongo-arbiter    running
# redis            running
```

### 2. Kiểm tra MongoDB Replica Set
```bash
sudo docker exec -it mongo_primary mongosh -u admin -p admin123 --eval "rs.status()" | grep stateStr
```

### 3. Test Backend API
```bash
curl http://localhost:5000

# Kết quả mong đợi: JSON response
```

### 4. Test Frontend
```bash
curl http://localhost:3000

# Kết quả mong đợi: HTML response
```

---

## 🎯 WORKFLOW DEVELOPMENT

### Lần đầu tiên:
```bash
# 1. Cài dependencies (chỉ 1 lần)
bash setup-local.sh

# 2. Khởi động database
bash start-dev.sh

# 3. Mở terminal mới - chạy backend
cd backend && npm run dev

# 4. Mở terminal mới - chạy frontend
cd frontend && npm run dev

# 5. Mở browser
http://localhost:3000
```

### Các lần sau:
```bash
# Terminal 1
bash start-dev.sh

# Terminal 2
cd backend && npm run dev

# Terminal 3
cd frontend && npm run dev
```

---

## 🐛 XỬ LÝ LỖI

### Lỗi: Port 3000 đã được sử dụng
```bash
# Tìm process
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Lỗi: Port 5000 đã được sử dụng
```bash
lsof -i :5000
kill -9 <PID>
```

### Lỗi: Cannot connect to MongoDB
```bash
# Restart database containers
sudo docker compose restart mongo-primary mongo-secondary mongo-arbiter

# Xem logs
sudo docker compose logs mongo-primary
```

### Lỗi: Docker permission denied
```bash
# Thêm user vào docker group (khuyến nghị)
sudo usermod -aG docker $USER
newgrp docker

# Hoặc luôn dùng sudo
sudo docker compose ...
```

### Backend không connect được database
Kiểm tra MONGO_URI trong `/home/ngocduy/education_online/.env`:
```env
MONGO_URI=mongodb://admin:admin123@localhost:27017,localhost:27018/education_db?replicaSet=rs0&authSource=admin
```

### Frontend không gọi được API
Kiểm tra `/home/ngocduy/education_online/frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

---

## 📝 LOGS

### Xem logs backend (development mode)
Logs hiển thị trực tiếp trong terminal

### Xem logs frontend (development mode)
Logs hiển thị trực tiếp trong terminal

### Xem logs database
```bash
sudo docker compose logs -f mongo-primary
sudo docker compose logs -f redis
```

---

## 🛑 DỪNG HỆ THỐNG

### Dừng backend/frontend
`Ctrl + C` trong terminal tương ứng

### Dừng database
```bash
sudo docker compose stop
```

### Dừng và xóa containers
```bash
sudo docker compose down
```

### Dừng và xóa cả volumes (⚠️ Mất dữ liệu)
```bash
sudo docker compose down -v
```

---

## ✅ CHECKLIST

Khi mọi thứ chạy đúng, bạn sẽ thấy:

- [x] Database containers running (4 containers)
- [x] Backend console shows "Server running on port 5000"
- [x] Frontend console shows "Local: http://localhost:3000"
- [x] Browser mở được http://localhost:3000
- [x] Có thể register/login

---

## 🎓 TEST FLOW

1. Mở http://localhost:3000
2. Click "Đăng ký"
3. Tạo tài khoản Teacher
4. Login
5. Vào "Tạo Slide AI"
6. Nhập chủ đề và tạo slide
7. Xem danh sách slides

**Nếu tất cả đều hoạt động → Hệ thống chạy hoàn hảo!** 🎉

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Đọc phần XỬ LÝ LỖI ở trên
2. Xem logs: `sudo docker compose logs -f`
3. Check [DEVELOPMENT.md](DEVELOPMENT.md)
