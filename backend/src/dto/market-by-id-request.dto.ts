import { z } from 'zod';

export const MarketByIdRequestSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }).strict(),
  body: z.object({}).default({}),
  query: z.object({}).strict().default({}),
});

export type MarketByIdRequest = z.infer<typeof MarketByIdRequestSchema>;
