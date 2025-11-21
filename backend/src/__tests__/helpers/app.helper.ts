import { Express } from 'express';
import { createApp } from '../../app';
import { AppDataSource } from '../../config/database';

export function createTestApp(): Express {
  return createApp(AppDataSource);
}
