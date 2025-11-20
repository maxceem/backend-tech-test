import { DataSource } from 'typeorm';
import { Market } from '../../entities/market.entity';
import { TEST_MARKETS } from '../fixtures/market.fixtures';

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
