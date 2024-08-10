import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@/style/global.css";

import Replies from "@/components/views/Replies";
import Topic from "@/components/views/Topic";
import All from "@/components/views/All";
import Topics from "@/components/views/Topics";
import { ThemeProvider } from "@/ThemeProvider";

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
    <RouterProvider router={router} />
  </ThemeProvider>
  // </React.StrictMode>
);
