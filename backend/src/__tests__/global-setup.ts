/* eslint-disable no-process-env */
import { config } from 'dotenv';
import { resolve } from 'path';
const TEST_ENV_VALUE = 'test';

export default function globalSetup(): void {
  const envPath = resolve(__dirname, '../../.env.test');
  const result = config({ path: envPath });

  if (result.error) {
    throw new Error(`Failed to load test environment file at ${envPath}: ${result.error.message}`);
  }

  if (process.env.NODE_ENV !== TEST_ENV_VALUE) {
    throw new Error(`Tests must run with NODE_ENV=${TEST_ENV_VALUE}`);
  }

  if (!process.env.DB_NAME?.endsWith('_test')) {
    throw new Error('Test database name must end with "_test" suffix');
  }
}
