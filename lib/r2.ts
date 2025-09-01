import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// R2 Client configuration
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

// Generate presigned URL for direct upload
export const generatePresignedUrl = async (
  key: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hour
) => {
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });

  try {
    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn });
    return { success: true, url: presignedUrl };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return { success: false, error: 'Failed to generate upload URL' };
  }
};

// Delete file from R2
export const deleteFromR2 = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.CLOUDFLARE_BUCKET_NAME!,
    Key: key,
  });

  try {
    await r2Client.send(command);
    return { success: true };
  } catch (error) {
    console.error('Error deleting from R2:', error);
    return { success: false, error: 'Failed to delete file' };
  }
};

// Generate public URL for R2 files
export const getPublicUrl = (key: string) => {
  const bucketName = process.env.CLOUDFLARE_BUCKET_NAME;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  return `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;
};
