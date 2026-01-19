# 📁 Cấu trúc Project

```
education_online/
│
├── 📋 docker-compose.yml          # Docker orchestration
├── 📋 .env.example                # Environment variables template
├── 📋 .gitignore                  # Git ignore rules
├── 📋 README.md                   # Project documentation
├── 📋 API_DOCUMENTATION.md        # API documentation
├── 📋 SETUP_GUIDE.md              # Setup instructions
│
├── 🔧 Scripts/
│   ├── start.sh                   # Khởi động hệ thống
│   ├── stop.sh                    # Dừng hệ thống
│   ├── restart.sh                 # Restart services
│   ├── status.sh                  # Kiểm tra trạng thái
│   └── init-replica.sh            # Init MongoDB replica set
│
├── 🖥️ BACKEND/                     # Node.js Backend
│   ├── Dockerfile
│   ├── package.json
│   ├── .gitignore
│   │
│   └── src/
│       ├── server.js              # Main server file
│       │
│       ├── models/                # MongoDB models
│       │   ├── User.model.js
│       │   ├── Slide.model.js
│       │   ├── Quiz.model.js
│       │   ├── QuizResult.model.js
│       │   ├── LiveStream.model.js
│       │   └── Violation.model.js
│       │
│       ├── routes/                # API routes
│       │   ├── auth.routes.js
│       │   ├── slide.routes.js
│       │   ├── quiz.routes.js
│       │   └── live.routes.js
│       │
│       ├── middleware/            # Middlewares
│       │   └── auth.middleware.js
│       │
│       ├── services/              # Business logic
│       │   ├── ai.service.js      # AI integration
│       │   └── moderation.service.js  # Chat moderation
│       │
│       └── websocket/             # WebSocket handlers
│           └── socket.handler.js
│
├── 🌐 FRONTEND/                    # React Frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── .env.example
│   │
│   └── src/
│       ├── main.jsx               # Entry point
│       ├── App.jsx                # Main app component
│       ├── index.css              # Global styles
│       │
│       ├── components/            # Reusable components
│       │   └── Layout.jsx
│       │
│       ├── pages/                 # Page components
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── SlideGenerator.jsx
│       │   ├── SlideList.jsx
│       │   └── QuizCreate.jsx
│       │
│       ├── services/              # API & Socket services
│       │   ├── api.js
│       │   └── socket.js
│       │
│       └── store/                 # State management
│           └── authStore.js
│
└── 🗄️ DOCKER VOLUMES/              # Persistent data
    ├── mongo-primary-data/
    ├── mongo-secondary-data/
    ├── mongo-arbiter-data/
    └── redis-data/
```

## 📦 Docker Services

### 1. **mongo-primary** (Port 27017)
- MongoDB Primary node
- Handles write operations
- Replicates to secondary

### 2. **mongo-secondary** (Port 27018)
- MongoDB Secondary node
- Handles read operations
- Backup và failover

### 3. **mongo-arbiter** (Port 27019)
- MongoDB Arbiter node
- Voting trong replica set
- Không lưu dữ liệu

### 4. **redis** (Port 6379)
- Redis cache
- Session storage
- Message queue (optional)

### 5. **backend** (Port 5000)
- Node.js + Express
- REST API + WebSocket
- Business logic

### 6. **frontend** (Port 3000)
- React + Vite
- Tailwind CSS
- User interface

## 🔄 Data Flow

### 1. Authentication Flow
```
User → Frontend → Backend API → MongoDB Primary
                                     ↓
                              JWT Token
                                     ↓
                              Frontend Store
```

### 2. Slide Generation Flow
```
Teacher → Frontend → Backend API → AI Service (OpenAI/Gemini)
                                         ↓
                                   Parse Response
                                         ↓
                                   MongoDB Primary
                                         ↓
                                   Sync to Secondary
```

### 3. Quiz Submission Flow
```
Student → Frontend → Backend API → Calculate Score
                                         ↓
                                   Check if <= 3
                                         ↓
                                   Save Wrong Answers
                                         ↓
                                   Enable Retest Mode
                                         ↓
                                   MongoDB Primary
```

### 4. Livestream Chat Flow
```
User → Frontend → WebSocket → Chat Moderation
                                     ↓
                              Check Bad Words
                                     ↓
                         Yes → Count Violations
                                     ↓
                              > 2 violations?
                                     ↓
                         Yes → Ban User (1 hour)
                                     ↓
                              Save to MongoDB
                                     ↓
                         No → Broadcast Message
```

## 🔐 Security Layers

1. **JWT Authentication**
   - Token-based auth
   - 7 days expiry
   - Refresh on login

2. **Password Hashing**
   - bcryptjs
   - Salt rounds: 10

3. **Role-Based Access**
   - Teacher: Create slides, quizzes, livestreams
   - Student: View, take quizzes, join livestreams

4. **Input Validation**
   - express-validator
   - MongoDB injection prevention

5. **CORS Protection**
   - Configured origins
   - Credentials allowed

6. **Rate Limiting**
   - Prevent spam
   - DDoS protection

7. **Content Moderation**
   - Bad word filtering
   - Auto-ban system
   - Violation tracking

## 📊 Database Schema Overview

### Collections:

1. **users**
   - Authentication
   - Role management
   - Ban status

2. **slides**
   - AI-generated content
   - Metadata tracking

3. **quizzes**
   - Questions & answers
   - Passing criteria

4. **quizresults**
   - Student scores
   - Wrong answers
   - Retest eligibility

5. **livestreams**
   - Session info
   - Participants
   - Settings

6. **violations**
   - Chat violations
   - User tracking
   - Action logs

## 🚀 Deployment Architecture

```
                    [ Load Balancer ]
                           |
              ┌────────────┴────────────┐
              ↓                         ↓
         [ Frontend ]            [ Backend API ]
         (React/Nginx)           (Node.js)
              |                         |
              |                    ┌────┴────┐
              |                    ↓         ↓
              |              [ MongoDB ]  [ Redis ]
              |              Replica Set    Cache
              |
         [ CDN/Storage ]
         (Static Assets)
```

## 🔧 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://...
JWT_SECRET=...
AI_API_KEY=...
AI_API_URL=...
REDIS_URL=...
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

## 📝 API Endpoints Summary

- **Auth**: `/api/auth/*`
- **Slides**: `/api/slides/*`
- **Quiz**: `/api/quiz/*`
- **Live**: `/api/live/*`
- **WebSocket**: Connection-based events

## 🧪 Testing Strategy

1. **Unit Tests**
   - Models
   - Services
   - Utilities

2. **Integration Tests**
   - API endpoints
   - Database operations

3. **E2E Tests**
   - User workflows
   - WebSocket communication

4. **Load Tests**
   - Concurrent users
   - Database performance
   - Replica set failover

## 📈 Monitoring & Logging

- **Application Logs**: Morgan (HTTP requests)
- **Error Tracking**: Console + File logs
- **Performance**: Response times
- **Database**: MongoDB logs
- **WebSocket**: Connection events

## 🔄 CI/CD Pipeline (Future)

```
Git Push → GitHub Actions
              ↓
         Run Tests
              ↓
         Build Docker
              ↓
         Push to Registry
              ↓
         Deploy to Server
              ↓
         Health Check
```
