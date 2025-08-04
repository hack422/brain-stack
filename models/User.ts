import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  name: string;
  picture?: string;
  googleId?: string;
  isAdmin: boolean;
  isVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
  createdAt: Date;
  lastLogin: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  email: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,
    trim: true
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  picture: { 
    type: String 
  },
  googleId: { 
    type: String,
    unique: true,
    sparse: true
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  otp: { 
    type: String 
  },
  otpExpiry: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLogin: { 
    type: Date, 
    default: Date.now 
  }
});

// Only create index for isAdmin since email and googleId already have unique constraints
UserSchema.index({ isAdmin: 1 });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
