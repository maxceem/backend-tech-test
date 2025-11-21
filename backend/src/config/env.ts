/* eslint-disable no-process-env */
import { z } from 'zod';
import { NodeEnv } from '../types/node-env';
import { LogLevel } from '../types/log-level';

const envSchema = z.object({
  NODE_ENV: z.enum(NodeEnv).default(NodeEnv.Development),

  PORT: z.coerce.number().int().positive().default(8181),
  API_BASE_PATH: z.string().default('/'),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().int().positive(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  LOG_LEVEL: z.enum(LogLevel).default(LogLevel.Info),
  LOG_PRETTY: z.coerce.boolean().default(process.env.NODE_ENV === NodeEnv.Development),
  LOG_DB_QUERY: z.coerce.boolean().default(process.env.NODE_ENV === NodeEnv.Development),
});

export const env = envSchema.parse(process.env);
