import { z } from 'zod';
import { chainSchema } from '../types/chain';

export const MarketResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  chainId: chainSchema,
  tvlCents: z.string(),
  borrowCents: z.string(),
  liquidityCents: z.string(),
});

export type MarketResponse = z.infer<typeof MarketResponseSchema>;
