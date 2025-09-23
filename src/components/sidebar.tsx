import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Menu,
  ShoppingCart,
  Users,
  Package,
  LogOut,
  Utensils,
  Building,
  FolderOpen,
  Calendar,
  UserCheck,
  TableProperties,
  MenuIcon,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null && !isMobile) {
      setIsOpen(JSON.parse(savedState));
    }
  }, [setIsOpen, isMobile]);

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('sidebarOpen', JSON.stringify(isOpen));
    }
  }, [isOpen, isMobile]);

  const publicMenuItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/menu', icon: Menu, label: 'Menu' }
  ];

  const privateMenuItems = [
    { to: '/orders', icon: ShoppingCart, label: 'Pedidos' },
    { to: '/reservations', icon: Calendar, label: 'Reservas' },
    { to: '/customers', icon: UserCheck, label: 'Clientes' },
    { to: '/tables', icon: TableProperties, label: 'Mesas' },
    { to: '/products', icon: Package, label: 'Produtos' },
    { to: '/users', icon: Users, label: 'Usuários' },
    { to: '/organizations', icon: Building, label: 'Organizações' },
    { to: '/projects', icon: FolderOpen, label: 'Projetos' }
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: isMobile ? "-100%" : "-240px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`
          fixed left-0 top-0 h-full bg-background border-r border-border shadow-lg z-50
          w-64 flex flex-col
          ${isMobile ? '' : 'lg:relative lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link
            to="/"
            className="flex items-center space-x-2 text-primary font-bold text-xl"
            onClick={closeSidebarOnMobile}
          >
            <Utensils className="h-6 w-6" />
            <span>LEP System</span>
          </Link>

          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {/* Public Routes */}
            {publicMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeSidebarOnMobile}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Divider */}
            {user && (
              <div className="my-4 border-t border-border"></div>
            )}

            {/* Private Routes */}
            {user && privateMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeSidebarOnMobile}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        {user && (
          <div className="border-t border-border p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="w-full flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
        )}
      </motion.aside>
    </>
  );
}