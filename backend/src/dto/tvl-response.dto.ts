import { z } from 'zod';

export const tvlResponseSchema = z.object({
  marketTvl: z.string(),
});

export type TvlResponse = z.infer<typeof tvlResponseSchema>;
