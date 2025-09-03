import type { NextApiRequest, NextApiResponse } from 'next';
import Content from '../../models/Content';
import { dbConnect } from '../../lib/mongodb';
import { getPublicUrl } from '../../lib/r2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    await dbConnect();
    
    // Find all content with old R2 URLs (using private endpoint)
    const oldUrlPattern = /https:\/\/.*\.r2\.cloudflarestorage\.com\//;
    const contents = await Content.find({
      fileUrl: { $regex: oldUrlPattern }
    });
    
    console.log(`Found ${contents.length} files with old URLs to migrate`);
    
    let updatedCount = 0;
    
    for (const content of contents) {
      if (content.publicId) {
        // Generate new public URL using the public development token
        const newFileUrl = getPublicUrl(content.publicId);
        
        // Update the fileUrl
        await Content.findByIdAndUpdate(content._id, {
          fileUrl: newFileUrl
        });
        
        updatedCount++;
        console.log(`Updated file: ${content.fileName} - ${newFileUrl}`);
      }
    }
    
    res.status(200).json({ 
      success: true,
      message: `Successfully migrated ${updatedCount} file URLs`,
      totalFound: contents.length,
      updatedCount: updatedCount
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ error: 'Failed to migrate file URLs' });
  }
}
