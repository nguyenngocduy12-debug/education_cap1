const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz.model');
const QuizResult = require('../models/QuizResult.model');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// @route   POST /api/quiz/create
// @desc    Create a new quiz
// @access  Private (Teacher only)
router.post('/create', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const { title, description, questions, passingScore, timeLimit } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title and questions are required'
      });
    }

    const quiz = await Quiz.create({
      title,
      description,
      questions,
      passingScore: passingScore || 3,
      totalPoints: questions.length,
      timeLimit,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/quiz
// @desc    Get all quizzes
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true })
      .select('-questions.correctAnswer -questions.explanation')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/quiz/:id
// @desc    Get quiz by ID (without answers)
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select('-questions.correctAnswer -questions.explanation')
      .populate('createdBy', 'name email');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/quiz/submit
// @desc    Submit quiz answers
// @access  Private
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Calculate score
    let score = 0;
    const userAnswers = [];
    const wrongAnswers = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      const isCorrect = userAnswer && userAnswer.selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        score++;
      } else {
        wrongAnswers.push({
          questionId: question._id,
          question: question.question,
          selectedAnswer: userAnswer?.selectedAnswer,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation
        });
      }

      userAnswers.push({
        questionId: question._id,
        selectedAnswer: userAnswer?.selectedAnswer,
        isCorrect
      });
    });

    // Save result
    const result = await QuizResult.create({
      userId: req.user._id,
      quizId,
      score,
      totalQuestions: quiz.questions.length,
      answers: userAnswers,
      wrongAnswers,
      timeTaken
    });

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        score,
        totalQuestions: quiz.questions.length,
        passed: score > quiz.passingScore,
        allowRetest: result.allowRetest,
        wrongAnswers: result.wrongAnswers,
        resultId: result._id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/quiz/review-wrong/:resultId
// @desc    Get wrong answers for review
// @access  Private
router.get('/review-wrong/:resultId', authMiddleware, async (req, res) => {
  try {
    const result = await QuizResult.findById(req.params.resultId)
      .populate('quizId', 'title');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    // Check ownership
    if (result.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      data: {
        quizTitle: result.quizId.title,
        score: result.score,
        totalQuestions: result.totalQuestions,
        wrongAnswers: result.wrongAnswers,
        allowRetest: result.allowRetest
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/quiz/retest
// @desc    Retake quiz (only wrong questions, not counted)
// @access  Private
router.post('/retest', authMiddleware, async (req, res) => {
  try {
    const { originalResultId, answers } = req.body;

    const originalResult = await QuizResult.findById(originalResultId)
      .populate('quizId');

    if (!originalResult) {
      return res.status(404).json({
        success: false,
        message: 'Original result not found'
      });
    }

    if (!originalResult.allowRetest) {
      return res.status(403).json({
        success: false,
        message: 'Retest not allowed for this quiz'
      });
    }

    // Check ownership
    if (originalResult.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Calculate retest score
    let retestScore = 0;
    const retestAnswers = [];

    originalResult.wrongAnswers.forEach((wrongAnswer) => {
      const userAnswer = answers.find(a => a.questionId === wrongAnswer.questionId.toString());
      const isCorrect = userAnswer && userAnswer.selectedAnswer === wrongAnswer.correctAnswer;

      if (isCorrect) {
        retestScore++;
      }

      retestAnswers.push({
        questionId: wrongAnswer.questionId,
        selectedAnswer: userAnswer?.selectedAnswer,
        isCorrect
      });
    });

    // Save retest result (not counted)
    const retestResult = await QuizResult.create({
      userId: req.user._id,
      quizId: originalResult.quizId._id,
      score: retestScore,
      totalQuestions: originalResult.wrongAnswers.length,
      answers: retestAnswers,
      wrongAnswers: [],
      allowRetest: false,
      isRetest: true,
      originalResultId: originalResult._id
    });

    res.json({
      success: true,
      message: 'Retest completed (not counted towards grade)',
      data: {
        score: retestScore,
        totalQuestions: originalResult.wrongAnswers.length,
        improvement: retestScore,
        resultId: retestResult._id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
