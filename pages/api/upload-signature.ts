import type { NextApiRequest, NextApiResponse } from 'next';
import { generateUploadSignature } from '../../lib/cloudinaryUpload';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { branch, semester, subject, contentType, mimeType } = req.body;
    
    if (!branch || !semester || !subject || !contentType || !mimeType) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (!['notes', 'pyq', 'ebook', 'formulas', 'timetable', 'assignments', 'events'].includes(contentType)) {
      return res.status(400).json({ error: 'Invalid content type' });
    }
    
    // Create folder structure
    const folder = `brainstack-uploads/${branch}/${semester}/${subject}/${contentType}`;
    
    // Determine resource type based on MIME type
    const resourceType = mimeType.startsWith('image/')
      ? 'image'
      : mimeType.startsWith('video/')
        ? 'video'
        : 'raw';
    
    // Generate signed upload parameters
    const uploadParams = generateUploadSignature(folder, resourceType);
    
    res.status(200).json({ 
      success: true, 
      uploadParams,
      folder,
      resourceType
    });
  } catch (error) {
    console.error('Signature generation error:', error);
    res.status(500).json({ error: 'Failed to generate upload signature' });
  }
}
