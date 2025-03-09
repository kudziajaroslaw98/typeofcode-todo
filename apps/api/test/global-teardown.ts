import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { config } from './test-config';

export = async function globalTeardown() {
  if (config.Memory) {
    await mongoose.disconnect();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE;
    await instance.stop({ doCleanup: true, force: true });
  }
};
