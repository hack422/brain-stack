import { NextApiRequest, NextApiResponse } from 'next';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api.github.com/users/hack422/repos?sort=updated&per_page=6', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Brain-Stack-Website'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();
    
    // Filter out forks and sort by stars/activity
    const filteredRepos = repos
      .filter(repo => !repo.name.includes('fork'))
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    res.status(200).json(filteredRepos);
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    res.status(500).json({ message: 'Failed to fetch repositories' });
  }
}