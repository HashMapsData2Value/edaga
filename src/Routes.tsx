import { createBrowserRouter } from "react-router-dom";

import { TransactionProvider } from "@/context/TransactionContext";

import Replies from "@/components/views/Replies";
import Topic from "@/components/views/Topic";
import All from "@/components/views/All";
import Topics from "@/components/views/Topics";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <TransactionProvider>
          <All />
        </TransactionProvider>
      ),
    },
    {
      path: "replies/:originalTxId",
      element: (
        <TransactionProvider>
          <Replies />
        </TransactionProvider>
      ),
    },
    {
      path: "topics/",
      element: (
        <TransactionProvider>
          <Topics />
        </TransactionProvider>
      ),
      children: [
        {
          path: ":topic",
          element: (
            <TransactionProvider>
              <Topic />
            </TransactionProvider>
          ),
        },
      ],
    },
  ],
  {
    basename: "",
  }
);
