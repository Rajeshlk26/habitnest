// src/lib/db.ts
import mongoose, { Mongoose } from 'mongoose';

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI not defined in .env.local");
}

// ✅ Declare a global type-safe mongoose cache
declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

// ✅ Ensure cache exists in global scope
global.mongoose ||= { conn: null, promise: null };

export async function connectDB(): Promise<Mongoose> {
  if (global.mongoose.conn) return global.mongoose.conn;

  if (!global.mongoose.promise) {
    console.log("🔁 Connecting to MongoDB...");
    global.mongoose.promise = mongoose.connect(MONGO_URI, {
      dbName: 'habitnest',
      bufferCommands: false,
    });
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
    console.log("✅ MongoDB connected!");
    return global.mongoose.conn;
  } catch (err: any) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
}
