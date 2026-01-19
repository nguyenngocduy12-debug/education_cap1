const mongoose = require('mongoose');

const liveStreamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'ended'],
    default: 'scheduled'
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  streamUrl: {
    type: String
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  settings: {
    allowChat: {
      type: Boolean,
      default: true
    },
    moderationEnabled: {
      type: Boolean,
      default: true
    },
    maxViolations: {
      type: Number,
      default: 2
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index
liveStreamSchema.index({ teacherId: 1, createdAt: -1 });
liveStreamSchema.index({ status: 1, scheduledTime: 1 });

module.exports = mongoose.model('LiveStream', liveStreamSchema);
