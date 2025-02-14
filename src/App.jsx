import { useState } from 'react';
import Dashboard from './components/Dashboard';
import CourseBrowser from './components/CourseBrowser';
import LessonViewer from './components/LessonViewer';
import PracticeModule from './components/PracticeModule';
import LessonUploader from './components/LessonUploader';
import SingingPracticeMode from './components/SingingPracticeMode';
import InstructorFeedback from './components/InstructorFeedback';
import StudentProgress from './components/StudentProgress';
import CertificateGallery from './components/CertificateGallery';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [userRole, setUserRole] = useState('student'); // or 'instructor'

  // Sample feedback history data
  const sampleFeedbackHistory = [
    {
      timestamp: '2025-01-01T10:00:00Z',
      rating: 3,
      comments: 'Good start, but needs work on breath control.',
      timestampedComments: [
        { displayTime: '0:45', comment: 'Watch your breathing here' },
        { displayTime: '2:30', comment: 'Nice pitch control' }
      ],
      metrics: {
        pitchAccuracy: 65,
        rhythm: 70,
        breathing: 60,
        expression: 75
      }
    },
    {
      timestamp: '2025-01-15T15:30:00Z',
      rating: 4,
      comments: 'Significant improvement in breath control and pitch accuracy.',
      timestampedComments: [
        { displayTime: '1:15', comment: 'Much better breathing technique' },
        { displayTime: '3:00', comment: 'Excellent expression' }
      ],
      metrics: {
        pitchAccuracy: 80,
        rhythm: 75,
        breathing: 85,
        expression: 80
      }
    },
    {
      timestamp: '2025-02-01T14:20:00Z',
      rating: 5,
      comments: 'Outstanding progress! Your technique has really matured.',
      timestampedComments: [
        { displayTime: '0:30', comment: 'Perfect pitch control' },
        { displayTime: '2:45', comment: 'Beautiful phrasing' }
      ],
      metrics: {
        pitchAccuracy: 90,
        rhythm: 85,
        breathing: 90,
        expression: 95
      }
    }
  ];

  // Sample lesson data
  const sampleLesson = {
    title: "Breath Control Fundamentals",
    description: "Learn the basics of proper breathing techniques for singing",
    videoUrl: "https://example.com/sample-video.mp4",
    notes: `
      <h4>Key Points:</h4>
      <ul>
        <li>Understanding diaphragmatic breathing</li>
        <li>Proper posture for optimal breath support</li>
        <li>Exercises for breath control</li>
      </ul>
      
      <h4>Practice Tips:</h4>
      <p>Start with short phrases and gradually increase duration as you build strength and control.</p>
    `
  };

  // Sample practice data
  const samplePractice = {
    title: "Breath Control Practice Routine",
    description: "A structured practice routine to develop your breath control",
    steps: [
      {
        id: 1,
        title: "Diaphragmatic Breathing",
        instructions: "Place one hand on your chest and one on your abdomen. Practice breathing so that your abdomen expands while your chest remains relatively still.",
        audioExample: "https://example.com/breathing-example.mp3",
        tips: "Try lying down at first if you're having trouble feeling the movement."
      },
      {
        id: 2,
        title: "Sustained Notes",
        instructions: "Take a deep breath and sing a comfortable note, holding it as long as you can while maintaining steady pitch and volume.",
        audioExample: "https://example.com/sustained-note.mp3",
        tips: "Use a timer to track your progress. Aim to increase duration while maintaining quality."
      },
      {
        id: 3,
        title: "Breath Control Exercises",
        instructions: "Practice the 'hissing exercise' by taking a deep breath and releasing it with a consistent 'ssss' sound.",
        audioExample: "https://example.com/hissing-exercise.mp3",
        tips: "Try to make the hissing sound last for at least 20 seconds while maintaining consistent volume."
      }
    ]
  };

  // Sample reference track for singing practice
  const sampleReferenceTrack = {
    title: "Amazing Grace - Reference Performance",
    url: "https://example.com/amazing-grace-reference.mp3",
    duration: "3:45",
    key: "G Major",
    tempo: "72 BPM"
  };

  // Sample recording for feedback
  const sampleRecording = {
    url: "https://example.com/student-recording.mp3",
    duration: "3:30",
    submittedAt: "2025-02-14T12:00:00Z"
  };

  // Sample certificates data
  const sampleCertificates = [
    {
      id: 'cert-001',
      studentName: 'John Doe',
      courseTitle: 'Advanced Vocal Techniques',
      instructorName: 'Sarah Johnson',
      completionDate: '2025-01-15T10:00:00Z',
      grade: 'A'
    },
    {
      id: 'cert-002',
      studentName: 'John Doe',
      courseTitle: 'Music Theory Fundamentals',
      instructorName: 'Michael Smith',
      completionDate: '2025-02-01T15:30:00Z',
      grade: 'A-'
    },
    {
      id: 'cert-003',
      studentName: 'John Doe',
      courseTitle: 'Performance Mastery',
      instructorName: 'Emily Davis',
      completionDate: '2025-02-14T12:00:00Z',
      grade: 'A+'
    }
  ];

  const handleFeedbackSubmit = (feedback) => {
    console.log('Feedback submitted:', feedback);
    // Here you would typically send this to your backend
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'courses':
        return <CourseBrowser />;
      case 'lesson':
        return <LessonViewer lesson={sampleLesson} />;
      case 'practice':
        return <PracticeModule practice={samplePractice} />;
      case 'singing':
        return <SingingPracticeMode referenceTrack={sampleReferenceTrack} />;
      case 'feedback':
        return userRole === 'instructor' ? (
          <InstructorFeedback
            recording={sampleRecording}
            onSubmitFeedback={handleFeedbackSubmit}
          />
        ) : (
          <StudentProgress feedbackHistory={sampleFeedbackHistory} />
        );
      case 'certificates':
        return <CertificateGallery certificates={sampleCertificates} />;
      case 'upload':
        return <LessonUploader />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">VocalMaster</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'dashboard'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'courses'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Browse Courses
                </button>
                <button
                  onClick={() => setActiveTab('lesson')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'lesson'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Current Lesson
                </button>
                <button
                  onClick={() => setActiveTab('practice')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'practice'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Practice
                </button>
                <button
                  onClick={() => setActiveTab('singing')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'singing'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Singing Practice
                </button>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'feedback'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {userRole === 'instructor' ? 'Give Feedback' : 'My Progress'}
                </button>
                <button
                  onClick={() => setActiveTab('certificates')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'certificates'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Certificates
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {userRole === 'instructor' && (
                <button
                  onClick={() => setActiveTab('upload')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Upload Lesson
                </button>
              )}
              <button
                onClick={() => setUserRole(userRole === 'student' ? 'instructor' : 'student')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Switch to {userRole === 'student' ? 'Instructor' : 'Student'} View
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-6">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
