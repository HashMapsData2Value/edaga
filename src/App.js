import React from 'react';
import { Grommet } from 'grommet';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import All from './All';
import Topic from './Topic';
import Replies from './Replies';

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

function App() { 
  return (
    <Grommet theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route index element={<All />} />
          <Route path="replies/:txId" element={<Replies />} />
          <Route path="topic/:topic" element={<Topic />} />
        </Routes>
      </BrowserRouter>
    </Grommet>
  );
}

export default App;