import mongoose from 'mongoose';

const completedLessonSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index for uniqueness
completedLessonSchema.index(
  { userId: 1, courseId: 1, lessonId: 1 },
  { unique: true }
);

const CompletedLesson = mongoose.model('CompletedLesson', completedLessonSchema);

export default CompletedLesson;
