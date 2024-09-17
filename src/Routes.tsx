import { createBrowserRouter } from "react-router-dom";

import { TransactionProvider } from "@/context/TransactionContext";

import All from "@/components/views/All";
import Replies from "@/components/views/Replies";
import Topics from "@/components/views/Topics";
// import Topic from "@/components/views/Topic";

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
          path: "replies/:originalTxId",
          element: (
            <TransactionProvider>
              <Replies />
            </TransactionProvider>
          ),
        },
      ],
      // TODO - Topics sub-view
      // children: [
      //   {
      //     path: ":topic",
      //     element: (
      //       <TransactionProvider>
      //         <Topic />
      //       </TransactionProvider>
      //     ),
      //   },
      // ],
    },
  ],
  {
    basename: "",
  }
);
