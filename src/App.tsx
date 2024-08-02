import { BrowserRouter, Routes, Route } from "react-router-dom";

import All from "@/components/views/All";
import Topic from "@/components/views/Topic";
import Replies from "@/components/views/Replies";

// export const BASE_PATH = "/edaga";
export const BASE_PATH = "";

function App() {
  return (
    <BrowserRouter basename={BASE_PATH}>
      {/* Hardcoded to make react-router-dom work with Github Pages */}
      <Routes>
        <Route index element={<All />} />
        <Route path="replies/:originalTxId" element={<Replies />} />
        <Route path="topic/:topic" element={<Topic />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
