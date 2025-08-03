import type { NextApiRequest, NextApiResponse } from 'next';
import { resetUserCollection } from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const success = await resetUserCollection();
    
    if (success) {
      res.status(200).json({ message: 'User collection reset successfully' });
    } else {
      res.status(500).json({ error: 'Failed to reset user collection' });
    }
  } catch (error) {
    console.error('Reset users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 