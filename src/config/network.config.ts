/**
 * TODO
 * - Network switching
 */

type BlockExplorers = "allo" | "blockpack" | "pera";

export interface Network {
  name: string;
  network: string;
  environment: "mainnet" | "testnet" | "betanet";
  description: string;
  token: string;
  is_production: boolean;
  default: boolean;
  endpoints?: {
    provider: string;
    daemon: string;
    indexer: string;
    port: number;
    is_public: boolean;
  }[];
  blockExplorers?: {
    name: string;
    provider: BlockExplorers | string;
    domain: string;
    queries: {
      transaction: string;
      asset: string;
      account: string;
      application: string;
      block: string;
    };
  }[];
  domainNameServices?: {
    name: string;
    provider: string;
    domain: string;
    queries: {
      lookup: string;
    };
  }[];
}

export const networks: Network[] = [
  {
    name: "Algorand",
    network: "algorand",
    environment: "mainnet",
    description: "Algorand's public network",
    token: "ALGO",
    is_production: true,
    default: false,
    endpoints: [
      {
        provider: "Algonode",
        daemon: "https://mainnet-api.algonode.cloud",
        indexer: "https://mainnet-idx.algonode.cloud",
        port: 443,
        is_public: true,
      },
    ],
    blockExplorers: [
      {
        name: "Allo",
        provider: "allo",
        domain: "https://allo.info",
        queries: {
          transaction: "tx",
          asset: "asset",
          account: "account",
          application: "application",
          block: "block",
        },
      },
      {
        name: "Pera Explorer",
        provider: "pera",
        domain: "https://explorer.perawallet.app",
        queries: {
          transaction: "tx",
          asset: "asset",
          account: "address",
          application: "application",
          block: "block",
        },
      },
      {
        provider: "blockpack",
        name: "Blockpack",
        domain: "https://www.blockpack.app/explorer/#",
        queries: {
          transaction: "transaction",
          asset: "assets",
          account: "account",
          application: "application",
          block: "block",
        },
      },
    ],
    domainNameServices: [
      {
        name: "NFD",
        provider: "Txn Labs",
        domain: "https://api.nf.domains/nfd",
        queries: {
          lookup: "lookup?address=",
        },
      },
    ],
  },
  {
    name: "Algorand (Testnet)",
    network: "algorand",
    environment: "testnet",
    description: "Algorand's test network",
    token: "ALGO",
    is_production: false,
    default: true,
    endpoints: [
      {
        provider: "Algonode",
        daemon: "https://testnet-api.algonode.cloud",
        indexer: "https://testnet-idx.algonode.cloud",
        port: 443,
        is_public: true,
      },
    ],
    blockExplorers: [
      {
        name: "Allo",
        provider: "allo",
        domain: "https://allo.info/testnet",
        queries: {
          transaction: "tx",
          asset: "asset",
          account: "account",
          application: "application",
          block: "block",
        },
      },
      {
        name: "Pera Explorer",
        provider: "pera",
        domain: "https://testnet.explorer.perawallet.app",
        queries: {
          transaction: "tx",
          asset: "asset",
          account: "address",
          application: "application",
          block: "block",
        },
      },
      {
        provider: "blockpack",
        name: "Blockpack",
        domain: "https://testnet.blockpack.app/explorer/#",
        queries: {
          transaction: "transaction",
          asset: "assets",
          account: "account",
          application: "application",
          block: "block",
        },
      },
    ],
    domainNameServices: [
      {
        name: "NFD",
        provider: "Txn Labs",
        domain: "https://api.testnet.nf.domains/nfd",
        queries: {
          lookup: "lookup?address=",
        },
      },
    ],
  },
  {
    name: "Algorand (Betanet)",
    network: "algorand",
    environment: "betanet",
    description: "Algorand's beta network",
    token: "ALGO",
    is_production: false,
    default: false,
    endpoints: [
      {
        provider: "Algonode",
        daemon: "https://betanet-api.algonode.cloud",
        indexer: "https://betanet-idx.algonode.cloud",
        port: 443,
        is_public: true,
      },
    ],
    blockExplorers: [
      {
        provider: "blockpack",
        name: "Blockpack",
        domain: "https://betanet.blockpack.app/explorer/#",
        queries: {
          transaction: "transaction",
          asset: "assets",
          account: "account",
          application: "application",
          block: "block",
        },
      },
    ],
    domainNameServices: [
      {
        name: "NFD",
        provider: "Txn Labs",
        domain: "https://api.betanet.nf.domains/nfd",
        queries: {
          lookup: "lookup?address=",
        },
      },
    ],
  },
];

export const getDefaultNetwork = (): Network | undefined => {
  const defaultNetwork = networks.find((network) => network.default === true);
  if (defaultNetwork) return defaultNetwork;
  console.warn("No default network found. Fallback to Algorand Testnet");
  return networks.find(
    (network) =>
      network.network === "algorand" && network.environment === "testnet"
  );
};
