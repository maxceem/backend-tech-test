import { Express } from 'express';
import { createApp } from '../../app';

export function createTestApp(): Express {
  return createApp();
}
