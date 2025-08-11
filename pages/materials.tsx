import React from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaArrowLeft, FaFileAlt, FaVideo, FaDownload, FaEye, FaPlay, FaYoutube, FaTimes, FaCalculator, FaClock, FaClipboardList, FaUsers, FaBook } from 'react-icons/fa';

interface Content {
  _id: string;
  branch: string;
  semester: string;
  subject: string;
  contentType: 'notes' | 'pyq' | 'formulas' | 'timetable' | 'assignments' | 'events' | 'video' | 'ebook';
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  videoTitle?: string;
  videoUrl?: string;
  videoId?: string;
  uploadDate: string;
}

const SEMESTERS = [
  {
    name: 'Semester 1',
    subjects: [
      'Chemistry',
      'English',
      'Programming for Power Solving',
      'Mathematics-1 (Calculus, Linear Algebra)',
    ],
  },
  {
    name: 'Semester 2',
    subjects: [
      'Physics',
      'Basic Electrical Engineering',
      'Mathematics-2 (Probability and Statistics)',
      'Engineering Drawing',
    ],
  },
  {
    name: 'Semester 3',
    subjects: [
      'Mathematics-3 (Calculus and Ordinary Differential Equation)',
      'Computer Peripherals and Interfaces',
      'Data Structure and Algorithms',
      'Digital Electronics',
      'Development of Societies',
    ],
  },
  {
    name: 'Semester 4',
    subjects: [
      'Mathematics-4 (Discrete Mathematics)',
      'Computer Organization and Architecture',
      'Operating Systems',
      'Object Oriented Programming',
      'Organizational Behaviour',
      'Universal Humanvalues-2',
    ],
  },
  {
    name: 'Semester 5',
    subjects: [
      'Compiler Design',
      'Database Management System',
      'Formal Language and Automata Theory',
      'Design and Analysis of Algorithms',
    ],
  },
  {
    name: 'Semester 6',
    subjects: [
      'Software Engineering',
      'Computer Networks',
    ],
  },
];

const TABS = [
  { label: 'Notes', value: 'notes', icon: <FaFileAlt /> },
  { label: 'PYQs', value: 'pyq', icon: <FaFileAlt /> },
  { label: 'E-Books', value: 'ebook', icon: <FaBook /> },
  { label: 'Formulas', value: 'formulas', icon: <FaCalculator /> },
  { label: 'Timetable', value: 'timetable', icon: <FaClock /> },
  { label: 'Assignments', value: 'assignments', icon: <FaClipboardList /> },
  { label: 'Events', value: 'events', icon: <FaUsers /> },
  { label: 'Video Lectures', value: 'video', icon: <FaVideo /> },
];

