// src/lib/db.ts
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined");
  throw new Error("MONGO_URI not defined in .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log("🔁 Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGO_URI, {
      dbName: 'habitnest',
      bufferCommands: false,
    }).then((mongoose) => {
      console.log("✅ MongoDB connected!");
      return mongoose;
    }).catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("❌ DB connection failed in await:", error.message);
    throw error;
  }
}

