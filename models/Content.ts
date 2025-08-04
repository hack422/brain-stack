import mongoose, { Schema, Document } from 'mongoose';

interface IContent extends Document {
  branch: string;
  semester: string;
  subject: string;
  contentType: 'notes' | 'pyq' | 'formulas' | 'timetable' | 'assignments' | 'events' | 'video';
  fileName?: string;
  fileUrl?: string;
  publicId?: string;
  fileSize?: number;
  mimeType?: string;
  videoTitle?: string;
  videoUrl?: string;
  videoId?: string;
  uploadedBy: string;
  uploadDate: Date;
}

const ContentSchema: Schema<IContent> = new Schema({
  branch: { type: String, required: true },
  semester: { type: String, required: true },
  subject: { type: String, required: true },
  contentType: { 
    type: String, 
    required: true, 
    enum: ['notes', 'pyq', 'formulas', 'timetable', 'assignments', 'events', 'video'],
    default: 'notes'
  },
  fileName: { type: String },
  fileUrl: { type: String },
  publicId: { type: String },
  fileSize: { type: Number },
  mimeType: { type: String },
  videoTitle: { type: String },
  videoUrl: { type: String },
  videoId: { type: String },
  uploadedBy: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }
});

export default mongoose.models.Content || mongoose.model<IContent>("Content", ContentSchema); 