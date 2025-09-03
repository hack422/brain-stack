import type { NextApiRequest, NextApiResponse } from 'next';
import { generatePresignedUrl } from '../../lib/r2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { branch, semester, subject, contentType, mimeType, fileName } = req.body;
    
    console.log('Upload signature request:', { branch, semester, subject, contentType, mimeType, fileName });
    
    if (!branch || !semester || !subject || !contentType || !mimeType || !fileName) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (!['notes', 'pyq', 'ebook', 'formulas', 'timetable', 'assignments', 'events'].includes(contentType)) {
      return res.status(400).json({ error: 'Invalid content type' });
    }
    
    // Check environment variables
    console.log('Environment check:', {
      hasAccountId: !!process.env.CLOUDFLARE_ACCOUNT_ID,
      hasAccessKey: !!process.env.CLOUDFLARE_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
      hasBucketName: !!process.env.CLOUDFLARE_BUCKET_NAME
    });
    
    if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_ACCESS_KEY_ID || 
        !process.env.CLOUDFLARE_SECRET_ACCESS_KEY || !process.env.CLOUDFLARE_BUCKET_NAME) {
      console.error('Missing R2 environment variables');
      return res.status(500).json({ error: 'R2 configuration incomplete' });
    }
    
    // Create folder structure and unique filename
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `brainstack-uploads/${branch}/${semester}/${subject}/${contentType}/${timestamp}_${sanitizedFileName}`;
    
    console.log('Generated key:', key);
    
    // Generate presigned URL for direct upload to R2
    const presignedResult = await generatePresignedUrl(key, mimeType);
    
    if (!presignedResult.success) {
      console.error('Presigned URL generation failed:', presignedResult.error);
      return res.status(500).json({ error: presignedResult.error });
    }
    
    const publicUrl = `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.CLOUDFLARE_BUCKET_NAME}/${key}`;
    
    console.log('Successfully generated presigned URL and public URL');
    
    res.status(200).json({ 
      success: true, 
      uploadUrl: presignedResult.url,
      key: key,
      publicUrl: publicUrl
    });
  } catch (error) {
    console.error('Presigned URL generation error:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
}
