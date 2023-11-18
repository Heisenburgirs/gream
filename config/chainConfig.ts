import { CHAIN_NAMESPACES, CustomChainConfig } from "@web3auth/base";

export const CHAIN_CONFIG = {
  mainnet: {
    displayName: "Ethereum Mainnet",
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1",
    rpcTarget: `https://rpc.ankr.com/eth`,
    blockExplorer: "https://etherscan.io/",
    ticker: "ETH",
    tickerName: "Ethereum",
  } as CustomChainConfig,
  mumbai: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x13881", // hex of 80001, polygon testnet
    rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
    displayName: "Polygon Mumbai Testnet",
    blockExplorer: "https://mumbai.polygonscan.com/",
    ticker: "MATIC",
    tickerName: "Matic",
  } as CustomChainConfig,
  celo: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xa4ec", // hex of 42220, Celo mainnet
    rpcTarget: " https://forno.celo.org",
    displayName: "Celo Mainnet",
    blockExplorer: "https://explorer.celo.org",
    ticker: "CELO",
    tickerName: "CELO",
  } as CustomChainConfig,
  polygon: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    rpcTarget: "https://polygon-rpc.com",
    blockExplorer: "https://polygonscan.com/",
    chainId: "0x89",
    displayName: "Polygon Mainnet",
    ticker: "matic",
    tickerName: "Matic",
  } as CustomChainConfig,
  tezos: {
    chainNamespace: CHAIN_NAMESPACES.OTHER,
    displayName: "Tezos Ithacanet",
  } as CustomChainConfig,
} as const;

export type CHAIN_CONFIG_TYPE = keyof typeof CHAIN_CONFIG;

