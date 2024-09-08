import { NetworkId, WalletId, WalletManager } from "@txnlab/use-wallet";
import CasaFamiglia from "./casa";

export const walletManager = new WalletManager({
  network: NetworkId.TESTNET,
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
    {
      id: WalletId.CUSTOM,
      options: {
        provider: new CasaFamiglia.Provider({
          projectId: "ae7c3cee5c257ddb0fdd57a688825042",
        }),
      },
      metadata: {
        name: "Casa",
        icon: CasaFamiglia.Assets.CONNECT_ICON,
      },
    },
  ],
});
