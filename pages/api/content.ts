import type { NextApiRequest, NextApiResponse } from 'next';
import Content from '../../models/Content';
import { dbConnect } from '../../lib/mongodb';
import { deleteFromR2 } from '../../lib/r2';

interface ContentFilter {
  contentType?: string;
  subject?: string;
  branch?: string;
  semester?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await dbConnect();
      
      const { type, subject, branch, semester } = req.query;
      
      const filter: ContentFilter = {};
      
      if (type) {
        filter.contentType = type as string;
      }
      
      if (subject) {
        filter.subject = subject as string;
      }
      
      if (branch) {
        filter.branch = branch as string;
      }
      
      if (semester) {
        filter.semester = semester as string;
      }
      
      const content = await Content.find(filter).sort({ uploadDate: -1 });
      
      res.status(200).json({ content });
    } catch (error) {
      console.error('Content fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch content' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await dbConnect();
      
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Content ID is required' });
      }
      
      const content = await Content.findById(id);
      
      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }
      
      // Delete from R2 if applicable (publicId now contains R2 key)
      if (content.publicId) {
        try {
          await deleteFromR2(content.publicId);
        } catch (err) {
          // Continue deletion even if R2 removal fails
          console.error('R2 delete failed:', err);
        }
      }
      
      // Delete from database
      await Content.findByIdAndDelete(id);
      
      res.status(200).json({ message: 'Content deleted successfully' });
    } catch (error) {
      console.error('Error deleting content:', error);
      res.status(500).json({ error: 'Failed to delete content' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 