import { z } from 'zod';
import { chainSchema } from '../types/chain';

export const TvlRequestSchema = z.object({
  params: z.object({}).default({}),
  body: z.object({}).default({}),
  query: z
    .object({
      chainId: chainSchema.optional(),
      marketName: z.string().trim().min(1, { message: 'marketName cannot be empty' }).optional(),
    })
    .strict()
    .default({}),
});

export type TvlRequest = z.infer<typeof TvlRequestSchema>;
