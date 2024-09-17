import { CustomProvider, WalletAccount } from "@txnlab/use-wallet";
import { Core } from "@walletconnect/core";
import { Web3Wallet, Web3WalletTypes } from "@walletconnect/web3wallet";
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
  private accountAddress: string | null = null;

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

      this.setupEventListeners(); // Ensure event listeners are set up after initialization
    }
    return this.web3wallet;
  }

  private setupEventListeners() {
    if (this.web3wallet) {
      this.web3wallet.on(
        "session_proposal",
        this.handleSessionProposal.bind(this)
      );
      this.web3wallet.on(
        "session_request",
        this.handleSessionRequest.bind(this)
      );
      this.web3wallet.on("session_delete", this.handleSessionDelete.bind(this));

      console.log("Event listeners set up successfully.");
    }
  }

  private handleSessionProposal(
    proposal: Web3WalletTypes.SessionProposal
  ): void {
    console.log("Session Proposal Received:", proposal);

    const requiredNamespace = proposal.params.requiredNamespaces["algorand"];
    console.log("Required Namespace:", requiredNamespace);

    const accountAddress = this.accountAddress;

    const algorandNamespace = {
      accounts: [`${requiredNamespace.chains![0]}:${accountAddress}`],
      methods: ["algo_signTxn"],
      events: [],
    };

    this.web3wallet
      ?.approveSession({
        id: proposal.id,
        namespaces: {
          algorand: algorandNamespace,
        },
      })
      .then(() => {
        console.log("Session approved.");
        this.emit("accountsChanged", [accountAddress]);
      })
      .catch((error) => {
        console.error("Failed to approve session:", error);
      });
  }

  private handleSessionRequest(request: Web3WalletTypes.SessionRequest): void {
    console.log("Session Request Received:", request);
    // Implement handling of session requests (e.g., signing transactions)
  }

  private handleSessionDelete(event: unknown): void {
    console.log("Session Deleted:", event);
    this.emit("disconnect", { reason: "User disconnected" });
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

      const walletAccounts = Object.values(sessions).map((session, idx) => {
        const address = session.namespaces.algorand.accounts[0];
        this.accountAddress = address;

        return {
          address,
          name: `Casa Account ${idx + 1}`,
          providerId: "casa-famiglia",
        };
      });

      return walletAccounts;
    } catch (error) {
      console.error("Error connecting:", error);
      throw error;
    }
  }

  private emit<T>(event: string, data: T): void {
    const customEvent = new CustomEvent(event, { detail: data });
    window.dispatchEvent(customEvent);
  }

  async disconnect(): Promise<void> {
    if (this.web3wallet) {
      const sessions = this.web3wallet.getActiveSessions();
      const sessionTopics = Object.keys(sessions);

      if (sessionTopics.length > 0) {
        const topic = sessionTopics[0];
        await this.web3wallet.disconnectSession({
          reason: {
            code: 6000, // TODO - Confirm error code
            message: "User disconnected",
          },
          topic,
        });
        this.web3wallet = null;
        console.info("Wallet disconnected.");
        this.emit("disconnect", { topic });
      }
    }
  }
}
