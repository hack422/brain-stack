import cloudinary from './cloudinary';
import type { UploadApiOptions, UploadApiResponse, UploadApiErrorResponse, UploadStream } from 'cloudinary';

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
    const mimeType = file.mimetype || 'application/octet-stream';

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
    const uploadOptions: UploadApiOptions = {
      folder: folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false
    };

    if (resourceType === 'raw') {
      uploadOptions.public_id = sanitizedBase + (extension ? `.${extension.toLowerCase()}` : '');
    }

    const fileSizeBytes = file.size || 0;
    const isLarge = fileSizeBytes > 100 * 1024 * 1024; // >100MB

    let result: UploadApiResponse;

    if (file.filepath) {
      // Use chunked upload for large files or non-images; use regular upload for small images
      if (isLarge || resourceType !== 'image') {
        result = await (cloudinary.uploader.upload_large(file.filepath, {
          ...uploadOptions,
          chunk_size: 6_000_000 // 6MB chunks
        }) as unknown as Promise<UploadApiResponse>);
      } else {
        result = await (cloudinary.uploader.upload(file.filepath, uploadOptions) as unknown as Promise<UploadApiResponse>);
      }
    } else if (file.buffer || file.data) {
      const buffer = file.buffer || Buffer.from(file.data!);
      result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream: UploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error: UploadApiErrorResponse | undefined, response: UploadApiResponse | undefined) => {
            if (error || !response) return reject(error || new Error('Upload failed'));
            resolve(response);
          }
        );
        uploadStream.end(buffer);
      });
    } else {
      throw new Error('Invalid file object: no buffer, filepath, or data found');
    }

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