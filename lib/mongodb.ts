import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Function to reset the User collection
export async function resetUserCollection() {
  try {
    await dbConnect();
    const db = mongoose.connection.db;
    
    if (db) {
      // Drop the existing users collection
      await db.dropCollection('users');
      console.log('Old users collection dropped successfully');
      
      // The new collection will be created automatically when the first user signs up
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error resetting user collection:', error);
    return false;
  }
}