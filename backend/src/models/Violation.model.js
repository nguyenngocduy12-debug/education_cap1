const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  liveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LiveStream',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  detectedWords: [{
    type: String
  }],
  violationType: {
    type: String,
    enum: ['profanity', 'spam', 'harassment', 'other'],
    default: 'profanity'
  },
  action: {
    type: String,
    enum: ['warning', 'banned'],
    default: 'warning'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for fast queries
violationSchema.index({ userId: 1, liveId: 1, timestamp: -1 });
violationSchema.index({ liveId: 1, timestamp: -1 });

module.exports = mongoose.model('Violation', violationSchema);
