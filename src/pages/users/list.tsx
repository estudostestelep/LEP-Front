import { useState, useEffect } from "react";
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
  Calendar,
  Loader2,
  AlertCircle
} from "lucide-react";
import { userService, User, CreateUserRequest } from "@/api/userService";
import { AxiosError } from "axios";
import FormModal from "@/components/formModal";
import ConfirmModal from "@/components/confirmModal";
import { useAuth } from "@/context/authContext";


export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  const roles = ["all", ...Array.from(new Set(users.map(u => u.role)))];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      setError(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao carregar usuários"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await userService.remove(userToDelete);
      setUsers(users.filter(u => u.id !== userToDelete));
      setShowConfirm(false);
      setUserToDelete(null);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      alert(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao excluir usuário"
      );
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingUser(null);
    fetchUsers();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    if (!currentUser?.organization_id || !currentUser?.project_id) {
      alert("Erro: dados de organização não encontrados");
      return;
    }

    // Definir permissões padrão baseadas no role
    const getDefaultPermissions = (role: string): string[] => {
      switch (role) {
        case 'admin':
          return ['all'];
        case 'manager':
          return ['users', 'products', 'orders', 'reservations', 'customers'];
        case 'waiter':
          return ['orders', 'reservations', 'customers'];
        case 'kitchen':
          return ['orders'];
        case 'cashier':
          return ['orders'];
        default:
          return [];
      }
    };

    if (editingUser?.id) {
      const updateData = {
        ...values,
        permissions: getDefaultPermissions(String(values.role))
      };
      await userService.update(editingUser.id, updateData as Partial<User>);
    } else {
      const createData: CreateUserRequest = {
        organization_id: currentUser.organization_id,
        project_id: currentUser.project_id,
        name: String(values.name),
        email: String(values.email),
        password: String(values.password || "123456"),
        role: String(values.role),
        permissions: getDefaultPermissions(String(values.role))
      };
      await userService.create(createData);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando usuários...</p>
        </div>
      </div>
    );
  }

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

          <Button
            size="lg"
            className="flex items-center space-x-2"
            onClick={handleNewUser}
          >
            <Plus className="h-4 w-4" />
            <span>Novo Usuário</span>
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchUsers}
                  className="ml-auto"
                >
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => user.id && handleDeleteClick(user.id)}
                    >
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
                      <span className="text-sm">{user.created_at ? formatDate(user.created_at) : 'N/A'}</span>
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

        {/* Modals */}
        <FormModal
          title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
          open={showForm}
          onClose={handleFormCancel}
          fields={[
            { name: 'name', label: 'Nome', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            {
              name: 'role',
              label: 'Função',
              type: 'select',
              required: true,
              options: [
                { value: 'admin', label: 'Administrador' },
                { value: 'manager', label: 'Gerente' },
                { value: 'waiter', label: 'Garçom' },
                { value: 'kitchen', label: 'Cozinha' },
                { value: 'cashier', label: 'Caixa' }
              ]
            },
            { name: 'password', label: 'Senha', type: 'password', required: !editingUser }
          ]}
          initialValues={editingUser ? {
            name: editingUser.name,
            email: editingUser.email,
            role: editingUser.role

          } : {}}
          onSubmit={async (values) => {
            await handleFormSubmit(values);
            handleFormSuccess();
          }}
        />

        <ConfirmModal
          open={showConfirm}
          title="Excluir Usuário"
          message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowConfirm(false);
            setUserToDelete(null);
          }}
        />
      </div>
    </div>
  );
}