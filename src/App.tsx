import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '@/components/navbar';
import { useAuth } from '@/context/authContext';

import Home from '@/pages/home/home';
import Menu from '@/pages/menu/menu';
//import Orders from '@/pages/orders/list';
import Users from '@/pages/users/list';
import Products from '@/pages/products/list';
import Customers from '@/pages/customers/list';
import Tables from '@/pages/tables/list';
import Login from '@/pages/login/login';

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        {/* Rotas protegidas */}
        {/* <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} /> */}
        <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
        <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
        <Route path="/tables" element={<PrivateRoute><Tables /></PrivateRoute>} />
      </Routes>
    </>
  );
}