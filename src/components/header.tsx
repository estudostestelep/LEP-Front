import { useAuth } from '@/context/authContext';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { OrganizationProjectSelector } from '@/components/OrganizationProjectSelector';
import { Link } from 'react-router-dom';
import {
  MenuIcon,
  LogIn,
  LogOut,
  Utensils,
  Sun,
  Moon
} from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="bg-background border-b border-border shadow-sm h-16 flex items-center justify-between px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>

        {/* Logo - visible only on mobile when sidebar is hidden */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-primary font-bold text-xl lg:hidden"
        >
          <Utensils className="h-6 w-6" />
          <span>LEP System</span>
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Organization/Project Selector - only when user is logged in */}
        {user && <OrganizationProjectSelector />}

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="h-9 w-9 px-0"
        >
          {resolvedTheme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <span className="sr-only">Alternar tema</span>
        </Button>

        {/* User Section */}
        {user ? (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Olá, {user.name}
            </span>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Sair</span>
            </Button>
          </div>
        ) : (
          <Button asChild variant="default" size="sm">
            <Link to="/login" className="flex items-center space-x-2">
              <LogIn className="h-4 w-4" />
              <span>Entrar</span>
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}