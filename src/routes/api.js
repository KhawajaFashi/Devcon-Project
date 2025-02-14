import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Certificate from '../models/Certificate.js';
import Feedback from '../models/Feedback.js';
import CompletedLesson from '../models/CompletedLesson.js';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID with populated enrolled courses
router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(userId)
      .populate({
        path: 'enrolledCourses',
        populate: {
          path: 'lessons',
          model: 'Lesson'
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new course
router.post('/courses', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructorId', '-password')  // Exclude instructor's password
      .populate('lessons');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enroll in a course
router.post('/courses/:courseId/enroll', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.body;

    if (!isValidObjectId(courseId) || !isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid course ID or user ID format' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already enrolled
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'User already enrolled in this course' });
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push(courseId);
    await user.save();

    // Add user to course's enrolled students
    course.enrolledStudents.push(userId);
    await course.save();

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lesson feedback endpoints
router.post('/lessons/:lessonId/feedback', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { courseId, studentId, rating, comments, timestampedComments, metrics } = req.body;

    if (!isValidObjectId(lessonId) || !isValidObjectId(courseId) || !isValidObjectId(studentId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const feedback = new Feedback({
      lessonId,
      courseId,
      studentId,
      rating,
      comments,
      timestampedComments,
      metrics,
      timestamp: new Date()
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/lessons/:lessonId/feedback/:studentId', async (req, res) => {
  try {
    const { lessonId, studentId } = req.params;

    if (!isValidObjectId(lessonId) || !isValidObjectId(studentId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const feedback = await Feedback.findOne({ lessonId, studentId });
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json(feedback);
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get course progress
router.get('/courses/:courseId/progress/:userId', async (req, res) => {
  try {
    const { courseId, userId } = req.params;

    if (!isValidObjectId(courseId) || !isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid course ID or user ID format' });
    }

    // Get course and user
    const [course, user] = await Promise.all([
      Course.findById(courseId).populate('lessons'),
      User.findById(userId)
    ]);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is enrolled
    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({ message: 'User is not enrolled in this course' });
    }

    // Get completed lessons for this course
    const completedLessons = await CompletedLesson.find({
      userId,
      courseId
    });

    // Get current lesson (first incomplete lesson)
    const lessonIds = course.lessons.map(lesson => lesson._id.toString());
    const completedLessonIds = completedLessons.map(cl => cl.lessonId.toString());
    const currentLessonId = lessonIds.find(id => !completedLessonIds.includes(id)) || lessonIds[0];

    // Calculate progress
    const progress = course.lessons.length > 0
      ? (completedLessons.length / course.lessons.length) * 100
      : 0;

    res.json({
      courseId,
      userId,
      completedLessons: completedLessons.length,
      totalLessons: course.lessons.length,
      currentLessonId,
      progress,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error getting course progress:', error);
    res.status(500).json({ message: error.message });
  }
});

// Mark lesson as complete
router.post('/courses/:courseId/lessons/:lessonId/complete', async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { userId } = req.body;

    if (!isValidObjectId(courseId) || !isValidObjectId(lessonId) || !isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Verify course, lesson, and user exist
    const [course, lesson, user] = await Promise.all([
      Course.findById(courseId),
      Lesson.findById(lessonId),
      User.findById(userId)
    ]);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is enrolled
    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({ message: 'User is not enrolled in this course' });
    }

    // Mark lesson as complete
    const completedLesson = new CompletedLesson({
      userId,
      courseId,
      lessonId,
      completedAt: new Date()
    });

    await completedLesson.save();

    // Check if course is completed
    const completedLessons = await CompletedLesson.find({ userId, courseId });
    const progress = (completedLessons.length / course.lessons.length) * 100;

    if (progress === 100) {
      // Generate certificate
      const certificate = new Certificate({
        userId,
        courseId,
        issueDate: new Date(),
        certificateNumber: `CERT-${Date.now()}-${userId.substr(-4)}`
      });

      await certificate.save();
    }

    res.json({ message: 'Lesson marked as complete' });
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get next lesson
router.get('/courses/:courseId/lessons/:lessonId/next', async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    if (!isValidObjectId(courseId) || !isValidObjectId(lessonId)) {
      return res.status(400).json({ message: 'Invalid course ID or lesson ID format' });
    }

    const course = await Course.findById(courseId).populate('lessons');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const currentIndex = course.lessons.findIndex(
      lesson => lesson._id.toString() === lessonId
    );

    if (currentIndex === -1) {
      return res.status(404).json({ message: 'Current lesson not found in course' });
    }

    // Get next lesson
    const nextLesson = course.lessons[currentIndex + 1] || null;

    res.json(nextLesson);
  } catch (error) {
    console.error('Error getting next lesson:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get lessons for a course
router.get('/courses/:courseId/lessons', async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!isValidObjectId(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    const course = await Course.findById(courseId).populate('lessons');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course.lessons);
  } catch (error) {
    console.error('Error getting lessons:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single lesson
router.get('/lessons/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;

    if (!isValidObjectId(lessonId)) {
      return res.status(400).json({ message: 'Invalid lesson ID format' });
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    console.error('Error getting lesson:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new lesson
router.post('/courses/:courseId/lessons', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, content, duration, moduleId, order } = req.body;

    if (!isValidObjectId(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const lesson = new Lesson({
      title,
      description,
      content,
      duration,
      moduleId,
      order: order || course.lessons.length
    });

    await lesson.save();

    // Add lesson to course
    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json(lesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update a lesson
router.put('/lessons/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const updates = req.body;

    if (!isValidObjectId(lessonId)) {
      return res.status(400).json({ message: 'Invalid lesson ID format' });
    }

    const lesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { $set: updates },
      { new: true }
    );

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a lesson
router.delete('/lessons/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;

    if (!isValidObjectId(lessonId)) {
      return res.status(400).json({ message: 'Invalid lesson ID format' });
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Remove lesson from course
    await Course.updateMany(
      { lessons: lessonId },
      { $pull: { lessons: lessonId } }
    );

    // Delete lesson
    await Lesson.findByIdAndDelete(lessonId);

    // Delete completed lessons
    await CompletedLesson.deleteMany({ lessonId });

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get lesson feedback
router.get('/lessons/:lessonId/feedback/:userId', async (req, res) => {
  try {
    const { lessonId, userId } = req.params;

    if (!isValidObjectId(lessonId) || !isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const feedback = await Feedback.findOne({ lessonId, userId });

    res.json(feedback);
  } catch (error) {
    console.error('Error getting feedback:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
