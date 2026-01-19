require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIO = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth.routes');
const slideRoutes = require('./routes/slide.routes');
const quizRoutes = require('./routes/quiz.routes');
const liveRoutes = require('./routes/live.routes');

// Import socket handlers
const socketHandler = require('./websocket/socket.handler');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  readPreference: 'primaryPreferred', // Read from primary, fallback to secondary
})
.then(() => {
  console.log('✅ MongoDB Replica Set connected successfully');
  
  // Check replica set status
  const admin = mongoose.connection.db.admin();
  admin.command({ replSetGetStatus: 1 })
    .then(status => {
      console.log('📊 Replica Set Members:');
      status.members.forEach(member => {
        console.log(`   - ${member.name}: ${member.stateStr}`);
      });
    })
    .catch(err => console.log('⚠️  Not a replica set or error:', err.message));
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: '🎓 Education Online Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      slides: '/api/slides',
      quiz: '/api/quiz',
      live: '/api/live'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/slides', slideRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/live', liveRoutes);

// WebSocket handling
socketHandler(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
});

module.exports = { app, server, io };
