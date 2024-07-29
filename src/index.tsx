import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@/style/global.css";

// import App from "./App";

import Replies from "@/components/views/Replies";
import Topic from "@/components/views/Topic";
import All from "@/components/views/All";
import ExampleLayout from "@/components/app/ExampleLayout";

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
      path: "topic/:topic",
      element: <Topic />,
    },
    {
      path: "/example-layout/1",
      element: <ExampleLayout.One />,
    },
    {
      path: "/example-layout/2",
      element: <ExampleLayout.Two />,
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
