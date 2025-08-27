import { useState, useEffect } from 'react';
import { FaStar, FaCodeBranch, FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
}

interface GitHubProjectsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const languageColors: { [key: string]: string } = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95'
};

export default function GitHubProjects({ activeFilter, onFilterChange }: GitHubProjectsProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/github-repos');
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const data = await response.json();
      setRepos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getUniqueLanguages = () => {
    const languages = repos
      .map(repo => repo.language)
      .filter((lang): lang is string => lang !== null);
    return [...new Set(languages)];
  };

  const filteredRepos = repos.filter(repo => {
    if (activeFilter === 'All') return true;
    return repo.language === activeFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">Failed to load repositories</div>
        <button 
          onClick={fetchRepos}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const languages = getUniqueLanguages();

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex gap-4 mb-8 flex-wrap justify-center">
        <button
          onClick={() => onFilterChange('All')}
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${
            activeFilter === 'All'
              ? 'bg-blue-700 text-white'
              : 'bg-[#181828] text-gray-400 hover:bg-[#2a2a3c]'
          }`}
        >
          All ({repos.length})
        </button>
        {languages.map(language => {
          const count = repos.filter(repo => repo.language === language).length;
          return (
            <button
              key={language}
              onClick={() => onFilterChange(language)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                activeFilter === language
                  ? 'bg-blue-700 text-white'
                  : 'bg-[#181828] text-gray-400 hover:bg-[#2a2a3c]'
              }`}
            >
              {language} ({count})
            </button>
          );
        })}
      </div>

      {/* Repository Cards */}
      {filteredRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos.map(repo => (
            <div
              key={repo.id}
              className="bg-[#181828] rounded-lg p-6 shadow-lg border border-white/10 hover:border-blue-400/30 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaGithub className="text-white text-xl" />
                  <h3 className="text-white font-semibold text-lg truncate">
                    {repo.name}
                  </h3>
                </div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <FaExternalLinkAlt size={16} />
                </a>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-3 min-h-[3rem]">
                {repo.description || 'No description available'}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" size={14} />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCodeBranch className="text-gray-400" size={14} />
                    <span>{repo.forks_count}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  Updated {formatDate(repo.updated_at)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                {repo.language && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: languageColors[repo.language] || '#6b7280' }}
                    />
                    <span className="text-sm text-gray-300">{repo.language}</span>
                  </div>
                )}
                
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  View Code
                </a>
              </div>

              {repo.topics && repo.topics.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1">
                  {repo.topics.slice(0, 3).map(topic => (
                    <span
                      key={topic}
                      className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs"
                    >
                      {topic}
                    </span>
                  ))}
                  {repo.topics.length > 3 && (
                    <span className="text-gray-400 text-xs px-2 py-1">
                      +{repo.topics.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            No projects found for &quot;{activeFilter}&quot; filter
          </div>
          <button
            onClick={() => onFilterChange('All')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            Show All Projects
          </button>
        </div>
      )}
    </div>
  );
}