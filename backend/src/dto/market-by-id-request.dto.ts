import { z } from 'zod';

export const MarketByIdRequestSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({}).default({}),
  query: z.object({}).default({}),
});

export type MarketByIdRequest = z.infer<typeof MarketByIdRequestSchema>;
