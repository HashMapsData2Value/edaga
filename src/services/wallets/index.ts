import { NetworkId, WalletId, WalletManager } from "@txnlab/use-wallet";

export const walletManager = new WalletManager({
  wallets: [
    {
      id: WalletId.WALLETCONNECT,
      options: { projectId: "ae7c3cee5c257ddb0fdd57a688825042" },
    },
    WalletId.PERA,
    WalletId.DEFLY,
    {
      id: WalletId.LUTE,
      options: { siteName: "Edaga" },
    },
    WalletId.KIBISIS,
  ],
  network: NetworkId.TESTNET,
});
