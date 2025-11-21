import { z } from 'zod';
import { Chain } from '../types/chain';

const chainValues = Object.values(Chain).join('|');

export const marketRequestSchema = z.object({
  params: z.object({}).default({}),
  body: z.object({}).default({}),
  query: z
    .object({
      chainId: z.enum(Chain, { message: `chainId must be one of ${chainValues}` }).optional(),
      marketName: z.string().trim().min(1, { message: 'marketName cannot be empty' }).optional(),
    })
    .default({}),
});

export type MarketRequest = z.infer<typeof marketRequestSchema>;
