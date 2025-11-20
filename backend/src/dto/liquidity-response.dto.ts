import { z } from 'zod';

export const liquidityResponseSchema = z.object({
  marketLiquidity: z.string(),
});

export type LiquidityResponse = z.infer<typeof liquidityResponseSchema>;
