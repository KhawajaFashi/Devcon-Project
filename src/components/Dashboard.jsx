import React from 'react';
import CourseCard from './CourseCard';
import ProgressTracker from './ProgressTracker';

const Dashboard = () => {
  const enrolledCourses = [
    {
      id: 1,
      title: 'Fundamentals of Vocal Training',
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      nextLesson: 'Breath Control Techniques'
    },
    {
      id: 2,
      title: 'Advanced Pitch Control',
      progress: 30,
      totalLessons: 8,
      completedLessons: 2,
      nextLesson: 'Pitch Matching Exercise'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Learning Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
          <ProgressTracker
            totalCourses={enrolledCourses.length}
            averageProgress={
              enrolledCourses.reduce((acc, course) => acc + course.progress, 0) / enrolledCourses.length
            }
          />
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">{enrolledCourses.length}</p>
              <p className="text-gray-600">Active Courses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">
                {enrolledCourses.reduce((acc, course) => acc + course.completedLessons, 0)}
              </p>
              <p className="text-gray-600">Lessons Completed</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Enrolled Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;