import { z } from 'zod';
import { MarketResponseSchema } from './market-response.dto';

export const MarketsListResponseSchema = z.object({
  limit: z.number(),
  page: z.number(),
  total: z.number(),
  totalPages: z.number(),
  result: z.array(MarketResponseSchema),
});

export type MarketsListResponse = z.infer<typeof MarketsListResponseSchema>;
