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

    // Derive a clean filename and extension from the original upload
    const originalFileName = file.originalFilename || file.originalname || 'uploaded-file';
    const dotIndex = originalFileName.lastIndexOf('.')
    const baseName = dotIndex > 0 ? originalFileName.substring(0, dotIndex) : originalFileName;
    const extension = dotIndex > 0 ? originalFileName.substring(dotIndex + 1) : '';
    const sanitizedBase = baseName.replace(/[^a-zA-Z0-9-_]+/g, '_');

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
    // For raw files (pdf/doc/etc.), set public_id with extension so the URL keeps it.
    const uploadOptions: Record<string, unknown> = {
      folder: folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false
    };

    if (resourceType === 'raw') {
      uploadOptions.public_id = sanitizedBase + (extension ? `.${extension.toLowerCase()}` : '');
    }

    const result = await cloudinary.uploader.upload(dataURI, uploadOptions);
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      fileName: originalFileName,
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