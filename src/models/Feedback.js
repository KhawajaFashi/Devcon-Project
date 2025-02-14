import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comments: {
    type: String,
    required: true
  },
  timestampedComments: [{
    displayTime: String,
    comment: String
  }],
  metrics: {
    pitchAccuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    rhythm: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    breathing: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    expression: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index for lessonId and studentId to ensure uniqueness
feedbackSchema.index({ lessonId: 1, studentId: 1 }, { unique: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
