import React, { useState } from 'react';

const CourseBrowser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const availableCourses = [
    {
      id: 1,
      title: 'Fundamentals of Vocal Training',
      instructor: 'Sarah Johnson',
      level: 'Beginner',
      duration: '8 weeks',
      description: 'Master the basics of vocal training with professional techniques and guided exercises.',
      enrolled: false
    },
    {
      id: 2,
      title: 'Advanced Pitch Control',
      instructor: 'Michael Chen',
      level: 'Advanced',
      duration: '6 weeks',
      description: 'Take your pitch control to the next level with advanced exercises and real-time feedback.',
      enrolled: false
    },
    {
      id: 3,
      title: 'Vocal Style Development',
      instructor: 'Emma Williams',
      level: 'Intermediate',
      duration: '10 weeks',
      description: 'Develop your unique vocal style while learning various genres and techniques.',
      enrolled: false
    }
  ];

  const filteredCourses = availableCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Available Courses</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search courses..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {course.level}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{course.description}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{course.instructor}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{course.duration}</span>
            </div>

            <button className="btn-primary w-full">
              Enroll Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseBrowser;
