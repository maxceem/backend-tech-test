import { Chain } from '../../types/chain';

export const TEST_MARKETS = [
  {
    name: 'Token 01',
    chainId: Chain.Ethereum,
    totalSupplyCents: 10000,
    totalBorrowCents: 3000,
  },
  {
    name: 'Token 01',
    chainId: Chain.BSC,
    totalSupplyCents: 8000,
    totalBorrowCents: 2000,
  },
  {
    name: 'Token 02',
    chainId: Chain.Ethereum,
    totalSupplyCents: 15000,
    totalBorrowCents: 5000,
  },
  {
    name: 'Token 02',
    chainId: Chain.BSC,
    totalSupplyCents: 12000,
    totalBorrowCents: 4000,
  },
];

// Expected calculations based on TEST_MARKETS
export const EXPECTED_CALCULATIONS = {
  // TVL (total supply)
  allMarketsTvl: '45000', // 10000 + 8000 + 15000 + 12000
  chain1Tvl: '25000', // 10000 + 15000 (Ethereum)
  chain56Tvl: '20000', // 8000 + 12000 (BSC)
  token01Tvl: '18000', // 10000 + 8000 (Token 01 all chains)
  token01Chain1Tvl: '10000', // Token 01 on Ethereum

  // Liquidity (supply - borrow)
  allMarketsLiquidity: '31000', // (10000-3000) + (8000-2000) + (15000-5000) + (12000-4000)
  chain1Liquidity: '17000', // (10000-3000) + (15000-5000)
  chain56Liquidity: '14000', // (8000-2000) + (12000-4000)
  token02Liquidity: '18000', // (15000-5000) + (12000-4000)
  token01Chain1Liquidity: '7000', // (10000-3000)
};
