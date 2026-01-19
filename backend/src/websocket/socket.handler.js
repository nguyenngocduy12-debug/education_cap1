const User = require('../models/User.model');
const LiveStream = require('../models/LiveStream.model');
const Violation = require('../models/Violation.model');
const { checkBadWords } = require('../services/moderation.service');

/**
 * Socket.IO handler for real-time features
 */
const socketHandler = (io) => {
  // Middleware for socket authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      // Verify token and get user
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.name} (${socket.id})`);

    // Join livestream room
    socket.on('join-live', async (liveId) => {
      try {
        const liveStream = await LiveStream.findById(liveId);
        
        if (!liveStream) {
          socket.emit('error', { message: 'Livestream not found' });
          return;
        }

        // Check if user is banned
        if (socket.user.isCurrentlyBanned()) {
          socket.emit('banned', {
            message: `You are banned until ${socket.user.bannedUntil}`,
            bannedUntil: socket.user.bannedUntil
          });
          return;
        }

        // Join room
        socket.join(`live-${liveId}`);
        
        // Add participant if not already added
        const alreadyJoined = liveStream.participants.some(
          p => p.userId.toString() === socket.user._id.toString()
        );

        if (!alreadyJoined) {
          liveStream.participants.push({
            userId: socket.user._id,
            joinedAt: new Date()
          });
          await liveStream.save();
        }

        // Notify others
        socket.to(`live-${liveId}`).emit('user-joined', {
          userId: socket.user._id,
          name: socket.user.name
        });

        // Send current participants count
        const participantsCount = liveStream.participants.length;
        io.to(`live-${liveId}`).emit('participants-update', {
          count: participantsCount
        });

        console.log(`👤 ${socket.user.name} joined live-${liveId}`);
      } catch (error) {
        console.error('Join live error:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Send chat message
    socket.on('send-message', async ({ liveId, message }) => {
      try {
        // Check if user is banned
        if (socket.user.isCurrentlyBanned()) {
          socket.emit('message-blocked', {
            message: 'You are banned from chatting',
            bannedUntil: socket.user.bannedUntil
          });
          return;
        }

        const liveStream = await LiveStream.findById(liveId);
        if (!liveStream) {
          socket.emit('error', { message: 'Livestream not found' });
          return;
        }

        // Check for bad words
        const moderationResult = checkBadWords(message);

        if (moderationResult.hasBadWord && liveStream.settings.moderationEnabled) {
          // Record violation
          const violation = await Violation.create({
            userId: socket.user._id,
            liveId,
            message,
            detectedWords: moderationResult.detectedWords,
            violationType: 'profanity'
          });

          // Count violations in this live session
          const violationCount = await Violation.countDocuments({
            userId: socket.user._id,
            liveId
          });

          // Update user violation count
          socket.user.violationCount += 1;

          // Check if should ban (more than max violations)
          if (violationCount > liveStream.settings.maxViolations) {
            // Ban user for 1 hour
            const banUntil = new Date(Date.now() + 60 * 60 * 1000);
            socket.user.isBanned = true;
            socket.user.bannedUntil = banUntil;
            
            await socket.user.save();

            // Update violation record
            violation.action = 'banned';
            await violation.save();

            // Notify user
            socket.emit('user-banned', {
              message: `You have been banned for 1 hour due to ${violationCount} violations`,
              bannedUntil: banUntil,
              violations: violationCount
            });

            // Notify others
            socket.to(`live-${liveId}`).emit('user-removed', {
              userId: socket.user._id,
              name: socket.user.name,
              reason: 'Too many violations'
            });

            console.log(`🚫 ${socket.user.name} banned until ${banUntil}`);
            return;
          }

          // Just warn
          await socket.user.save();

          socket.emit('message-moderated', {
            message: 'Your message contains inappropriate content',
            detectedWords: moderationResult.detectedWords,
            violationCount,
            warning: `Warning ${violationCount}/${liveStream.settings.maxViolations}`
          });

          console.log(`⚠️  Moderation: ${socket.user.name} - Violation ${violationCount}`);
          return;
        }

        // Send message to all in room
        const messageData = {
          id: Date.now().toString(),
          userId: socket.user._id,
          userName: socket.user.name,
          userRole: socket.user.role,
          message,
          timestamp: new Date()
        };

        io.to(`live-${liveId}`).emit('new-message', messageData);

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Leave livestream
    socket.on('leave-live', async (liveId) => {
      socket.leave(`live-${liveId}`);
      
      socket.to(`live-${liveId}`).emit('user-left', {
        userId: socket.user._id,
        name: socket.user.name
      });

      console.log(`👋 ${socket.user.name} left live-${liveId}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.name} (${socket.id})`);
    });
  });
};

module.exports = socketHandler;
