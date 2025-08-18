import cloudinary from './cloudinary';
import { readFileSync } from 'fs';

interface FileObject {
  filepath?: string;
  buffer?: Buffer;
  data?: Buffer;
  mimetype?: string;
  originalFilename?: string;
  originalname?: string;
  size?: number;
}

export const uploadToCloudinary = async (file: FileObject, folder: string = 'brainstack-uploads') => {
  try {
    // Handle different file object structures (formidable vs regular file buffer)
    let fileBuffer: Buffer;
    
    if (file.filepath) {
      // Formidable file object - read from filepath
      fileBuffer = readFileSync(file.filepath);
    } else if (file.buffer) {
      // Regular file buffer
      fileBuffer = file.buffer;
    } else if (file.data) {
      // Alternative buffer property
      fileBuffer = Buffer.from(file.data);
    } else {
      throw new Error('Invalid file object: no buffer, filepath, or data found');
    }
    
    const base64File = fileBuffer.toString('base64');
    const mimeType = file.mimetype || 'application/octet-stream';
    const dataURI = `data:${mimeType};base64,${base64File}`;

    // Decide Cloudinary resource_type to preserve original format
    // - images => 'image'
    // - videos => 'video'
    // - everything else (pdf, docs, txt, etc.) => 'raw'
    const resourceType = mimeType.startsWith('image/')
      ? 'image'
      : mimeType.startsWith('video/')
        ? 'video'
        : 'raw';

    // Upload to Cloudinary without format-forcing transformations
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false
    });
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      fileName: file.originalFilename || file.originalname || 'uploaded-file',
      fileSize: result.bytes,
      mimeType: mimeType
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}; 