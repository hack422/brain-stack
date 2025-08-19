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
      maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB limit
      allowEmptyFiles: false,
      multiples: true,
      filter: function ({ mimetype }: { mimetype?: string | null }) {
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
    const uploadFiles = (files.file || []) as FormidableFile[];
    
    if (!uploadFiles || uploadFiles.length === 0) {
      return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }
    
    if (!branch?.[0] || !semester?.[0] || !subject?.[0] || !contentType?.[0]) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (!['notes', 'pyq', 'ebook', 'formulas', 'timetable', 'assignments', 'events'].includes(contentType[0])) {
      return res.status(400).json({ error: 'Invalid content type. Must be one of: notes, pyq, ebook, formulas, timetable, assignments, events' });
    }
    
    // Create folder structure
    const folder = `brainstack-uploads/${branch[0]}/${semester[0]}/${subject[0]}/${contentType[0]}`;

    const results: Array<
      | { success: true; id: string; fileName?: string; fileUrl?: string; fileSize?: number; mimeType?: string; contentType?: string }
      | { success: false; error: string; fileName?: string }
    > = [];

    for (const file of uploadFiles) {
      const safeFile = {
        ...file,
        mimetype: file.mimetype || undefined,
        originalFilename: file.originalFilename || undefined,
        originalname: file.originalFilename || undefined,
      };

      const uploadResult = await uploadToCloudinary(safeFile, folder);
      if (!uploadResult.success) {
        results.push({ success: false, error: uploadResult.error || 'Upload failed', fileName: file.originalFilename || undefined });
        continue;
      }

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
        uploadedBy: 'admin',
        uploadDate: new Date()
      });

      await content.save();
      results.push({
        success: true,
        id: content._id,
        fileName: content.fileName,
        fileUrl: content.fileUrl,
        fileSize: content.fileSize,
        mimeType: content.mimeType,
        contentType: content.contentType
      });
    }

    const okCount = results.filter(r => r.success).length;
    const failCount = results.length - okCount;

    res.status(okCount > 0 ? 200 : 500).json({
      message: `Uploaded ${okCount} file(s). ${failCount > 0 ? failCount + ' failed.' : ''}`,
      results
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
} 