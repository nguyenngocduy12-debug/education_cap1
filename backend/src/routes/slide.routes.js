const express = require('express');
const router = express.Router();
const Slide = require('../models/Slide.model');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { generateSlideWithAI } = require('../services/ai.service');

// @route   POST /api/slides/generate
// @desc    Generate slides using AI
// @access  Private (Teacher only)
router.post('/generate', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const { topic, level, numberSlide, language } = req.body;

    if (!topic || !numberSlide) {
      return res.status(400).json({
        success: false,
        message: 'Topic and numberSlide are required'
      });
    }

    // Generate slides using AI
    const startTime = Date.now();
    const aiResponse = await generateSlideWithAI({
      topic,
      level: level || 'medium',
      numberSlide,
      language: language || 'vi'
    });

    const generationTime = Date.now() - startTime;

    // Save to database
    const slide = await Slide.create({
      title: aiResponse.title || topic,
      topic,
      level: level || 'medium',
      language: language || 'vi',
      slides: aiResponse.slides,
      createdBy: req.user._id,
      aiModel: aiResponse.model || 'gpt-3.5-turbo',
      metadata: {
        generationTime,
        tokensUsed: aiResponse.tokensUsed
      }
    });

    res.status(201).json({
      success: true,
      message: 'Slides generated successfully',
      data: slide
    });
  } catch (error) {
    console.error('Slide generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate slides'
    });
  }
});

// @route   GET /api/slides
// @desc    Get all slides for current user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const slides = await Slide.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      count: slides.length,
      data: slides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/slides/:id
// @desc    Get slide by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const slide = await Slide.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Slide not found'
      });
    }

    res.json({
      success: true,
      data: slide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/slides/:id
// @desc    Delete slide
// @access  Private (Owner only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const slide = await Slide.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Slide not found'
      });
    }

    // Check ownership
    if (slide.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this slide'
      });
    }

    await slide.deleteOne();

    res.json({
      success: true,
      message: 'Slide deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
