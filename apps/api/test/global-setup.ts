import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { config } from './test-config';

export = async function globalSetup() {
  if (config.Memory) {
    // Config to decide if an mongodb-memory-server instance should be used
    // it's needed in global space, because we don't want to create a new instance every test-suite
    const instance = await MongoMemoryServer.create({
      dispose: { cleanup: { doCleanup: true, force: true } },
    });
    const uri = instance.getUri();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (global as any).__MONGOINSTANCE = instance;
    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
  } else {
    process.env.MONGO_URI = `mongodb://${config.IP}:${config.Port}`;
  }

  // The following is to make sure the database is clean before a test suite starts
  const conn = await mongoose.connect(
    `${process.env.MONGO_URI}/${config.Database}`,
  );
  await conn.connection.db?.dropDatabase();
  await mongoose.disconnect();
};
