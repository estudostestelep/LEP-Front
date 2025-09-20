import * as React from 'react';
import FormModal from '@/components/formModal';
import ConfirmModal from '@/components/confirmModal';
import { customerService, Customer, CreateCustomerRequest } from '@/api/customerService';
import { useAuth } from '@/context/authContext';
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
//import { Badge } from "@/components/ui/badge";
import { AxiosError } from "axios";
import {
  Loader2,
  AlertCircle,
  Users,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar
} from "lucide-react";

export default function CustomersPage() {
  const { user: currentUser } = useAuth();
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Customer | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await customerService.getAll();
      setCustomers(res.data);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      setError(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao carregar clientes"
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { load(); }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateOrUpdate = async (values: any) => {
    try {
      if (editing) {
        await customerService.update(editing.id!, values);
      } else {
        const createRequest: CreateCustomerRequest = {
          organization_id: currentUser?.orgId || "",
          project_id: currentUser?.projectId || "",
          name: values.name,
          email: values.email,
          phone: values.phone,
          birth_date: values.birth_date,
        };
        await customerService.create(createRequest);
      }
      await load();
      setOpen(false);
      setEditing(null);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      alert(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        axiosErr.message ||
        "Erro ao excluir cliente"
      );
    }
  };

  const handleDelete = async () => {
    try {
      if (!toDelete) return;
      await customerService.remove(toDelete);
      setConfirmOpen(false);
      setToDelete(null);
      await load();

    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      alert(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        axiosErr.message ||
        "Erro ao excluir cliente"
      );
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando clientes...</p>
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
              <span>Gerenciar Clientes</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie os clientes do restaurante
            </p>
          </div>

          <Button
            size="lg"
            className="flex items-center space-x-2"
            onClick={() => { setEditing(null); setOpen(true); }}
          >
            <Plus className="h-4 w-4" />
            <span>Novo Cliente</span>
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
                  onClick={load}
                  className="ml-auto"
                >
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}


        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{customer.email || 'Sem email'}</span>
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setEditing(customer); setOpen(true); }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setToDelete(customer.id!); setConfirmOpen(true); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Telefone</span>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                  </div>

                  {customer.birth_date && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Aniversário</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(customer.birth_date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  )}

                  {customer.created_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Cadastro</span>
                      <span className="text-sm">
                        {new Date(customer.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>

      {/* Empty State */}
      {customers.length === 0 && !error && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum cliente cadastrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Comece cadastrando seu primeiro cliente.
            </p>
            <Button onClick={() => { setEditing(null); setOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </CardContent>
        </Card>
      )}

      <FormModal
        title={editing ? 'Editar Cliente' : 'Novo Cliente'}
        open={open}
        onClose={() => setOpen(false)}
        fields={[
          { name: 'name', label: 'Nome', required: true },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'phone', label: 'Telefone', type: 'tel', required: true },
          { name: 'birth_date', label: 'Data de Nascimento', type: 'date' },
        ]}
        initialValues={editing ?? {}}
        onSubmit={handleCreateOrUpdate}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Excluir Cliente"
        message="Tem certeza que deseja excluir este cliente?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>

  );
}