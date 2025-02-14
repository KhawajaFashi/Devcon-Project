import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LessonViewer from './LessonViewer';

const CurrentLesson = ({ courseId, userId, userRole }) => {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchCurrentLesson = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user's progress in the course
        const progressResponse = await axios.get(
          `http://localhost:5000/api/courses/${courseId}/progress/${userId}`
        );

        const { currentLessonId, completedLessons, totalLessons } = progressResponse.data;
        setProgress((completedLessons / totalLessons) * 100);

        if (currentLessonId) {
          const lessonResponse = await axios.get(
            `http://localhost:5000/api/lessons/${currentLessonId}`
          );
          setCurrentLesson(lessonResponse.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching current lesson:', err);
        setError(err.response?.data?.message || 'Error fetching current lesson');
        setLoading(false);
      }
    };

    if (courseId && userId) {
      fetchCurrentLesson();
    }
  }, [courseId, userId]);

  const handleLessonComplete = async () => {
    try {
      setError(null);
      await axios.post(`http://localhost:5000/api/courses/${courseId}/lessons/${currentLesson._id}/complete`, {
        userId
      });

      // Fetch next lesson
      const nextLessonResponse = await axios.get(
        `http://localhost:5000/api/courses/${courseId}/lessons/${currentLesson._id}/next`
      );

      if (nextLessonResponse.data) {
        setCurrentLesson(nextLessonResponse.data);
      } else {
        // Course completed
        setCurrentLesson(null);
      }

      // Update progress
      const progressResponse = await axios.get(
        `http://localhost:5000/api/courses/${courseId}/progress/${userId}`
      );
      const { completedLessons, totalLessons } = progressResponse.data;
      setProgress((completedLessons / totalLessons) * 100);
    } catch (err) {
      console.error('Error completing lesson:', err);
      setError(err.response?.data?.message || 'Error completing lesson');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {progress === 100 ? 'Course Completed!' : 'No Lesson Available'}
        </h2>
        <p className="text-gray-600">
          {progress === 100 
            ? 'Congratulations! You have completed all lessons in this course.'
            : 'There are no lessons available in this course yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{currentLesson.title}</h2>
          <div className="text-sm text-gray-500">
            Progress: {Math.round(progress)}%
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <LessonViewer
        lessonId={currentLesson._id}
        courseId={courseId}
        userRole={userRole}
        userId={userId}
      />

      {userRole === 'student' && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleLessonComplete}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Complete & Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default CurrentLesson;
