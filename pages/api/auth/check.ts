import type { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../models/User';
import { dbConnect } from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  
  try {
    await dbConnect();
    
    // Get the auth token from cookies
    const authToken = req.cookies['auth-token'];
    
    if (!authToken) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    let authData;
    try {
      authData = JSON.parse(authToken);
    } catch (error) {
      console.error('invalid Auth token:', error);
      return res.status(401).json({ error: 'Invalid auth token' });
    }
    
    // Find user by ID
    const user = await User.findById(authData.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ error: 'User not verified' });
    }
    
    // Return user info
    res.status(200).json({ 
      authenticated: true, 
      user: { 
        id: user._id, 
        email: user.email,
        name: user.name,
        picture: user.picture,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified
      } 
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 