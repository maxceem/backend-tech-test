import 'reflect-metadata';
import { config } from 'dotenv';
import { resolve } from 'path';
import { DataSource } from 'typeorm';
import { Market } from '../entities/market.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { seedTestData } from './helpers/db.helper';

// Load test environment variables
config({ path: resolve(__dirname, '../../.env.test') });

export const TestDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  username: process.env.DB_USER || 'test_user',
  password: process.env.DB_PASSWORD || 'test_password',
  database: process.env.DB_NAME || 'app_db_test',
  synchronize: true, // Auto-create schema in test
  logging: false,
  entities: [Market],
  namingStrategy: new SnakeNamingStrategy(),
});

beforeAll(async () => {
  await TestDataSource.initialize();
  await seedTestData(TestDataSource);
});

afterAll(async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
});
