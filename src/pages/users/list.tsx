import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Shield,
  Calendar
} from "lucide-react";
import { mockUsers, User } from "@/lib/mock-data";

export default function UsersList() {
  const [users] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const roles = ["all", ...Array.from(new Set(users.map(u => u.role)))];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'manager': return 'secondary';
      case 'waiter': return 'outline';
      case 'chef': return 'destructive';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
              <Users className="h-8 w-8" />
              <span>Gerenciar Usuários</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie os usuários do sistema e suas permissões
            </p>
          </div>

          <Button size="lg" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Novo Usuário</span>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {roles.map(role => (
                  <Button
                    key={role}
                    variant={selectedRole === role ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRole(role)}
                    className="capitalize"
                  >
                    {role === "all" ? "Todos" : role}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Função</span>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                      {user.role}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Permissões</span>
                    <div className="flex items-center space-x-1">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {user.permissions.includes('all') ? 'Todas' : user.permissions.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cadastro</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(user.createdAt)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.slice(0, 3).map(permission => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {user.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.permissions.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum usuário encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Não encontramos usuários com os filtros aplicados.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRole("all");
                }}
                variant="outline"
              >
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}