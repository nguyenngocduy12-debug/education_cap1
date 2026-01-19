# 📡 API Documentation

Base URL: `http://localhost:5000/api`

## 🔐 Authentication

Tất cả các API endpoint (trừ login/register) yêu cầu JWT token trong header:

```
Authorization: Bearer <your_token>
```

---

## 👤 Authentication APIs

### 1. Register
**POST** `/auth/register`

**Body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "role": "student" // hoặc "teacher"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "role": "student"
  }
}
```

### 2. Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as Register

### 3. Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "123",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "role": "student",
    "isBanned": false,
    "bannedUntil": null
  }
}
```

---

## 📝 Slide APIs

### 1. Generate Slides with AI
**POST** `/slides/generate` 🔒 Teacher only

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "topic": "Toán lớp 9",
  "level": "medium", // "easy", "medium", "hard"
  "numberSlide": 10,
  "language": "vi" // "vi" hoặc "en"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Slides generated successfully",
  "data": {
    "_id": "slide_id",
    "title": "Bài giảng: Toán lớp 9",
    "topic": "Toán lớp 9",
    "level": "medium",
    "slides": [
      {
        "order": 1,
        "title": "Giới thiệu",
        "content": "Nội dung slide...",
        "bulletPoints": ["Điểm 1", "Điểm 2"]
      }
    ],
    "createdBy": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Get All Slides
**GET** `/slides`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "slide_id",
      "title": "Bài giảng: Toán lớp 9",
      "topic": "Toán lớp 9",
      "level": "medium",
      "slides": [...],
      "createdBy": {
        "name": "Teacher Name",
        "email": "teacher@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. Get Slide by ID
**GET** `/slides/:id`

**Headers:** `Authorization: Bearer <token>`

### 4. Delete Slide
**DELETE** `/slides/:id` 🔒 Owner only

**Headers:** `Authorization: Bearer <token>`

---

## 📚 Quiz APIs

### 1. Create Quiz
**POST** `/quiz/create` 🔒 Teacher only

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "Kiểm tra Toán lớp 9",
  "description": "Bài kiểm tra chương 1",
  "passingScore": 3,
  "timeLimit": 30,
  "questions": [
    {
      "question": "2 + 2 = ?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": 1,
      "explanation": "2 + 2 = 4"
    }
  ]
}
```

### 2. Get All Quizzes
**GET** `/quiz`

**Headers:** `Authorization: Bearer <token>`

### 3. Get Quiz by ID
**GET** `/quiz/:id`

**Headers:** `Authorization: Bearer <token>`

**Note:** Không trả về đáp án đúng

### 4. Submit Quiz
**POST** `/quiz/submit`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "quizId": "quiz_id",
  "answers": [
    {
      "questionId": "question_id",
      "selectedAnswer": 1
    }
  ],
  "timeTaken": 300
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "score": 2,
    "totalQuestions": 10,
    "passed": false,
    "allowRetest": true, // true nếu điểm <= 3
    "wrongAnswers": [
      {
        "questionId": "id",
        "question": "Câu hỏi...",
        "selectedAnswer": 0,
        "correctAnswer": 1,
        "explanation": "Giải thích..."
      }
    ],
    "resultId": "result_id"
  }
}
```

### 5. Review Wrong Answers
**GET** `/quiz/review-wrong/:resultId`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "quizTitle": "Kiểm tra Toán lớp 9",
    "score": 2,
    "totalQuestions": 10,
    "wrongAnswers": [...],
    "allowRetest": true
  }
}
```

### 6. Retest (Practice Mode)
**POST** `/quiz/retest`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "originalResultId": "result_id",
  "answers": [
    {
      "questionId": "question_id",
      "selectedAnswer": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Retest completed (not counted towards grade)",
  "data": {
    "score": 5,
    "totalQuestions": 8,
    "improvement": 5,
    "resultId": "retest_result_id"
  }
}
```

---

## 📺 Livestream APIs

### 1. Create Livestream
**POST** `/live/create` 🔒 Teacher only

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "Lớp Toán lớp 9",
  "description": "Buổi học trực tuyến",
  "scheduledTime": "2024-01-01T10:00:00.000Z"
}
```

### 2. Start Livestream
**POST** `/live/:id/start` 🔒 Teacher only

**Headers:** `Authorization: Bearer <token>`

### 3. End Livestream
**POST** `/live/:id/end` 🔒 Teacher only

**Headers:** `Authorization: Bearer <token>`

### 4. Get All Livestreams
**GET** `/live`

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `status`: "scheduled", "live", "ended"

### 5. Get Livestream by ID
**GET** `/live/:id`

**Headers:** `Authorization: Bearer <token>`

### 6. Get Violations
**GET** `/live/:id/violations` 🔒 Teacher only

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "violation_id",
      "userId": {
        "name": "User Name",
        "email": "user@example.com"
      },
      "message": "Message vi phạm",
      "detectedWords": ["từ xấu"],
      "violationType": "profanity",
      "action": "warning",
      "timestamp": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

---

## 🔌 WebSocket Events

Connect to: `ws://localhost:5000`

**Authentication:**
```javascript
const socket = io('http://localhost:5000', {
  auth: { token: 'your_jwt_token' }
})
```

### Client → Server Events

#### 1. Join Livestream
```javascript
socket.emit('join-live', liveId)
```

#### 2. Send Message
```javascript
socket.emit('send-message', {
  liveId: 'live_id',
  message: 'Hello everyone!'
})
```

#### 3. Leave Livestream
```javascript
socket.emit('leave-live', liveId)
```

### Server → Client Events

#### 1. User Joined
```javascript
socket.on('user-joined', (data) => {
  // { userId, name }
})
```

#### 2. New Message
```javascript
socket.on('new-message', (data) => {
  // { id, userId, userName, userRole, message, timestamp }
})
```

#### 3. Message Moderated (Warning)
```javascript
socket.on('message-moderated', (data) => {
  // { message, detectedWords, violationCount, warning }
})
```

#### 4. User Banned
```javascript
socket.on('user-banned', (data) => {
  // { message, bannedUntil, violations }
})
```

#### 5. Message Blocked
```javascript
socket.on('message-blocked', (data) => {
  // { message, bannedUntil }
})
```

#### 6. Participants Update
```javascript
socket.on('participants-update', (data) => {
  // { count }
})
```

#### 7. Error
```javascript
socket.on('error', (data) => {
  // { message }
})
```

---

## 🚨 Error Responses

Tất cả các error đều có format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

### Common Error Codes:
- `400` - Bad Request (Invalid input)
- `401` - Unauthorized (No token or invalid token)
- `403` - Forbidden (No permission or banned)
- `404` - Not Found
- `500` - Internal Server Error

### Ban Response:
```json
{
  "success": false,
  "message": "You are banned until 2024-01-01T11:00:00.000Z",
  "bannedUntil": "2024-01-01T11:00:00.000Z"
}
```

---

## 📋 Testing với cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Generate Slides (với token)
```bash
curl -X POST http://localhost:5000/api/slides/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "topic": "Test Topic",
    "level": "medium",
    "numberSlide": 5,
    "language": "vi"
  }'
```
