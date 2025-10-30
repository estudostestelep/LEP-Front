import { useAuth } from '@/context/authContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  User,
  Mail,
  Building2,
  FolderKanban,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  compact?: boolean;
  className?: string;
}

export const UserMenu = ({ compact = false, className }: UserMenuProps) => {
  const { user, logout, organizationDetails, projectDetails } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Pegar iniciais do nome para o avatar
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-2 hover:bg-accent transition-all duration-200",
            compact ? "h-9 w-9 p-0" : "h-10 px-3",
            className
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {!compact && (
            <>
              <span className="text-sm font-medium hidden sm:inline-block max-w-[120px] truncate">
                {user.name}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[280px] p-2"
        sideOffset={8}
      >
        {/* Cabeçalho com info do usuário */}
        <DropdownMenuLabel className="pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              {user.email && (
                <p className="text-xs text-muted-foreground leading-none flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {user.email}
                </p>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Informações de contexto atual */}
        <div className="px-2 py-3 space-y-2">
          {organizationDetails && (
            <div className="flex items-start gap-2 text-xs">
              <Building2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-muted-foreground">Organização</p>
                <p className="font-medium text-foreground">{organizationDetails.name}</p>
              </div>
            </div>
          )}

          {projectDetails && (
            <div className="flex items-start gap-2 text-xs">
              <FolderKanban className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-muted-foreground">Projeto</p>
                <p className="font-medium text-foreground">{projectDetails.name}</p>
              </div>
            </div>
          )}

          {user.role && (
            <div className="flex items-start gap-2 text-xs">
              <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-muted-foreground">Função</p>
                <p className="font-medium text-foreground capitalize">{user.role}</p>
              </div>
            </div>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Ação de logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 py-2"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
