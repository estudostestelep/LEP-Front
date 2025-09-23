import { Link } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import { Button } from '@/components/ui/button';
import {
  Home,
  Menu,
  ShoppingCart,
  Users,
  Package,
  LogIn,
  LogOut,
  Utensils,
  Building,
  FolderOpen,
  Calendar,
  UserCheck,
  TableProperties
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-xl">
              <Utensils className="h-6 w-6" />
              <span>LEP System</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/menu"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Menu className="h-4 w-4" />
                <span>Menu</span>
              </Link>
              {user && (
                <>
                  <Link
                    to="/orders"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Pedidos</span>
                  </Link>
                  <Link
                    to="/reservations"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Reservas</span>
                  </Link>
                  <Link
                    to="/customers"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>Clientes</span>
                  </Link>
                  <Link
                    to="/tables"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <TableProperties className="h-4 w-4" />
                    <span>Mesas</span>
                  </Link>
                  <Link
                    to="/products"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Package className="h-4 w-4" />
                    <span>Produtos</span>
                  </Link>
                  <Link
                    to="/users"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Users className="h-4 w-4" />
                    <span>Usuários</span>
                  </Link>
                  <Link
                    to="/organizations"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Building className="h-4 w-4" />
                    <span>Organizações</span>
                  </Link>
                  <Link
                    to="/projects"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FolderOpen className="h-4 w-4" />
                    <span>Projetos</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  );
}