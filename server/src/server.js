// server/src/server.js
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    // 1. Establish database connection before accepting traffic
    await connectDB();

    // 2. Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`=====================================================`);
      console.log(`🚀 IMovies REST API Server online`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=====================================================`);
    });

    // 3. Graceful shutdown handler
    const handleShutdown = async (signal) => {
      console.log(`\n[Server]: Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        console.log('[Server]: HTTP server closed.');
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  } catch (error) {
    console.error('Fatal error starting server:', error.message);
    process.exit(1);
  }
}

startServer();
