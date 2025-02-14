import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/vocalmaster', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      _id: '65ccf2c7a86b3ddd2f144f3e', // This matches the ID in App.jsx
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'student'
    });

    // Create an instructor
    const instructor = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      role: 'instructor'
    });

    // Create a course first
    const course = await Course.create({
      title: 'Vocal Mastery 101',
      description: 'A comprehensive course on vocal techniques',
      instructorId: instructor._id,
      category: 'Vocal Training',
      level: 'beginner',
      duration: 120,
      price: {
        amount: 99.99,
        currency: 'USD'
      },
      thumbnail: 'https://example.com/course-thumbnail.jpg',
      requirements: ['No prior experience needed', 'Basic music knowledge helpful'],
      objectives: [
        'Understand proper breathing techniques',
        'Master pitch control',
        'Develop vocal range'
      ],
      lessons: [], // We'll update this after creating lessons
      status: 'published',
      rating: 0,
      enrollmentCount: 0
    });

    // Create lessons with courseId
    const lesson1 = await Lesson.create({
      title: 'Introduction to Vocal Techniques',
      description: 'Learn the basics of proper vocal techniques',
      courseId: course._id,
      content: {
        type: 'video',
        video: {
          url: 'https://example.com/intro-video.mp4',
          duration: 600,
          thumbnailUrl: 'https://example.com/thumbnail.jpg'
        },
        text: {
          content: 'Welcome to the introduction to vocal techniques...'
        }
      },
      moduleId: 'module1',
      order: 1,
      duration: 30
    });

    const lesson2 = await Lesson.create({
      title: 'Breath Control Basics',
      description: 'Master the fundamentals of breath control',
      courseId: course._id,
      content: {
        type: 'mixed',
        video: {
          url: 'https://example.com/breath-control.mp4',
          duration: 900,
          thumbnailUrl: 'https://example.com/thumbnail2.jpg'
        },
        audio: {
          url: 'https://example.com/breathing-exercise.mp3',
          duration: 300
        },
        text: {
          content: 'In this lesson, we will learn about proper breathing techniques...'
        }
      },
      moduleId: 'module1',
      order: 2,
      duration: 45
    });

    // Update course with lesson IDs
    course.lessons = [lesson1._id, lesson2._id];
    await course.save();

    // Enroll the user in the course
    user.enrolledCourses = [course._id];
    await user.save();

    // Add enrolled student to course
    course.enrolledStudents.push({
      studentId: user._id,
      enrollmentDate: new Date()
    });
    await course.save();

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
