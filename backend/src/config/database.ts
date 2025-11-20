import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Market } from '../entities/market.entity';
import { env } from './env';
import { TypeOrmPinoLogger } from '../utils/typeorm-logger';
import { logger } from '../utils/logger';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [Market],
  synchronize: false,
  logging: env.LOG_DB_QUERY,
  logger: new TypeOrmPinoLogger(logger),
  namingStrategy: new SnakeNamingStrategy(),
});
