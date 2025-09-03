import type { NextApiRequest, NextApiResponse } from 'next';
import Content from '../../models/Content';
import { dbConnect } from '../../lib/mongodb';
import { getPublicUrl } from '../../lib/r2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    await dbConnect();
    
    const { 
      branch, 
      semester, 
      subject, 
      contentType, 
      fileName, 
      fileUrl, 
      key, // R2 key instead of publicId
      fileSize, 
      mimeType 
    } = req.body;
    
    if (!branch || !semester || !subject || !contentType || !fileName || !fileUrl || !key) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!['notes', 'pyq', 'ebook', 'formulas', 'timetable', 'assignments', 'events'].includes(contentType)) {
      return res.status(400).json({ error: 'Invalid content type' });
    }
    
    // Generate the correct public URL for the file
    const publicFileUrl = getPublicUrl(key);
    
    // Save to database with R2 key and correct public URL
    const content = new Content({
      branch,
      semester,
      subject,
      contentType,
      fileName,
      fileUrl: publicFileUrl, // Use the correct public URL
      publicId: key, // Store R2 key in publicId field for compatibility
      fileSize: fileSize || 0,
      mimeType: mimeType || 'application/octet-stream',
      uploadedBy: 'admin',
      uploadDate: new Date()
    });
    
    await content.save();
    
    res.status(200).json({ 
      success: true,
      message: 'Upload completed successfully',
      content: {
        id: content._id,
        fileName: content.fileName,
        fileUrl: content.fileUrl,
        fileSize: content.fileSize,
        mimeType: content.mimeType,
        contentType: content.contentType
      }
    });
  } catch (error) {
    console.error('Upload completion error:', error);
    res.status(500).json({ error: 'Failed to complete upload' });
  }
}
