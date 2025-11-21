import { z } from 'zod';
import { Chain } from '../types/chain';

export const marketRequestSchema = z.object({
  params: z.object({}).default({}),
  body: z.object({}).default({}),
  query: z
    .object({
      chainId: z.enum(Chain).optional(),
      marketName: z
        .string()
        .trim()
        .min(1, { message: 'marketName cannot be empty' })
        .optional(),
    })
    .default({}),
});

export type MarketRequest = z.infer<typeof marketRequestSchema>;
