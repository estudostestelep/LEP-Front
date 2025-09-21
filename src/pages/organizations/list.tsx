import { useEffect, useState } from "react";
import { organizationService, Organization } from "@/api/organizationService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, Building, Plus, Edit, Trash2, Mail, Phone, MapPin, Search } from "lucide-react";
import OrganizationForm from "./form";
import ConfirmModal from "@/components/confirmModal";
import { AxiosError } from "axios";

export default function OrganizationList() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await organizationService.getAll();
      setOrganizations(response.data);
      setFilteredOrganizations(response.data);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      setError(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao carregar organizações"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrganization = () => {
    setEditingOrganization(null);
    setShowForm(true);
  };

  const handleEditOrganization = (organization: Organization) => {
    setEditingOrganization(organization);
    setShowForm(true);
  };

  const handleDeleteClick = (organizationId: string) => {
    setOrganizationToDelete(organizationId);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!organizationToDelete) return;

    try {
      await organizationService.remove(organizationToDelete);
      const updatedOrganizations = organizations.filter(o => o.id !== organizationToDelete);
      setOrganizations(updatedOrganizations);
      setFilteredOrganizations(updatedOrganizations);
      setShowConfirm(false);
      setOrganizationToDelete(null);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      alert(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao excluir organização"
      );
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingOrganization(null);
    fetchOrganizations();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingOrganization(null);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredOrganizations(organizations);
    } else {
      const filtered = organizations.filter(org =>
        org.name.toLowerCase().includes(value.toLowerCase()) ||
        org.description?.toLowerCase().includes(value.toLowerCase()) ||
        org.email?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOrganizations(filtered);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando organizações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
              <Building className="h-8 w-8" />
              <span>Gerenciar Organizações</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie todas as organizações do sistema
            </p>
          </div>

          <Button
            size="lg"
            className="flex items-center space-x-2"
            onClick={handleNewOrganization}
          >
            <Plus className="h-4 w-4" />
            <span>Nova Organização</span>
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar organizações..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

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
                  onClick={fetchOrganizations}
                  className="ml-auto"
                >
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((organization) => (
            <Card key={organization.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{organization.name}</CardTitle>
                      {organization.description && (
                        <CardDescription className="line-clamp-2">
                          {organization.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditOrganization(organization)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteClick(organization.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={organization.active ? "default" : "secondary"}>
                      {organization.active ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>

                  {organization.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {organization.email}
                      </span>
                    </div>
                  )}

                  {organization.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {organization.phone}
                      </span>
                    </div>
                  )}

                  {organization.address && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm text-muted-foreground">
                        {organization.address}
                      </span>
                    </div>
                  )}

                  {organization.created_at && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span>Criada em</span>
                      <span>
                        {new Date(organization.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrganizations.length === 0 && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm ? "Nenhuma organização encontrada" : "Nenhuma organização cadastrada"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ?
                  "Nenhuma organização corresponde à sua busca." :
                  "Comece criando sua primeira organização."
                }
              </p>
              {!searchTerm && (
                <Button onClick={handleNewOrganization}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Organização
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results count */}
        {searchTerm && (
          <div className="text-center text-sm text-muted-foreground mt-4">
            {filteredOrganizations.length} de {organizations.length} organizações encontradas
          </div>
        )}

        {/* Modals */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <OrganizationForm
                initialData={editingOrganization || undefined}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}

        <ConfirmModal
          open={showConfirm}
          title="Excluir Organização"
          message="Tem certeza que deseja excluir esta organização? Esta ação não pode ser desfeita."
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowConfirm(false);
            setOrganizationToDelete(null);
          }}
        />
      </div>
    </div>
  );
}