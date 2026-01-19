const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  language: {
    type: String,
    default: 'vi'
  },
  slides: [{
    order: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    bulletPoints: [String],
    imageUrl: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  aiModel: {
    type: String,
    default: 'gpt-3.5-turbo'
  },
  metadata: {
    generationTime: Number,
    tokensUsed: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
slideSchema.index({ createdBy: 1, createdAt: -1 });
slideSchema.index({ topic: 1 });

module.exports = mongoose.model('Slide', slideSchema);
