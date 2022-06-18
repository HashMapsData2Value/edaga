import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import theme from "./theme";

import LayoutMain from "./layouts/LayoutMain";
import Main from "./pages/Main";
import Replies from "./pages/Replies";
import Topic from "./pages/Topic";
import NotFound from "./components/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={"/"}>
          <LayoutMain>
            {" "}
            <Routes>
              <Route index element={<Main />} />
              <Route path="replies/:txnId" element={<Replies />} />
              <Route path="topic/:topic" element={<Topic />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LayoutMain>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
