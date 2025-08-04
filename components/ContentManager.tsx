import { useState, useEffect, useCallback } from 'react';
import { FaTrash, FaDownload, FaEye } from 'react-icons/fa';

interface Content {
  _id: string;
  branch: string;
  semester: string;
  subject: string;
  contentType: 'notes' | 'pyq' | 'formulas' | 'timetable' | 'assignments' | 'events' | 'video';
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  videoTitle?: string;
  videoUrl?: string;
  videoId?: string;
  uploadDate: string;
}

export default function ContentManager() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    branch: '',
    semester: '',
    subject: '',
    contentType: ''
  });

  const contentTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'notes', label: 'Notes' },
    { value: 'pyq', label: 'PYQ' },
    { value: 'formulas', label: 'Formulas' },
    { value: 'timetable', label: 'Timetable' },
    { value: 'assignments', label: 'Assignments' },
    { value: 'events', label: 'Events' },
    { value: 'video', label: 'Video' }
  ];

  const fetchContents = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter.branch) params.append('branch', filter.branch);
      if (filter.semester) params.append('semester', filter.semester);
      if (filter.subject) params.append('subject', filter.subject);
      if (filter.contentType) params.append('type', filter.contentType);

      const response = await fetch(`/api/content?${params}`);
      const data = await response.json();
      
      if (response.ok && data.content) {
        setContents(data.content);
      } else {
        setContents([]);
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
      setContents([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/content?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setContents(contents.filter(content => content._id !== id));
        alert('File deleted successfully!');
      } else {
        alert('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Failed to delete file');
    }
  };

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="text-gray-300">Loading content...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={filter.branch}
          onChange={(e) => setFilter({ ...filter, branch: e.target.value })}
          className="px-4 py-2 bg-[#23234b] border border-blue-900/50 rounded-lg text-white"
        >
          <option value="">All Branches</option>
          <option value="cse">CSE</option>
          <option value="cse-aiml">CSE-AIML</option>
        </select>
        
        <select
          value={filter.semester}
          onChange={(e) => setFilter({ ...filter, semester: e.target.value })}
          className="px-4 py-2 bg-[#23234b] border border-blue-900/50 rounded-lg text-white"
        >
          <option value="">All Semesters</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
          <option value="5">Semester 5</option>
          <option value="6">Semester 6</option>
        </select>
        
        <select
          value={filter.contentType}
          onChange={(e) => setFilter({ ...filter, contentType: e.target.value })}
          className="px-4 py-2 bg-[#23234b] border border-blue-900/50 rounded-lg text-white"
        >
          {contentTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Filter by subject..."
          value={filter.subject}
          onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
          className="px-4 py-2 bg-[#23234b] border border-blue-900/50 rounded-lg text-white"
        />
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {contents.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No content found. Upload some files to get started!
          </div>
        ) : (
          contents.map((content) => (
            <div
              key={content._id}
              className="bg-[#23234b] rounded-lg p-4 border border-blue-900/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">
                        {content.contentType === 'video' ? content.videoTitle : content.fileName}
                      </h3>
                      <div className="text-gray-400 text-sm mt-1">
                        {content.branch.toUpperCase()} • Semester {content.semester} • {content.subject} • 
                        <span className={`ml-1 px-2 py-1 rounded text-xs ${
                          content.contentType === 'pyq' ? 'bg-yellow-600 text-yellow-100' :
                          content.contentType === 'notes' ? 'bg-blue-600 text-blue-100' :
                          'bg-red-600 text-red-100'
                        }`}>
                          {content.contentType.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {content.contentType === 'video' ? (
                          `YouTube Video • ${formatDate(content.uploadDate)}`
                        ) : (
                          `${formatFileSize(content.fileSize || 0)} • ${content.mimeType} • ${formatDate(content.uploadDate)}`
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {content.contentType === 'video' ? (
                    <>
                      <a
                        href={content.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        title="Watch on YouTube"
                      >
                        <FaEye size={16} />
                      </a>
                    </>
                  ) : (
                    <>
                      <a
                        href={content.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        title="View file"
                      >
                        <FaEye size={16} />
                      </a>
                      
                      <a
                        href={content.fileUrl}
                        download
                        className="p-2 text-green-400 hover:text-green-300 transition-colors"
                        title="Download file"
                      >
                        <FaDownload size={16} />
                      </a>
                    </>
                  )}
                  
                  <button
                    onClick={() => handleDelete(content._id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    title="Delete content"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 