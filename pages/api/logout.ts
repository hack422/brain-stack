import type { NextApiRequest, NextApiResponse } from 'next';
import User from '../../models/User';
import { dbConnect } from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    await dbConnect();
    
    // Get the auth token from cookies
    const authToken = req.cookies['auth-token'];
    
    if (authToken) {
      try {
        const authData = JSON.parse(authToken);
        const user = await User.findById(authData.userId);
        
        if (user && !user.isAdmin) {
          // Remove user data for non-admin users
          await User.findByIdAndDelete(user._id);
        }
      } catch (error) {
        console.error('Error processing logout:', error);
      }
    }
    
    // Clear all authentication cookies
    res.setHeader('Set-Cookie', [
      'auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict',
      'session=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict',
      'pending-auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict'
    ]);
    
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
} 