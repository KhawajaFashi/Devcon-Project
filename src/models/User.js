import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  profileDetails: {
    avatar: String,
    bio: String,
    phoneNumber: String,
    location: String,
    socialLinks: {
      website: String,
      youtube: String,
      linkedin: String
    },
    expertise: [String], // For instructors
    interests: [String], // For students
    achievements: [{
      title: String,
      date: Date,
      description: String
    }]
  },
  notificationPreferences: {
    email: {
      enrollment: { type: Boolean, default: true },
      feedback: { type: Boolean, default: true },
      certificate: { type: Boolean, default: true }
    },
    inApp: {
      enrollment: { type: Boolean, default: true },
      feedback: { type: Boolean, default: true },
      certificate: { type: Boolean, default: true }
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'profileDetails.expertise': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;