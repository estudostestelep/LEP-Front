import * as React from 'react';
import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { useAuth } from '@/context/authContext';

import Home from '@/pages/home/home';
import Menu from '@/pages/menu/menu';
import Orders from '@/pages/orders/list';
import Reservations from '@/pages/reservations/list';
import ReservationCalendar from '@/pages/reservations/calendar';
import Organizations from '@/pages/organizations/list';
import Projects from '@/pages/projects/list';
import Users from '@/pages/users/list';
import Products from '@/pages/products/list';
import Customers from '@/pages/customers/list';
import Tables from '@/pages/tables/list';
import Login from '@/pages/login/login';
import CreateOrganization from '@/pages/organizations/create';
import PublicMenu from '@/pages/public/menu';
import PublicReservation from '@/pages/public/reservation';

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function AppRoutes() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Verificar se é uma rota pública (sem sidebar/header)
  const isPublicRoute = location.pathname.startsWith('/cardapio/') ||
                       location.pathname.startsWith('/reserva/');

  // Layout para rotas públicas (sem sidebar/header)
  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/cardapio/:orgId/:projId" element={<PublicMenu />} />
          <Route path="/reserva/:orgId/:projId" element={<PublicReservation />} />
        </Routes>
      </div>
    );
  }

  // Layout padrão com sidebar/header
  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu/:orgId/:projId" element={<Menu />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-organization" element={<CreateOrganization />} />

              {/* Rotas protegidas */}
              <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
              <Route path="/reservations" element={<PrivateRoute><Reservations /></PrivateRoute>} />
              <Route path="/reservations/calendar" element={<PrivateRoute><ReservationCalendar /></PrivateRoute>} />
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