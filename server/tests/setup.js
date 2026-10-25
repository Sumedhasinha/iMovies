// server/tests/setup.js
import { beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/imovies_test';
process.env.JWT_SECRET = 'test_jwt_secret_key_1234567890';
process.env.JWT_EXPIRES_IN = '1d';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    // Drop test database to leave clean state
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
});
