import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Customers from "./pages/Customers";
import DataManagement from "./pages/DataManagement";
import ProcedureTypes from "./pages/ProcedureTypes";

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/data-management" element={<DataManagement />} />
        <Route path="/procedure-types" element={<ProcedureTypes />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default AppRouter;
