const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['teacher', 'student'],
    default: 'student'
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  bannedUntil: {
    type: Date,
    default: null
  },
  violationCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user is currently banned
userSchema.methods.isCurrentlyBanned = function() {
  if (!this.isBanned) return false;
  if (!this.bannedUntil) return this.isBanned;
  
  if (new Date() > this.bannedUntil) {
    this.isBanned = false;
    this.bannedUntil = null;
    this.save();
    return false;
  }
  
  return true;
};

module.exports = mongoose.model('User', userSchema);
