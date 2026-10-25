// server/src/config/db.js
import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Ensures server does not accept requests before DB is ready
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('FATAL ERROR: MONGODB_URI environment variable is not defined.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true
    });

    console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('[Database Error]:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database]: MongoDB connection disconnected.');
    });

    return conn;
  } catch (error) {
    console.error('[Database Connection Failed]:', error.message);
    throw error;
  }
}

/**
 * Disconnect from MongoDB database (used in testing cleanup and graceful shutdown)
 */
export async function disconnectDB() {
  try {
    await mongoose.connection.close();
    console.log('[Database] MongoDB connection closed.');
  } catch (err) {
    console.error('[Database Disconnect Error]:', err.message);
  }
}
