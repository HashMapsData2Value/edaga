// Polyfill for `global`
window.global = window;

// Polyfill for `Buffer`
import { Buffer } from "buffer";
window.Buffer = Buffer;

import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@/style/global.css";

import Replies from "@/components/views/Replies";
import Topic from "@/components/views/Topic";
import All from "@/components/views/All";
import Topics from "@/components/views/Topics";
import { ThemeProvider } from "@/ThemeProvider";
import {
  // NetworkId,
  // WalletId,
  // WalletManager,
  WalletProvider,
} from "@txnlab/use-wallet-react";
import { walletManager } from "@/services/wallets";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <All />,
    },
    {
      path: "replies/:originalTxId",
      element: <Replies />,
    },
    {
      path: "topics/",
      element: <Topics />,
      children: [
        {
          path: ":topic",
          element: <Topic />,
        },
      ],
    },
  ],
  {
    basename: "",
  }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ThemeProvider>
    <WalletProvider manager={walletManager}>
      <RouterProvider router={router} />
    </WalletProvider>
  </ThemeProvider>
  // </React.StrictMode>
);
