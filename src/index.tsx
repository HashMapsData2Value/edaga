import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@/style/global.css";

import Replies from "@/components/views/Replies";
import Topic from "@/components/views/Topic";
import All from "@/components/views/All";
import Topics from "@/components/views/Topics";

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
      path: "topics",
      children: [
        {
          path: "",
          element: <Topics />,
        },
        {
          path: ":topic",
          element: <Topic />, // Specific topic page
        },
      ],
    },
  ],
  {
    // Note: not confirmed, but we _may_ be able to remove (GH pages)
    basename: "/edaga",
  }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
