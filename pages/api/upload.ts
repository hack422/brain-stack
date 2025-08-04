import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { uploadToCloudinary } from '../../lib/cloudinaryUpload';
import Content from '../../models/Content';
import { dbConnect } from '../../lib/mongodb';
import type { File as FormidableFile } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    await dbConnect();
    
    const form = formidable({
      maxFileSize: 100 * 1024 * 1024, // 100MB limit
      allowEmptyFiles: false,
      filter: function ({mimetype}) {
        // Allow only specific file types
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'text/plain',
          'image/jpeg',
          'image/png',
          'image/gif',
          'video/mp4',
          'video/avi',
          'video/quicktime'
        ];
        return mimetype ? allowedTypes.includes(mimetype) : false;
      }
    });
    
    const [fields, files] = await form.parse(req);
    
    const { branch, semester, subject, contentType } = fields;
    const file = files.file?.[0];
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }
    
    if (!branch?.[0] || !semester?.[0] || !subject?.[0] || !contentType?.[0]) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (!['notes', 'pyq', 'formulas', 'timetable', 'assignments', 'events'].includes(contentType[0])) {
      return res.status(400).json({ error: 'Invalid content type. Must be one of: notes, pyq, formulas, timetable, assignments, events' });
    }
    
    // Create folder structure
    const folder = `brainstack-uploads/${branch[0]}/${semester[0]}/${subject[0]}/${contentType[0]}`;
    
    // Coerce file properties to match expected types
    const safeFile = {
      ...file,
      mimetype: file.mimetype || undefined,
      originalFilename: file.originalFilename || undefined,
      originalname: file.originalFilename || undefined,
    };
    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(safeFile, folder);
    
    if (!uploadResult.success) {
      return res.status(500).json({ error: uploadResult.error });
    }
    
    // Save to database
    const content = new Content({
      branch: branch[0]!,
      semester: semester[0]!,
      subject: subject[0]!,
      contentType: contentType[0]!,
      fileName: uploadResult.fileName,
      fileUrl: uploadResult.url,
      publicId: uploadResult.publicId,
      fileSize: uploadResult.fileSize,
      mimeType: uploadResult.mimeType,
      uploadedBy: 'admin', // Get from auth later
      uploadDate: new Date()
    });
    
    await content.save();
    
    res.status(200).json({ 
      message: 'File uploaded successfully', 
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
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
} 