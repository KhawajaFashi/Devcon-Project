import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseBrowser = ({ userRole, userId, onEnroll }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Only fetch user data if userId is provided
        const [coursesResponse, userResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/courses'),
          userId ? axios.get(`http://localhost:5000/api/users/${userId}`) : Promise.resolve({ data: { enrolledCourses: [] } })
        ]);

        setCourses(coursesResponse.data);
        setEnrolledCourses(userResponse.data.enrolledCourses?.map(course => course._id || course) || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleEnroll = async (courseId) => {
    try {
      setError(null);
      await axios.post(`http://localhost:5000/api/courses/${courseId}/enroll`, {
        userId
      });
      
      // Fetch updated user data to get the latest enrolled courses
      const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`);
      setEnrolledCourses(userResponse.data.enrolledCourses?.map(course => course._id || course) || []);
      
      onEnroll?.(courseId); // Notify parent component if callback exists
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError(err.response?.data?.message || 'Error enrolling in course');
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

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
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledCourses.includes(course._id);
          return (
            <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
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
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {course.lessons?.length || 0} Lessons
                  </div>
                  
                  {userRole === 'student' && (
                    isEnrolled ? (
                      <span className="text-green-600 font-medium">Enrolled</span>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Enroll Now
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseBrowser;
