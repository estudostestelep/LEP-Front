import { useState } from 'react';
import { useAuth } from '@/context/authContext';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { OrganizationProjectSelector } from '@/components/OrganizationProjectSelector';
import { OrgProjectDrawer } from '@/components/OrgProjectDrawer';
import { UserMenu } from '@/components/UserMenu';
import { Link } from 'react-router-dom';
import {
  MenuIcon,
  LogIn,
  Utensils,
  Sun,
  Moon,
  Building2
} from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showOrgDrawer, setShowOrgDrawer] = useState(false);

  // Resolver tema atual (handle 'system' preference)
  const resolvedTheme = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      <header className="bg-background border-b border-border shadow-sm h-16 flex items-center justify-between px-4 lg:px-6 transition-colors duration-200">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu - Mobile/Tablet only */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden h-9 w-9 p-0 hover:bg-accent transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>

          {/* Logo - Visible only on mobile when sidebar is hidden */}
          <Link
            to="/"
            className="flex items-center gap-2 text-primary font-bold text-xl lg:hidden transition-colors duration-200 hover:text-primary/80"
          >
            <Utensils className="h-6 w-6" />
            <span>LEP System</span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {user && (
            <>
              {/* Desktop: Show full selector (≥768px) */}
              <div className="hidden md:block">
                <OrganizationProjectSelector />
              </div>

              {/* Mobile/Tablet: Show compact button (<768px) */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOrgDrawer(true)}
                className="md:hidden h-9 w-9 p-0 hover:bg-accent transition-colors duration-200"
                aria-label="Selecionar organização/projeto"
              >
                <Building2 className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0 hover:bg-accent transition-colors duration-200"
            aria-label="Alternar tema"
          >
            {resolvedTheme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span className="sr-only">Alternar tema</span>
          </Button>

          {/* User Section */}
          {user ? (
            <>
              {/* Desktop: Show UserMenu with name (≥640px) */}
              <div className="hidden sm:block">
                <UserMenu />
              </div>

              {/* Mobile: Show compact avatar only (<640px) */}
              <div className="sm:hidden">
                <UserMenu compact />
              </div>
            </>
          ) : (
            /* Login Button for non-authenticated users */
            <Button
              asChild
              variant="default"
              size="sm"
              className="transition-all duration-200 hover:scale-105"
            >
              <Link to="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Entrar</span>
              </Link>
            </Button>
          )}
        </div>
      </header>

      {/* Mobile Org/Project Drawer */}
      {user && (
        <OrgProjectDrawer
          open={showOrgDrawer}
          onOpenChange={setShowOrgDrawer}
        />
      )}
    </>
  );
}
