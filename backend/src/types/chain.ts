import { z } from 'zod';

export enum Chain {
  Ethereum = '1',
  BSC = '56',
}

const chainValues = Object.values(Chain).join(', ');

export const chainSchema = z.enum(Chain, {
  message: `Chain ID must be one of: ${chainValues}`,
});
