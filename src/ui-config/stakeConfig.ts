import { ChainId, Stake } from '@aave/contract-helpers';

export interface StakeConfig {
  chainId: ChainId | number;
  stakeDataProvider: string;
  tokens: {
    [token: string]: {
      TOKEN_STAKING: string;
      STAKING_REWARD_TOKEN: string;
      STAKING_HELPER?: string;
    };
  };
}

// export const stakeConfig: StakeConfig = {
//   chainId: ChainId.mainnet,
//   stakeDataProvider: '0x5E045cfb738F01bC73CEAFF783F4C16e8B14090b',
//   tokens: {
//     [Stake.aave]: {
//       TOKEN_STAKING: '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
//       STAKING_REWARD_TOKEN: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
//       STAKING_HELPER: '0xce0424653fb2fd48ed1b621bdbd60db16b2e388a',
//     },
//     [Stake.bpt]: {
//       TOKEN_STAKING: '0xa1116930326D21fB917d5A27F1E9943A9595fb47',
//       STAKING_REWARD_TOKEN: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
//     },
//   },
// };

export const stakeConfig: StakeConfig = {
  chainId: 84532,
  stakeDataProvider: '0x54254EE6f496Cbf6fcc398df2516D88BC42Af733',
  tokens: {
    [Stake.aave]: {
      TOKEN_STAKING: '0x2f953Fc56D22756D689E7D9C9c17057de85f3054',
      STAKING_REWARD_TOKEN: '0xb2537a041060794E24901b60cFe4Aa766e3Db881',
      STAKING_HELPER: '0x1eDc9709B7498FA0f21aEb81954ce657ee4011B7',
    }
  },
};