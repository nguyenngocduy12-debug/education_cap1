const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedAnswer: {
      type: Number,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  wrongAnswers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    question: String,
    selectedAnswer: Number,
    correctAnswer: Number,
    explanation: String
  }],
  allowRetest: {
    type: Boolean,
    default: false
  },
  isRetest: {
    type: Boolean,
    default: false
  },
  originalResultId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuizResult'
  },
  timeTaken: {
    type: Number // in seconds
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Automatically set allowRetest if score <= passing score
quizResultSchema.pre('save', async function(next) {
  if (this.isNew && !this.isRetest) {
    const Quiz = mongoose.model('Quiz');
    const quiz = await Quiz.findById(this.quizId);
    
    if (quiz && this.score <= quiz.passingScore) {
      this.allowRetest = true;
    }
  }
  next();
});

// Index
quizResultSchema.index({ userId: 1, quizId: 1, completedAt: -1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);
