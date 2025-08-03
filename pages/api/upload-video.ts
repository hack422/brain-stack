import type { NextApiRequest, NextApiResponse } from 'next';
import Content from '../../models/Content';
import { dbConnect } from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    await dbConnect();
    
    const { branch, semester, subject, videoTitle, videoUrl } = req.body;
    
    if (!branch || !semester || !subject || !videoTitle || !videoUrl) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Extract YouTube video ID from URL
    const videoIdMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }
    
    // Save to database
    const content = new Content({
      branch,
      semester,
      subject,
      contentType: 'video',
      videoTitle,
      videoUrl,
      videoId,
      uploadedBy: 'admin', // Get from auth later
      uploadDate: new Date()
    });
    
    await content.save();
    
    res.status(200).json({ 
      message: 'Video uploaded successfully', 
      content: {
        id: content._id,
        videoTitle: content.videoTitle,
        videoUrl: content.videoUrl,
        videoId: content.videoId
      }
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
} 