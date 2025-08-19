import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { 
  FaUpload, 
  FaCog, 
  FaArrowLeft,
  FaFileUpload,
  FaYoutube
} from 'react-icons/fa';
import ContentManager from '../components/ContentManager';

export default function AdminPanel() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadType, setUploadType] = useState<'file' | 'video'>('file');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    branch: '',
    semester: '',
    subject: '',
    contentType: 'notes' as 'notes' | 'pyq' | 'ebook' | 'formulas' | 'timetable' | 'assignments' | 'events' | 'video',
    files: [] as File[],
    videoTitle: '',
    videoUrl: ''
  });

  // Subject data structure
  const subjects = {
    'cse': {
      '1': ['Chemistry', 'English', 'Programming for Power Solving', 'Mathematics-1(Calculus,Linear Algebra)', 'English'],
      '2': ['Physics', 'Basic Electrical Engineering', 'Mathematics-2(Probability and Statistics)', 'Engineering Drawing'],
      '3': ['Mathematics-3(Calculus and Ordinary Differential Equation)', 'Computer Peripherals and Interfaces', 'Data Structure and Algorithms', 'Digital Electronics', 'Development of Societies'],
      '4': ['Mathematics-4(Discrete Mathematics)', 'Computer Organization and Architecture', 'Operating Systems', 'Object Oriented Programming', 'Organizational Behaviour', 'Universal Humanvalues-2'],
      '5': ['Compiler Design', 'Database Management System', 'Formal Language and Automata Theory', 'Design and Analysis of Algorithms'],
      '6': ['Software Engineering', 'Computer Networks']
    },
    'cse-aiml': {
      '1': ['Chemistry', 'English', 'Programming for Power Solving', 'Mathematics-1(Calculus,Linear Algebra)', 'English'],
      '2': ['Physics', 'Basic Electrical Engineering', 'Mathematics-2(Probability and Statistics)', 'Engineering Drawing'],
      '3': ['Mathematics-3(Calculus and Ordinary Differential Equation)', 'Computer Peripherals and Interfaces', 'Data Structure and Algorithms', 'Digital Electronics', 'Development of Societies'],
      '4': ['Mathematics-4(Discrete Mathematics)', 'Computer Organization and Architecture', 'Operating Systems', 'Object Oriented Programming', 'Organizational Behaviour', 'Universal Humanvalues-2'],
      '5': ['Compiler Design', 'Database Management System', 'Formal Language and Automata Theory', 'Design and Analysis of Algorithms'],
      '6': ['Software Engineering', 'Computer Networks']
    }
  };

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.user && data.user.isAdmin) {
          setIsAuthenticated(true);
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset subject when branch or semester changes
    if (name === 'branch' || name === 'semester') {
      setFormData(prev => ({
        ...prev,
        subject: ''
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (selected.length > 0) {
      setFormData(prev => ({
        ...prev,
        files: selected
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      if (uploadType === 'file') {
        if (!formData.files || formData.files.length === 0) {
          alert('Please select at least one file');
          return;
        }
        
        const formDataToSend = new FormData();
        formDataToSend.append('branch', formData.branch);
        formDataToSend.append('semester', formData.semester);
        formDataToSend.append('subject', formData.subject);
        formDataToSend.append('contentType', formData.contentType);
        for (const f of formData.files) {
          formDataToSend.append('file', f);
        }
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataToSend,
        });
        
        const data = await response.json();
        
        if (response.ok) {
          alert('Upload completed.');
          setFormData({ branch: '', semester: '', subject: '', contentType: 'notes', files: [], videoTitle: '', videoUrl: '' });
        } else {
          alert(`Upload failed: ${data.error}`);
        }
      } else {
        // YouTube video upload
        if (!formData.videoTitle || !formData.videoUrl) {
          alert('Please fill in all fields');
          return;
        }
        
        const response = await fetch('/api/upload-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            branch: formData.branch,
            semester: formData.semester,
            subject: formData.subject,
            videoTitle: formData.videoTitle,
            videoUrl: formData.videoUrl
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          alert('Video uploaded successfully!');
          setFormData({ branch: '', semester: '', subject: '', contentType: 'notes', files: [], videoTitle: '', videoUrl: '' });
        } else {
          alert(`Upload failed: ${data.error}`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    
    // Add smooth scroll animation to the content area
    const contentArea = document.getElementById('admin-content');
    if (contentArea) {
      contentArea.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a23] to-[#23234b] flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Admin Panel - Brainstack Education</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a23] to-[#23234b] flex">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-[#181828] to-[#23234b] shadow-lg border-r border-blue-900/30">
          <div className="p-6">
            <Link href="/" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8">
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Link>
            
            <h1 className="text-2xl font-bold text-white mb-8">Admin Panel</h1>
            
            <nav className="space-y-2">
              <button
                onClick={() => handleTabClick('upload')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'upload' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-[#181828] hover:text-white'
                }`}
              >
                <FaUpload className="mr-3" />
                Upload Content
              </button>
              
              <button
                onClick={() => handleTabClick('manage')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'manage' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-[#181828] hover:text-white'
                }`}
              >
                <FaCog className="mr-3" />
                Manage Content
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div id="admin-content" className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'upload' && (
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-bold text-white mb-8">Upload New Content</h2>
              
              {/* Upload Type Selection */}
              <div className="mb-8">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setUploadType('file')}
                    className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                      uploadType === 'file'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-[#181828] text-gray-300 hover:bg-[#23234b] hover:text-white'
                    }`}
                  >
                    <FaFileUpload className="mr-2" />
                    File Upload
                  </button>
                  
                  <button
                    onClick={() => setUploadType('video')}
                    className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                      uploadType === 'video'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-[#181828] text-gray-300 hover:bg-[#23234b] hover:text-white'
                    }`}
                  >
                    <FaYoutube className="mr-2" />
                    YouTube Video
                  </button>
                </div>
              </div>

              {/* Upload Form */}
              <form onSubmit={handleSubmit} className="bg-[#181828]/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 max-w-2xl border border-blue-900/30">
                <div className="space-y-6">
                  {/* Branch */}
                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-300 mb-2">
                      Branch *
                    </label>
                    <select
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#23234b] border border-blue-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Branch</option>
                      <option value="cse">CSE</option>
                      <option value="cse-aiml">CSE-AIML</option>
                    </select>
                  </div>

                  {/* Semester */}
                  <div>
                    <label htmlFor="semester" className="block text-sm font-medium text-gray-300 mb-2">
                      Semester *
                    </label>
                    <select
                      id="semester"
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#23234b] border border-blue-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Semester</option>
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                      <option value="3">Semester 3</option>
                      <option value="4">Semester 4</option>
                      <option value="5">Semester 5</option>
                      <option value="6">Semester 6</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#23234b] border border-blue-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={!formData.branch || !formData.semester}
                    >
                      <option value="">
                        {!formData.branch || !formData.semester 
                          ? 'Please select Branch and Semester first' 
                          : 'Select Subject'
                        }
                      </option>
                      {formData.branch && formData.semester && subjects[formData.branch as keyof typeof subjects]?.[formData.semester as keyof typeof subjects['cse']]?.map((subject, index) => (
                        <option key={index} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Content Type (for file uploads) */}
                  {uploadType === 'file' && (
                    <div>
                      <label htmlFor="contentType" className="block text-sm font-medium text-gray-300 mb-2">
                        Content Type *
                      </label>
                      <select
                        id="contentType"
                        name="contentType"
                        value={formData.contentType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#23234b] border border-blue-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="notes">Notes</option>
                        <option value="pyq">PYQ</option>
                        <option value="ebook">E-Books</option>
                        <option value="formulas">Formulas</option>
                        <option value="timetable">Timetable</option>
                        <option value="assignments">Assignments</option>
                        <option value="events">Events</option>
                      </select>
                    </div>
                  )}

                  {/* File Upload */}
                  {uploadType === 'file' && (
                    <div>
                      <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-2">
                        File(s) *
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          id="file"
                          name="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          required
                        />
                        <label
                          htmlFor="file"
                          className="flex items-center px-4 py-3 bg-[#23234b] border border-blue-900/50 rounded-lg cursor-pointer hover:bg-[#2a2a5a] transition-colors text-white"
                        >
                          <FaUpload className="mr-2" />
                          Choose files
                        </label>
                        {formData.files && formData.files.length > 0 && (
                          <span className="text-sm text-gray-400">
                            {formData.files.length} selected
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* YouTube Video Fields */}
                  {uploadType === 'video' && (
                    <>
                      <div>
                        <label htmlFor="videoTitle" className="block text-sm font-medium text-gray-300 mb-2">
                          Video Title *
                        </label>
                        <input
                          type="text"
                          id="videoTitle"
                          name="videoTitle"
                          value={formData.videoTitle}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#23234b] border border-blue-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter video title"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-300 mb-2">
                          YouTube URL *
                        </label>
                        <input
                          type="url"
                          id="videoUrl"
                          name="videoUrl"
                          value={formData.videoUrl}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#23234b] border border-blue-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://www.youtube.com/watch?v=..."
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
                  >
                    {uploadType === 'file' ? 'Upload File' : 'Upload Video'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-bold text-white mb-8">Manage Content</h2>
              <div className="bg-[#181828]/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-blue-900/30">
                <ContentManager />
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </>
  );
} 