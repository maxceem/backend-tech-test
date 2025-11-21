import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { initializeTestDatabase, seedTestData } from './helpers/db.helper';

beforeAll(async () => {
  await initializeTestDatabase();
});

beforeEach(async () => {
  // we need re-init in case some test disconnected DB for testing purposes
  if (!AppDataSource.isInitialized) {
    await initializeTestDatabase();
    // early stop, as intializaton already seeded data
    return;
  }

  await seedTestData(AppDataSource);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});
