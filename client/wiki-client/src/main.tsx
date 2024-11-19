import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Home.tsx";
import Page from "./pages/page/Page.tsx";
import PageSeachResult from "./pages/page/PageSeachResult.tsx";
import PageCreateForm from "./pages/page/PageCreateForm.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pages/:title" element={<Page />} />
          <Route path="/pages/" element={<PageSeachResult />} />
          <Route path="/pages/create" element={<PageCreateForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
