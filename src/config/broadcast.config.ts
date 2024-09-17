enum BroadcastChannelType {
  MAINNET = "mainnet",
  TESTNET = "testnet",
  DEVELOPMENT = "development",
}

enum BroadcastChannelNetworkEnv {
  MAINNET = "mainnet",
  TESTNET = "testnet",
  BETANET = "development",
  LOCALHOST = "localhost",
}
export interface BroadcastChannel {
  name: string;
  address: string;
  type: BroadcastChannelType;
  owner: string;
  description: string;
  network: {
    label: string;
    name: string;
    environment: BroadcastChannelNetworkEnv;
  };
}

const baseBroadcastChannel: BroadcastChannel[] = [
  {
    name: "Edaga Testnet Channel",
    address: "K22E7O64EMVMBVPUQ53VVXN2U4WCYL7XN6PHOYMNNEBSNM6RMMKJZ3OAMI",
    type: BroadcastChannelType.TESTNET,
    owner: "Edaga",
    description: "Default broadcast account for Algorand Testnet",
    network: {
      label: "Algorand",
      name: "algorand",
      environment: BroadcastChannelNetworkEnv.TESTNET,
    },
  },
];

const devBroadcastAccountJson = import.meta.env.VITE_DEV_BROADCAST_ACCOUNT;
if (devBroadcastAccountJson) {
  try {
    const devBroadcastAccount: BroadcastChannel[] = JSON.parse(
      devBroadcastAccountJson
    );
    baseBroadcastChannel.push(...devBroadcastAccount);
  } catch (error) {
    console.error("Failed to parse VITE_DEV_BROADCAST_ACCOUNT:", error);
  }
}

export const BroadcastChannels = baseBroadcastChannel;
