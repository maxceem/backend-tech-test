import { DataSource } from 'typeorm';
import { Market } from '../../entities/market.entity';
import { TEST_MARKETS } from '../fixtures/market.fixtures';
import { AppDataSource } from '../../config/database';

export async function seedTestData(dataSource: DataSource): Promise<void> {
  const marketRepository = dataSource.getRepository(Market);

  // Clear existing data
  await marketRepository.clear();

  // Insert test data
  await marketRepository.save(TEST_MARKETS);
}

export async function clearTestData(dataSource: DataSource): Promise<void> {
  const marketRepository = dataSource.getRepository(Market);
  await marketRepository.clear();
}

export async function initializeTestDatabase(): Promise<void> {
  if (AppDataSource.isInitialized) {
    return;
  }

  // Override production settings for tests
  AppDataSource.setOptions({
    synchronize: true, // Auto-create schema in test
  });

  await AppDataSource.initialize();
  await seedTestData(AppDataSource);
}

export async function disconnectTestDatabase(): Promise<void> {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}
