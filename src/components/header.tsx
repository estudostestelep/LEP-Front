import { useAuth } from '@/context/authContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  MenuIcon,
  LogIn,
  Utensils
} from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { user } = useAuth();

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
        {!user && (
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