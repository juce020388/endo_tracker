import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Customers from './pages/Customers';
import DataManagement from './pages/DataManagement';

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/data-management" element={<DataManagement />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default AppRouter;