export default function MaterialsPage() {
  const router = useRouter();
  const { type = 'notes' } = router.query;
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'notes' | 'pyq' | 'formulas' | 'timetable' | 'assignments' | 'events' | 'video' | 'ebook'>('notes');
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  // Reset subject if semester changes
  const handleSemesterSelect = (idx: number) => {
    setSelectedSemester(idx);
    setSelectedSubject(null);
  };

  // Update active tab when type query parameter changes
  useEffect(() => {
    if (type && typeof type === 'string') {
      setActiveTab(type as 'notes' | 'pyq' | 'formulas' | 'timetable' | 'assignments' | 'events' | 'video' | 'ebook');
    }
  }, [type]);

  const fetchContent = useCallback(async () => {
    if (!selectedSubject) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/content?type=${activeTab}&subject=${encodeURIComponent(selectedSubject)}`);
      const data = await response.json();
      
      if (response.ok && data.content) {
        setContent(data.content);
      } else {
        setContent([]);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [selectedSubject, activeTab]);

  useEffect(() => {
    if (selectedSubject && activeTab) {
      fetchContent();
    }
  }, [fetchContent]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePlayVideo = (videoId: string) => {
    setPlayingVideo(videoId);
  };

  const handleCloseVideo = () => {
    setPlayingVideo(null);
  };

  // Navigation helpers
  const goBackToSemesters = () => {
    setSelectedSemester(null);
    setSelectedSubject(null);
  };
  const goBackToSubjects = () => {
    setSelectedSubject(null);
  };

  return (
    <>
      <Head>
        <title>Study Materials - Brain Stack | Notes, Formulas, Timetables & More</title>
        <meta name="description" content="Access comprehensive study materials including notes, formulas, timetables, assignments, and events for all semesters. Smart education resources for students." />
        <meta name="keywords" content="study materials, notes, formulas, timetable, assignments, events, education resources, student materials" />
        <meta name="author" content="Brain Stack" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
                 <meta property="og:url" content="https://brainstackeducation.in/materials" />
         <meta property="og:title" content="Study Materials - Brain Stack" />
         <meta property="og:description" content="Access comprehensive study materials including notes, formulas, timetables, assignments, and events for all semesters." />
         <meta property="og:image" content="https://brainstackeducation.in/bstack.png" />
         
         {/* Twitter */}
         <meta property="twitter:card" content="summary_large_image" />
         <meta property="twitter:url" content="https://brainstackeducation.in/materials" />
         <meta property="twitter:title" content="Study Materials - Brain Stack" />
         <meta property="twitter:description" content="Access comprehensive study materials including notes, formulas, timetables, assignments, and events." />
         <meta property="twitter:image" content="https://brainstackeducation.in/bstack.png" />
         
         {/* Additional SEO */}
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <link rel="canonical" href="https://brainstackeducation.in/materials" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Study Materials - Brain Stack",
              "description": "Comprehensive study materials including notes, formulas, timetables, assignments, and events",
                             "url": "https://brainstackeducation.in/materials",
               "breadcrumb": {
                 "@type": "BreadcrumbList",
                 "itemListElement": [
                   {
                     "@type": "ListItem",
                     "position": 1,
                     "name": "Home",
                     "item": "https://brainstackeducation.in/"
                   },
                   {
                     "@type": "ListItem",
                     "position": 2,
                     "name": "Study Materials",
                     "item": "https://brainstackeducation.in/materials"
                   }
                 ]
               }
            })
          }}
        />
      </Head>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-[#0a0a23] to-[#23234b] px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center gap-4">
            <button onClick={() => router.push('/')} className="flex items-center text-blue-400 hover:underline">
              <FaArrowLeft className="mr-1" /> Back to Home
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white ml-4">Study Materials</h1>
          </div>

          {/* Step 1: Select Semester */}
          {selectedSemester === null && (
            <>
              <h2 className="text-2xl font-bold text-white mb-6">Select Your Branch</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {SEMESTERS.map((sem, idx) => (
                  <button
                    key={sem.name}
                    className="bg-[#181828] border border-gray-600 rounded-xl p-8 text-left hover:border-blue-500 transition w-full"
                    onClick={() => handleSemesterSelect(idx)}
                  >
                    <div className="text-2xl font-bold text-white mb-2">{sem.name}</div>
                    <div className="text-gray-300 text-lg">{sem.subjects[0]}{sem.subjects[1] ? ' ...' : ''}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Select Subject */}
          {selectedSemester !== null && selectedSubject === null && (
            <>
              <button onClick={goBackToSemesters} className="flex items-center text-blue-400 hover:underline mb-4">
                <FaArrowLeft className="mr-1" /> Back to Branches
              </button>
              <h2 className="text-2xl font-bold text-white mb-6">
                Select Subject - <span className="text-blue-300">{SEMESTERS[selectedSemester].name.replace('Semester ', 'Semester ')}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {SEMESTERS[selectedSemester].subjects.map((subject) => (
                  <button
                    key={subject}
                    className="bg-[#181828] border border-gray-600 rounded-xl p-8 text-left hover:border-blue-500 transition w-full"
                    onClick={() => setSelectedSubject(subject)}
                  >
                    <div className="text-lg font-bold text-white mb-2">{subject}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 3: Show Tabs for PYQs, Notes, Video Lectures */}
          {selectedSemester !== null && selectedSubject !== null && (
            <>
              <button onClick={goBackToSubjects} className="flex items-center text-blue-400 hover:underline mb-4">
                <FaArrowLeft className="mr-1" /> Back to Subjects
              </button>
              <h2 className="text-2xl font-bold text-white mb-6">
                {selectedSubject} - Study Materials
              </h2>
              <div className="flex gap-4 mb-8">
                {TABS.map((tab) => (
                  <button
                    key={tab.value}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-lg transition ${activeTab === tab.value ? 'bg-blue-600 text-white' : 'bg-[#23234b] text-gray-300'}`}
                                         onClick={() => setActiveTab(tab.value as 'notes' | 'pyq' | 'formulas' | 'timetable' | 'assignments' | 'events' | 'video' | 'ebook')}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Video Player Modal */}
              {playingVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                  <div className="relative w-full max-w-4xl">
                    <button
                      onClick={handleCloseVideo}
                      className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl z-10"
                    >
                      <FaTimes />
                    </button>
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1`}
                        title="YouTube video player"
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Content Display */}
              <div className="bg-[#181828] rounded-xl p-8 min-h-[200px]">
                {loading ? (
                  <div className="text-gray-300 text-lg flex items-center justify-center">
                    Loading...
                  </div>
                ) : content.length === 0 ? (
                  <div className="text-gray-300 text-lg flex items-center justify-center">
                    No {TABS.find(t => t.value === activeTab)?.label.toLowerCase()} available for this subject.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeTab === 'video' ? (
                      // Video content display
                      content.map((item) => (
                        <div
                          key={item._id}
                          className="bg-[#23234b] rounded-lg p-6 border border-blue-900/30 hover:border-blue-500/50 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-white mb-2">
                                {item.videoTitle}
                              </h3>
                              <p className="text-blue-400 text-sm mb-1">{item.subject}</p>
                              <p className="text-gray-400 text-sm">
                                {item.branch.toUpperCase()} - Semester {item.semester}
                              </p>
                              <p className="text-gray-500 text-sm mt-2">
                                Uploaded: {formatDate(item.uploadDate)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2 text-gray-400">
                                <FaYoutube className="text-2xl text-red-500" />
                                <span className="text-sm">YouTube</span>
                              </div>
                              
                              <button
                                onClick={() => handlePlayVideo(item.videoId!)}
                                className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-semibold"
                              >
                                <FaPlay className="mr-2" />
                                Play
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      // File content display
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content.map((item) => (
                          <div
                            key={item._id}
                            className="bg-[#23234b] rounded-lg p-6 border border-blue-900/30 hover:border-blue-500/50 transition-all duration-300"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white mb-2 truncate">
                                  {item.fileName}
                                </h3>
                                <p className="text-blue-400 text-sm mb-1">{item.subject}</p>
                                <p className="text-gray-400 text-sm">
                                  {item.branch.toUpperCase()} - Semester {item.semester}
                                </p>
                              </div>
                              <FaFileAlt className="text-blue-400 text-2xl ml-3" />
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Size:</span>
                                <span className="text-white">{formatFileSize(item.fileSize || 0)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Type:</span>
                                <span className="text-white">{item.mimeType?.toUpperCase()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Uploaded:</span>
                                <span className="text-white">{formatDate(item.uploadDate)}</span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-3">
                              <a
                                href={item.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                              >
                                <FaEye className="mr-2" />
                                View
                              </a>
                              <a
                                href={item.fileUrl}
                                download
                                className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                              >
                                <FaDownload className="mr-2" />
                                Download
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}