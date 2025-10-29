import * as React from 'react';
import { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { useAuth } from '@/context/authContext';
import PageLoadingSpinner from '@/components/PageLoadingSpinner';

// Eager loading - Critical pages for initial load
import Home from '@/pages/home/home';
import Login from '@/pages/login/login';
import NotFound from '@/pages/not-found/not-found';

// Lazy loading - All other pages
const Menu = lazy(() => import('@/pages/menu/menu'));
const Orders = lazy(() => import('@/pages/orders/list'));
const Reservations = lazy(() => import('@/pages/reservations/list'));
const ReservationCalendar = lazy(() => import('@/pages/reservations/calendar'));
const Organizations = lazy(() => import('@/pages/organizations/list'));
const Projects = lazy(() => import('@/pages/projects/list'));
const Users = lazy(() => import('@/pages/users/list'));
const Products = lazy(() => import('@/pages/products/list'));
const Customers = lazy(() => import('@/pages/customers/list'));
const Tables = lazy(() => import('@/pages/tables/list'));
const Tags = lazy(() => import('@/pages/tags'));
const AdminMenu = lazy(() => import('@/pages/admin-menu'));
const Categories = lazy(() => import('@/pages/admin-menu/categories'));
const CategoryProducts = lazy(() => import('@/pages/admin-menu/category-products'));
const Settings = lazy(() => import('@/pages/settings'));
const CreateOrganization = lazy(() => import('@/pages/organizations/create'));
const PublicMenu = lazy(() => import('@/pages/public/menu'));
const PublicReservation = lazy(() => import('@/pages/public/reservation'));

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function MasterAdminRoute({ children }: { children: React.ReactElement }) {
  const { user } = useAuth();
  const isMasterAdmin = user?.permissions?.includes('master_admin');

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isMasterAdmin) {
    return <Navigate to="/" />;
  }

  return children;
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
        <Suspense fallback={<PageLoadingSpinner />}>
          <Routes>
            <Route path="/cardapio/:orgId/:projId" element={<PublicMenu />} />
            <Route path="/reserva/:orgId/:projId" element={<PublicReservation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
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
            <Suspense fallback={<PageLoadingSpinner />}>
              <Routes>
                {/* Eager routes - No suspense needed */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                {/* Lazy routes - Menu público */}
                <Route path="/menu" element={<Menu />} />

                {/* Lazy routes - Rotas protegidas */}
                <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
                <Route path="/reservations" element={<PrivateRoute><Reservations /></PrivateRoute>} />
                <Route path="/reservations/calendar" element={<PrivateRoute><ReservationCalendar /></PrivateRoute>} />
                <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
                <Route path="/tables" element={<PrivateRoute><Tables /></PrivateRoute>} />
                <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
                <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                <Route path="/tags" element={<PrivateRoute><Tags /></PrivateRoute>} />
                <Route path="/admin-menu" element={<PrivateRoute><AdminMenu /></PrivateRoute>} />
                <Route path="/admin-menu/:menuId/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
                <Route path="/admin-menu/:menuId/categories/:categoryId/products" element={<PrivateRoute><CategoryProducts /></PrivateRoute>} />
                <Route path="/create-organization" element={<CreateOrganization />} />

                {/* Lazy routes - Rotas restritas para Master Admin */}
                <Route path="/organizations" element={<MasterAdminRoute><Organizations /></MasterAdminRoute>} />
                <Route path="/projects" element={<MasterAdminRoute><Projects /></MasterAdminRoute>} />

                {/* Rota catch-all para páginas não encontradas */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
