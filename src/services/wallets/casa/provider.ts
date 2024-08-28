import { CustomProvider, WalletAccount } from "@txnlab/use-wallet";
import { Core } from "@walletconnect/core";
import { Web3Wallet } from "@walletconnect/web3wallet";
import "./ui";
import { ASSETS } from "./assets";

export interface WalletConnectOptions {
  projectId: string;
  relayUrl?: string;
}

export class CasaFamigliaProvider implements CustomProvider {
  private core: InstanceType<typeof Core> | null = null;
  private web3wallet: InstanceType<typeof Web3Wallet> | null = null;
  private options: WalletConnectOptions;
  private pairingUri: string | null = null;

  constructor(options: WalletConnectOptions) {
    this.options = options;
  }

  private async initializeClient(): Promise<InstanceType<typeof Web3Wallet>> {
    if (!this.core) {
      this.core = await Core.init({
        projectId: this.options.projectId,
        relayUrl: this.options.relayUrl,
      });
    }
    if (!this.web3wallet) {
      this.web3wallet = await Web3Wallet.init({
        core: this.core,
        metadata: {
          name: "Casa Famiglia",
          description: "A work in progress",
          url: "https://famiglia.casa/",
          icons: [ASSETS.ICON()],
        },
      });
    }
    return this.web3wallet;
  }

  private renderPrompt() {
    if (this.pairingUri) {
      console.log(`Pairing ${this.pairingUri}`);

      // Check if a modal already exists
      let modal = document.querySelector("casa-connetti-prompt") as HTMLElement;

      if (modal) {
        modal.setAttribute("pairing-uri", this.pairingUri);
      } else {
        modal = document.createElement("casa-connetti-prompt");
        modal.setAttribute("pairing-uri", this.pairingUri);
        document.body.appendChild(modal);
      }
    }
  }

  async connect(): Promise<WalletAccount[]> {
    const client = this.web3wallet || (await this.initializeClient());
    console.info("Client initialized, attempting to connect...");

    try {
      const sessions = client.getActiveSessions();
      console.info("Active sessions:", sessions);

      if (Object.keys(sessions).length === 0) {
        const { uri } = await client.core.pairing.create({
          methods: ["algo_signTxn"],
        });

        this.pairingUri = uri;
        console.info("Pairing URI:", uri);

        this.renderPrompt();

        return [];
      }

      const walletAccounts = Object.values(sessions).map((session, idx) => ({
        address: session.namespaces.algorand.accounts[0],
        name: `Casa Account ${idx + 1}`,
        providerId: "casa-famiglia",
      }));

      return walletAccounts;
    } catch (error) {
      console.error("Error connecting:", error);
      throw error;
    }
  }
}
