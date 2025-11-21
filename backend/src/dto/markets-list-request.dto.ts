import { z } from 'zod';
import { chainSchema } from '../types/chain';

export const MarketsListRequestSchema = z.object({
  params: z.object({}).default({}),
  body: z.object({}).default({}),
  query: z.object({
    page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
    limit: z.coerce
      .number()
      .min(1, 'Limit must be at least 1')
      .max(100, 'Limit must not exceed 100')
      .default(20),
    chainId: chainSchema.optional(),
    marketName: z.string().trim().min(1, 'Market name must not be empty').optional(),
  }),
});

export type MarketsListRequest = z.infer<typeof MarketsListRequestSchema>;
