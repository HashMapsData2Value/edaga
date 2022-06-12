import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

import LayoutMain from "./layouts/LayoutMain";
import Main from "./pages/Main";
import NotFound from "./components/NotFound";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LayoutMain>
        <BrowserRouter basename={"/"}>
          {" "}
          {/* Hardcoded to make react-router-dom work with Github Pages */}
          <Routes>
            <Route index element={<Main />} />
            {/* <Route path='replies/:originalTxId' element={<Replies />} />
            <Route path='topic/:topic' element={<Topic />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LayoutMain>
    </ThemeProvider>
  );
}

export default App;
