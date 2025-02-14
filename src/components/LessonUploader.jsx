import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LessonUploader = ({ courseId, onLessonUploaded, onCancel, existingLesson }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState({
    type: 'video',
    url: '',
    description: ''
  });
  const [duration, setDuration] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [order, setOrder] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (existingLesson) {
      setTitle(existingLesson.title);
      setDescription(existingLesson.description);
      setContent(existingLesson.content || { type: 'video', url: '', description: '' });
      setDuration(existingLesson.duration?.toString() || '');
      setModuleId(existingLesson.moduleId || '');
      setOrder(existingLesson.order?.toString() || '');
    }
  }, [existingLesson]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const lessonData = {
      title,
      description,
      content,
      duration: parseInt(duration) || 0,
      moduleId: moduleId || undefined,
      order: parseInt(order) || undefined
    };

    try {
      let response;
      if (existingLesson) {
        response = await axios.put(
          `http://localhost:5000/api/lessons/${existingLesson._id}`,
          lessonData
        );
      } else {
        response = await axios.post(
          `http://localhost:5000/api/courses/${courseId}/lessons`,
          lessonData
        );
      }

      onLessonUploaded(response.data);
      resetForm();
    } catch (err) {
      console.error('Error saving lesson:', err);
      setError(err.response?.data?.message || 'Error saving lesson');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setContent({ type: 'video', url: '', description: '' });
    setDuration('');
    setModuleId('');
    setOrder('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {existingLesson ? 'Edit Lesson' : 'Upload New Lesson'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lesson Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Type
          </label>
          <select
            value={content.type}
            onChange={(e) => setContent({ ...content, type: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          >
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="document">Document</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content URL
          </label>
          <input
            type="url"
            value={content.url}
            onChange={(e) => setContent({ ...content, url: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Description
          </label>
          <textarea
            value={content.description}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            rows="3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Module ID (optional)
          </label>
          <input
            type="text"
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order (optional)
          </label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            min="0"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Saving...' : existingLesson ? 'Update Lesson' : 'Create Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LessonUploader;
