import type { NextApiRequest, NextApiResponse } from 'next';
import { r2Client } from '../../lib/r2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  
  try {
    // Check environment variables
    const envCheck = {
      hasAccountId: !!process.env.CLOUDFLARE_ACCOUNT_ID,
      hasAccessKey: !!process.env.CLOUDFLARE_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
      hasBucketName: !!process.env.CLOUDFLARE_BUCKET_NAME,
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
      bucketName: process.env.CLOUDFLARE_BUCKET_NAME
    };
    
    console.log('R2 Environment Check:', envCheck);
    
    if (!envCheck.hasAccountId || !envCheck.hasAccessKey || !envCheck.hasSecretKey || !envCheck.hasBucketName) {
      return res.status(500).json({ 
        error: 'Missing R2 environment variables',
        envCheck 
      });
    }
    
    // Test R2 client configuration
    const endpoint = `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    
    res.status(200).json({ 
      success: true,
      message: 'R2 configuration is valid',
      config: {
        endpoint,
        bucket: process.env.CLOUDFLARE_BUCKET_NAME,
        region: 'auto'
      },
      envCheck
    });
  } catch (error) {
    console.error('R2 test error:', error);
    res.status(500).json({ error: 'R2 test failed' });
  }
}
