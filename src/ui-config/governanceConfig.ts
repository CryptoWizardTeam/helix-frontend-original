import { ChainId } from '@aave/contract-helpers';

export interface GovernanceConfig {
  chainId: ChainId | number;
  walletBalanceProvider: string;
  votingAssetName: string;
  averageNetworkBlockTime: number;
  queryGovernanceDataUrl: string;
  wsGovernanceDataUrl: string;
  aaveTokenAddress: string;
  aAaveTokenAddress: string;
  stkAaveTokenAddress: string;
  governanceForumLink: string;
  governanceSnapshotLink: string;
  governanceFAQLink: string;
  addresses: {
    AAVE_GOVERNANCE_V2: string;
    AAVE_GOVERNANCE_V2_EXECUTOR_SHORT: string;
    AAVE_GOVERNANCE_V2_EXECUTOR_LONG: string;
    AAVE_GOVERNANCE_V2_HELPER: string;
  };
  ipfsGateway: string;
  fallbackIpfsGateway: string;
}

// export const governanceConfig: GovernanceConfig = {
//   chainId: ChainId.mainnet,
//   votingAssetName: 'AAVE + stkAAVE',
//   averageNetworkBlockTime: 13.5,
//   queryGovernanceDataUrl: 'https://api.thegraph.com/subgraphs/name/aave/governance-v2',
//   wsGovernanceDataUrl: 'wss://api.thegraph.com/subgraphs/name/aave/governance-v2',
//   aaveTokenAddress: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
//   aAaveTokenAddress: '0xDa5E8e1C3596D3Cc11a4dd5aD66b8f03B5410F8C',
//   stkAaveTokenAddress: '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
//   governanceForumLink: 'https://governance.aave.com',
//   governanceFAQLink: 'https://docs.aave.com/faq/governance',
//   walletBalanceProvider: '0x8E8dAd5409E0263a51C0aB5055dA66Be28cFF922',
//   governanceSnapshotLink: 'https://snapshot.org/#/aave.eth',
//   addresses: {
//     AAVE_GOVERNANCE_V2: '0xEC568fffba86c094cf06b22134B23074DFE2252c',
//     AAVE_GOVERNANCE_V2_EXECUTOR_SHORT: '0x61910EcD7e8e942136CE7Fe7943f956cea1CC2f7',
//     AAVE_GOVERNANCE_V2_EXECUTOR_LONG: '0xEE56e2B3D491590B5b31738cC34d5232F378a8D5',
//     AAVE_GOVERNANCE_V2_HELPER: '0xBb7baf0534423e3108E1D03c259104cDba2C1cB7',
//   },
//   ipfsGateway: 'https://cloudflare-ipfs.com/ipfs',
//   fallbackIpfsGateway: 'https://ipfs.io/ipfs',
// };

export const governanceConfig: GovernanceConfig = {
  chainId: 84532,
  votingAssetName: 'AAVE + stkAAVE',
  averageNetworkBlockTime: 13.5,
  queryGovernanceDataUrl: 'https://api.studio.thegraph.com/query/117555/helix-governance/version/latest',
  wsGovernanceDataUrl: 'wss://api.studio.thegraph.com/query/117555/helix-governance/version/latest',
  aaveTokenAddress: '0xb2537a041060794E24901b60cFe4Aa766e3Db881',
  aAaveTokenAddress: '0xD94c7FE4fCd27a8bF568376997f606298f88eE62',
  stkAaveTokenAddress: '0x2f953Fc56D22756D689E7D9C9c17057de85f3054',
  governanceForumLink: 'https://governance.aave.com',
  governanceFAQLink: 'https://docs.aave.com/faq/governance',
  walletBalanceProvider: '0x36c7d394183546B65D11E5C83d870d66b0bC46b4',
  governanceSnapshotLink: 'https://snapshot.org/#/aave.eth',
  addresses: {
    AAVE_GOVERNANCE_V2: '0x4Ed57373f62cE6656f59d3ad82a8e69bE87Fd7Fe',
    AAVE_GOVERNANCE_V2_EXECUTOR_SHORT: '0x61910EcD7e8e942136CE7Fe7943f956cea1CC2f7',
    AAVE_GOVERNANCE_V2_EXECUTOR_LONG: '0xEE56e2B3D491590B5b31738cC34d5232F378a8D5',
    AAVE_GOVERNANCE_V2_HELPER: '0x5a717F7d6566ee2917B77954c6b576E459AE70c2',
  },
  ipfsGateway: 'https://ipfs.io/ipfs',
  fallbackIpfsGateway: 'https://ipfs.io/ipfs',
};
