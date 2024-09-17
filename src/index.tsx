import './polyfills';

import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "@/style/global.css";

import { ThemeProvider } from "@/ThemeProvider";
import {
  // NetworkId,
  // WalletId,
  // WalletManager,
  WalletProvider,
} from "@txnlab/use-wallet-react";
import { walletManager } from "@/services/wallets";
import { router } from "@/Routes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ThemeProvider>
    <WalletProvider manager={walletManager}>
      <RouterProvider router={router} />
    </WalletProvider>
  </ThemeProvider>
  // </React.StrictMode>
);
