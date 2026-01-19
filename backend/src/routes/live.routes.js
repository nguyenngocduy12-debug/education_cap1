const express = require('express');
const router = express.Router();
const LiveStream = require('../models/LiveStream.model');
const Violation = require('../models/Violation.model');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// @route   POST /api/live/create
// @desc    Create a new livestream
// @access  Private (Teacher only)
router.post('/create', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const { title, description, scheduledTime } = req.body;

    if (!title || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Title and scheduledTime are required'
      });
    }

    const liveStream = await LiveStream.create({
      title,
      description,
      teacherId: req.user._id,
      scheduledTime
    });

    res.status(201).json({
      success: true,
      message: 'Livestream created successfully',
      data: liveStream
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/live/:id/start
// @desc    Start livestream
// @access  Private (Teacher/Owner only)
router.post('/:id/start', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const liveStream = await LiveStream.findById(req.params.id);

    if (!liveStream) {
      return res.status(404).json({
        success: false,
        message: 'Livestream not found'
      });
    }

    // Check ownership
    if (liveStream.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    liveStream.status = 'live';
    liveStream.startTime = new Date();
    await liveStream.save();

    res.json({
      success: true,
      message: 'Livestream started',
      data: liveStream
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/live/:id/end
// @desc    End livestream
// @access  Private (Teacher/Owner only)
router.post('/:id/end', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const liveStream = await LiveStream.findById(req.params.id);

    if (!liveStream) {
      return res.status(404).json({
        success: false,
        message: 'Livestream not found'
      });
    }

    // Check ownership
    if (liveStream.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    liveStream.status = 'ended';
    liveStream.endTime = new Date();
    await liveStream.save();

    res.json({
      success: true,
      message: 'Livestream ended',
      data: liveStream
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/live
// @desc    Get all livestreams
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const liveStreams = await LiveStream.find(query)
      .populate('teacherId', 'name email')
      .sort({ scheduledTime: -1 });

    res.json({
      success: true,
      count: liveStreams.length,
      data: liveStreams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/live/:id
// @desc    Get livestream by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const liveStream = await LiveStream.findById(req.params.id)
      .populate('teacherId', 'name email');

    if (!liveStream) {
      return res.status(404).json({
        success: false,
        message: 'Livestream not found'
      });
    }

    res.json({
      success: true,
      data: liveStream
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/live/:id/violations
// @desc    Get violations for a livestream
// @access  Private (Teacher only)
router.get('/:id/violations', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const violations = await Violation.find({ liveId: req.params.id })
      .populate('userId', 'name email')
      .sort({ timestamp: -1 });

    res.json({
      success: true,
      count: violations.length,
      data: violations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
