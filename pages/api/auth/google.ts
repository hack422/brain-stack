import type { NextApiRequest, NextApiResponse } from 'next';
import { generateGoogleAuthURL } from '../../../lib/googleAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authUrl = generateGoogleAuthURL();
    res.redirect(authUrl);
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
} 