import React from 'react';

const CourseCard = ({ course }) => {
  const { title, progress, totalLessons, completedLessons, nextLesson } = course;

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      
      <div className="progress-bar mb-4">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        <p>Progress: {progress}%</p>
        <p>Lessons Completed: {completedLessons}/{totalLessons}</p>
      </div>
      
      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700">Next Lesson:</p>
        <p className="text-indigo-600">{nextLesson}</p>
      </div>
      
      <button className="btn-primary w-full mt-4">
        Continue Learning
      </button>
    </div>
  );
};

export default CourseCard;
