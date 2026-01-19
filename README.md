# 🎓 Education Online Platform

> **Hệ thống giáo dục trực tuyến hoàn chỉnh với AI, MongoDB Replica Set, và Chat Moderation**

[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://docker.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Replica%20Set-green)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18-green)](https://nodejs.org)

---

## 🚀 Quick Start

```bash
# 1. Clone project
cd education_online

# 2. Tạo file .env (optional - có mock data)
cp .env.example .env

# 3. Khởi động hệ thống
./start.sh

# 4. Truy cập
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

**Chỉ mất 2-3 phút để chạy!** ⚡

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐
│  React Frontend │ ← Vite + Tailwind CSS
└────────┬────────┘
         │ REST API / WebSocket
┌────────▼────────┐
│  NodeJS Backend │ ← Express + Socket.io
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼──┐
│Primary│  │Redis│
│MongoDB│  │Cache│
└───┬───┘  └─────┘
    │
┌───▼────────┐
│ Secondary  │ ← Replica Set
│  MongoDB   │
└────────────┘
```

## 📦 Công nghệ sử dụng

- **Frontend**: ReactJS, Socket.io Client, Axios
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB Replica Set (Primary + Secondary + Arbiter)
- **Cache**: Redis
- **Container**: Docker, Docker Compose
- **AI**: OpenAI / Gemini API

## 🚀 Chức năng chính

### 1. 🎨 Tạo Slide tự động bằng AI
- Giáo viên nhập chủ đề, level, số lượng slide
- AI tự động sinh nội dung slide
- Lưu vào database

### 2. 📝 Quiz System thông minh
- Tạo bài quiz với nhiều câu hỏi
- **Nếu điểm ≤ 3**: Hệ thống lưu các câu trả lời sai
- **Chế độ "Sửa lỗi"**: Cho phép làm lại để ôn tập (không tính điểm)

### 3. 📺 Livestream + Chat Moderation
- Live stream dạy học trực tuyến
- **Lọc từ ngữ nhạy cảm** tự động
- **Vi phạm > 2 lần** → Cấm chat 1 giờ
- Lưu log vi phạm vào database

## 🔧 Cài đặt

### Yêu cầu
- Docker & Docker Compose
- Node.js 18+ (nếu chạy local)
- AI API Key (OpenAI hoặc Gemini)

### Bước 1: Clone và cấu hình

```bash
# Clone repository
cd education_online

# Tạo file .env từ template
cp .env.example .env

# Chỉnh sửa .env và thêm AI_API_KEY
nano .env
```

### Bước 2: Khởi động hệ thống

```bash
# Build và khởi động tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Kiểm tra trạng thái
docker-compose ps
```

### Bước 3: Kiểm tra MongoDB Replica Set

```bash
# Vào MongoDB Primary
docker exec -it mongo_primary mongosh -u admin -p admin123

# Kiểm tra status
rs.status()
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user

### Slide Generator
- `POST /api/slides/generate` - Tạo slide bằng AI
- `GET /api/slides` - Lấy danh sách slides
- `GET /api/slides/:id` - Lấy chi tiết slide
- `DELETE /api/slides/:id` - Xóa slide

### Quiz System
- `POST /api/quiz/create` - Tạo quiz
- `POST /api/quiz/submit` - Nộp bài
- `GET /api/quiz/review-wrong/:resultId` - Xem câu sai
- `POST /api/quiz/retest` - Làm lại (không tính điểm)

### Livestream
- `POST /api/live/create` - Tạo phiên live
- `POST /api/live/:id/start` - Bắt đầu live
- `POST /api/live/:id/end` - Kết thúc live
- `GET /api/live/violations` - Lấy log vi phạm

### WebSocket Events
- `join-live` - Tham gia live
- `send-message` - Gửi chat
- `message-moderated` - Thông báo vi phạm
- `user-banned` - Thông báo bị cấm

## 🗄️ Database Schema

### User
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: ['teacher', 'student'],
  isBanned: Boolean,
  bannedUntil: Date
}
```

### Slide
```javascript
{
  title: String,
  topic: String,
  level: String,
  slides: [{
    title: String,
    content: String,
    order: Number
  }],
  createdBy: ObjectId (User)
}
```

### Quiz
```javascript
{
  title: String,
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }],
  createdBy: ObjectId (User)
}
```

### QuizResult
```javascript
{
  userId: ObjectId,
  quizId: ObjectId,
  score: Number,
  totalQuestions: Number,
  wrongAnswers: [{
    questionId: ObjectId,
    userAnswer: Number,
    correctAnswer: Number
  }],
  allowRetest: Boolean,
  isRetest: Boolean
}
```

### LiveStream
```javascript
{
  title: String,
  teacherId: ObjectId,
  status: ['scheduled', 'live', 'ended'],
  startTime: Date,
  endTime: Date
}
```

### Violation
```javascript
{
  userId: ObjectId,
  liveId: ObjectId,
  message: String,
  detectedWords: [String],
  timestamp: Date
}
```

## 🔒 Security Features

- JWT Authentication
- Password hashing với bcrypt
- Rate limiting
- CORS configuration
- Input validation
- XSS protection

## 📊 Monitoring

```bash
# Xem logs backend
docker-compose logs -f backend

# Xem logs MongoDB
docker-compose logs -f mongo-primary

# Kiểm tra Redis
docker exec -it redis_cache redis-cli
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 Lưu ý quan trọng

1. **MongoDB Replica Set** cần ít nhất 3 nodes để hoạt động
2. **AI API Key** phải được cấu hình trong `.env`
3. **WebSocket** yêu cầu connection stable
4. **Redis** dùng để cache và session management

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License

## 👥 Contact

Nếu có vấn đề, hãy tạo issue trên GitHub.
