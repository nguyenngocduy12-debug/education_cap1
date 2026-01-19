# 🔧 Development Guide

## 🎯 Chạy từng service riêng lẻ (Development Mode)

### 1️⃣ Backend Development

#### Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp ../.env.example .env
```

#### Environment Variables (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://admin:admin123@localhost:27017,localhost:27018/education_db?replicaSet=rs0&authSource=admin
JWT_SECRET=your-jwt-secret-key
AI_API_KEY=your-openai-or-gemini-key
AI_API_URL=https://api.openai.com/v1
REDIS_URL=redis://localhost:6379
```

#### Run
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

**Access:** http://localhost:5000

---

### 2️⃣ Frontend Development

#### Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

#### Environment Variables (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

#### Run
```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Access:** http://localhost:3000

---

### 3️⃣ MongoDB Replica Set (Docker)

#### Run only MongoDB containers
```bash
docker-compose up -d mongo-primary mongo-secondary mongo-arbiter
```

#### Initialize Replica Set
```bash
# Wait for containers to be ready
sleep 10

# Initialize replica set
docker exec -it mongo_primary mongosh -u admin -p admin123 --authenticationDatabase admin --eval '
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo-primary:27017", priority: 2 },
    { _id: 1, host: "mongo-secondary:27017", priority: 1 },
    { _id: 2, host: "mongo-arbiter:27017", arbiterOnly: true }
  ]
})
'
```

#### Check Status
```bash
docker exec -it mongo_primary mongosh -u admin -p admin123 --authenticationDatabase admin --eval 'rs.status()'
```

#### Connect locally
```bash
# MongoDB Compass or CLI
mongodb://admin:admin123@localhost:27017,localhost:27018/?replicaSet=rs0&authSource=admin
```

---

### 4️⃣ Redis (Docker)

#### Run only Redis
```bash
docker-compose up -d redis
```

#### Test connection
```bash
docker exec -it redis_cache redis-cli ping
# Should return: PONG
```

---

## 🔄 Development Workflow

### Option 1: Full Docker (Recommended for testing)
```bash
# Start everything
./start.sh

# View logs
docker-compose logs -f

# Stop everything
./stop.sh
```

### Option 2: Hybrid (Docker DB + Local Code)
```bash
# Start only databases
docker-compose up -d mongo-primary mongo-secondary mongo-arbiter redis

# Terminal 1: Run backend
cd backend
npm run dev

# Terminal 2: Run frontend
cd frontend
npm run dev
```

**Advantages:**
- ✅ Faster code changes
- ✅ Better debugging
- ✅ IDE integration
- ✅ Direct console output

### Option 3: All Local (Advanced)

**Requirements:**
- MongoDB 7.0+ installed
- Redis 7+ installed
- Node.js 18+ installed

**Not recommended** because:
- ❌ Complex MongoDB replica set setup
- ❌ Manual service management
- ❌ Environment conflicts

---

## 🐛 Debugging

### Backend Debugging (VS Code)

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/server.js",
      "envFile": "${workspaceFolder}/backend/.env",
      "console": "integratedTerminal"
    }
  ]
}
```

### Frontend Debugging (Browser DevTools)

1. Open http://localhost:3000
2. F12 → Sources tab
3. Find source files
4. Set breakpoints

### MongoDB Debugging

```bash
# Enter MongoDB shell
docker exec -it mongo_primary mongosh -u admin -p admin123

# Switch to database
use education_db

# Query collections
db.users.find().pretty()
db.slides.find().pretty()
db.quizresults.find().pretty()

# Check indexes
db.users.getIndexes()

# Check replica status
rs.status()
```

### Redis Debugging

```bash
# Enter Redis CLI
docker exec -it redis_cache redis-cli

# List all keys
KEYS *

# Get value
GET key_name

# Monitor commands
MONITOR
```

---

## 🧪 Testing

### Backend Unit Tests

Create `backend/src/__tests__/user.test.js`:
```javascript
const User = require('../models/User.model')

describe('User Model', () => {
  it('should hash password', async () => {
    const user = new User({
      name: 'Test',
      email: 'test@test.com',
      password: 'password123'
    })
    await user.save()
    expect(user.password).not.toBe('password123')
  })
})
```

Run tests:
```bash
cd backend
npm test
```

### Frontend Tests

Create `frontend/src/__tests__/App.test.jsx`:
```javascript
import { render, screen } from '@testing-library/react'
import App from '../App'

test('renders app', () => {
  render(<App />)
  // Add assertions
})
```

Run tests:
```bash
cd frontend
npm test
```

---

## 📦 Building for Production

### Backend
```bash
cd backend

# Install production dependencies only
npm ci --production

# Or with Docker
docker build -t education-backend .
```

### Frontend
```bash
cd frontend

# Build static files
npm run build

# Output in dist/
ls -la dist/

# Preview
npm run preview
```

### Full Stack
```bash
# Build all with Docker Compose
docker-compose build

# Run production mode
docker-compose up -d
```

---

## 🔍 Monitoring & Logs

### View logs in real-time
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo-primary

# Last 100 lines
docker-compose logs --tail=100 backend

# Since 1 hour ago
docker-compose logs --since 1h backend
```

### Check service health
```bash
# Container status
docker-compose ps

# Resource usage
docker stats

# MongoDB health
docker exec -it mongo_primary mongosh --eval "db.serverStatus()" -u admin -p admin123

# Backend health
curl http://localhost:5000

# Frontend health
curl http://localhost:3000
```

---

## 🚀 Hot Reload

### Backend (Nodemon)
Already configured in `package.json`:
- Auto-restart on `.js` file changes
- Watches `src/` directory

### Frontend (Vite)
Already configured:
- Hot Module Replacement (HMR)
- Instant updates on save

### Docker Development
Update `docker-compose.yml` with volumes:
```yaml
services:
  backend:
    volumes:
      - ./backend:/app
      - /app/node_modules  # Prevent override
```

Now code changes reflect immediately!

---

## 💡 Tips & Tricks

### 1. Speed up npm install
```bash
# Use npm ci (faster)
npm ci

# Or use pnpm (faster package manager)
npm install -g pnpm
pnpm install
```

### 2. Clear Docker cache
```bash
# Remove all containers
docker-compose down

# Remove volumes too
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache
```

### 3. Database seeding
Create `backend/src/seed.js`:
```javascript
// Sample data seeding script
```

Run:
```bash
node backend/src/seed.js
```

### 4. VS Code Extensions
Recommended:
- ESLint
- Prettier
- MongoDB for VS Code
- Docker
- GitLens
- Thunder Client (API testing)

### 5. Git workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Work on feature
git add .
git commit -m "Add new feature"

# Merge to main
git checkout main
git merge feature/new-feature
```

---

## 🆘 Common Issues

### Port already in use
```bash
# Find process
lsof -i :3000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### MongoDB connection failed
```bash
# Check if containers running
docker-compose ps

# Restart MongoDB
docker-compose restart mongo-primary

# Re-init replica set
docker exec -it mongo_primary bash /scripts/init-replica.sh
```

### npm install fails
```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Docker out of space
```bash
# Clean up
docker system prune -a

# Remove volumes
docker volume prune
```

---

Happy Coding! 🚀
