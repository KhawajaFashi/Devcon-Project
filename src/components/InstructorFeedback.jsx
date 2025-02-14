import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InstructorFeedback = ({ courseId, lessonId, studentId }) => {
  const [feedback, setFeedback] = useState({
    rating: 5,
    comments: '',
    timestampedComments: [],
    metrics: {
      pitchAccuracy: 0,
      rhythm: 0,
      breathing: 0,
      expression: 0
    }
  });
  const [currentTimestamp, setCurrentTimestamp] = useState('');
  const [currentComment, setCurrentComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleMetricChange = (metric, value) => {
    setFeedback(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [metric]: value
      }
    }));
  };

  const addTimestampedComment = () => {
    if (currentTimestamp && currentComment) {
      setFeedback(prev => ({
        ...prev,
        timestampedComments: [
          ...prev.timestampedComments,
          { displayTime: currentTimestamp, comment: currentComment }
        ]
      }));
      setCurrentTimestamp('');
      setCurrentComment('');
    }
  };

  const removeTimestampedComment = (index) => {
    setFeedback(prev => ({
      ...prev,
      timestampedComments: prev.timestampedComments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post(`http://localhost:5000/api/lessons/${lessonId}/feedback`, {
        ...feedback,
        courseId,
        studentId
      });
      setSuccess(true);
      // Reset form
      setFeedback({
        rating: 5,
        comments: '',
        timestampedComments: [],
        metrics: {
          pitchAccuracy: 0,
          rhythm: 0,
          breathing: 0,
          expression: 0
        }
      });
    } catch (err) {
      setError('Error submitting feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Provide Feedback</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
          Feedback submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                className={`text-2xl ${
                  star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Performance Metrics
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(feedback.metrics).map(([metric, value]) => (
              <div key={metric}>
                <label className="block text-sm text-gray-600 mb-1 capitalize">
                  {metric.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => handleMetricChange(metric, parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            General Comments
          </label>
          <textarea
            value={feedback.comments}
            onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Timestamped Comments
          </label>
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              placeholder="Time (e.g., 2:30)"
              value={currentTimestamp}
              onChange={(e) => setCurrentTimestamp(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Comment"
              value={currentComment}
              onChange={(e) => setCurrentComment(e.target.value)}
              className="flex-2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addTimestampedComment}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          
          <div className="space-y-2">
            {feedback.timestampedComments.map((comment, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <span className="font-medium">{comment.displayTime}</span>
                  <span className="mx-2">-</span>
                  <span>{comment.comment}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeTimestampedComment(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default InstructorFeedback;
