import * as React from 'react';
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { useAuth } from '@/context/authContext';

import Home from '@/pages/home/home';
import Menu from '@/pages/menu/menu';
import Orders from '@/pages/orders/list';
import Reservations from '@/pages/reservations/list';
import Organizations from '@/pages/organizations/list';
import Projects from '@/pages/projects/list';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/login" element={<Login />} />
              {/* Rotas protegidas */}
              <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
              <Route path="/reservations" element={<PrivateRoute><Reservations /></PrivateRoute>} />
              <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
              <Route path="/tables" element={<PrivateRoute><Tables /></PrivateRoute>} />
              <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
              <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
              <Route path="/organizations" element={<PrivateRoute><Organizations /></PrivateRoute>} />
              <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}