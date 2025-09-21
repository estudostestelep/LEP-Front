import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table as TableIcon,
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Users,
  Loader2,
  AlertCircle
} from "lucide-react";
import { tableService, Table, CreateTableRequest } from "@/api/tableService";
import { useAuth } from "@/context/authContext";
import FormModal from "@/components/formModal";
import ConfirmModal from "@/components/confirmModal";
import { AxiosError } from "axios";

export default function TablesPage() {
  const { user: currentUser } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Table | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const statuses = ["all", "livre", "ocupada", "reservada"];

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.number.toString().includes(searchTerm) ||
      (table.location?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === "all" || table.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await tableService.getAll();
      setTables(response.data);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      setError(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao carregar mesas"
      );
    } finally {
      setLoading(false);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateOrUpdate = async (values: any) => {
    try {
      if (editing) {
        await tableService.update(editing.id!, values);
      } else {
        const createRequest: CreateTableRequest = {
          organization_id: currentUser?.organization_id || "",
          project_id: currentUser?.project_id || "",
          number: parseInt(values.number),
          capacity: parseInt(values.capacity),
          location: values.location,
          status: values.status || "livre"
        };
        await tableService.create(createRequest);
      }
      await fetchTables();
      setOpen(false);
      setEditing(null);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      alert(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao excluir mesa"
      );
    }
  };

  const handleDelete = async () => {
    try {
      if (!toDelete) return;
      await tableService.remove(toDelete);
      setConfirmOpen(false);
      setToDelete(null);
      await fetchTables();
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      alert(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao excluir mesa"
      );
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'livre': return 'default';
      case 'ocupada': return 'destructive';
      case 'reservada': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'livre': return 'Livre';
      case 'ocupada': return 'Ocupada';
      case 'reservada': return 'Reservada';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando mesas...</p>
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
              <TableIcon className="h-8 w-8" />
              <span>Gerenciar Mesas</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie as mesas do restaurante
            </p>
          </div>

          <Button
            size="lg"
            className="flex items-center space-x-2"
            onClick={() => { setEditing(null); setOpen(true); }}
          >
            <Plus className="h-4 w-4" />
            <span>Nova Mesa</span>
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
                  onClick={fetchTables}
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
                    placeholder="Buscar por número ou localização..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {statuses.map(status => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
                    className="capitalize"
                  >
                    {status === "all" ? "Todas" : getStatusLabel(status)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTables.map((table) => (
            <Card key={table.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <TableIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Mesa {table.number}</CardTitle>
                      <CardDescription className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{table.location || 'Sem localização'}</span>
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setEditing(table); setOpen(true); }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setToDelete(table.id!); setConfirmOpen(true); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Capacidade</span>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{table.capacity} pessoas</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={getStatusBadgeVariant(table.status)}>
                      {getStatusLabel(table.status)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTables.length === 0 && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <TableIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm || selectedStatus !== "all"
                  ? "Nenhuma mesa encontrada"
                  : "Nenhuma mesa cadastrada"
                }
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedStatus !== "all"
                  ? "Tente ajustar os filtros de busca."
                  : "Comece cadastrando a primeira mesa do restaurante."
                }
              </p>
              {(!searchTerm && selectedStatus === "all") && (
                <Button onClick={() => { setEditing(null); setOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Mesa
                </Button>
              )}
              {(searchTerm || selectedStatus !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStatus("all");
                  }}
                >
                  Limpar Filtros
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <FormModal
          title={editing ? 'Editar Mesa' : 'Nova Mesa'}
          open={open}
          onClose={() => setOpen(false)}
          fields={[
            { name: 'number', label: 'Número', type: 'number', required: true },
            { name: 'capacity', label: 'Capacidade', type: 'number', required: true },
            { name: 'location', label: 'Localização', type: 'text' },
            {
              name: 'status',
              label: 'Status',
              type: 'select',
              options: [
                { value: 'livre', label: 'Livre' },
                { value: 'ocupada', label: 'Ocupada' },
                { value: 'reservada', label: 'Reservada' }
              ]
            },
          ]}
          initialValues={editing ? {
            number: editing.number,
            capacity: editing.capacity,
            location: editing.location,
            status: editing.status
          } : { status: 'livre' }}
          onSubmit={handleCreateOrUpdate}
        />

        <ConfirmModal
          open={confirmOpen}
          title="Excluir Mesa"
          message="Tem certeza que deseja excluir esta mesa?"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}