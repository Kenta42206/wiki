import { useState } from "react";

import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Root from "./components/Root";
import Page from "./components/Page/Page";
import Home from "./components/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="/pages/:title" element={<Page />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
