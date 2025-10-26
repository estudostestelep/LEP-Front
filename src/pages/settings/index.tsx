import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { DiagnosticPanel } from "@/components/DiagnosticPanel";
import { ImageManagementSection } from "@/components/ImageManagementSection";
import {
  Settings as SettingsIcon,
  Building,
  FolderOpen,
  User,
  Mail,
  Shield,
  Calendar,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";

export default function Settings() {
  const {
    user,
    currentOrganization,
    currentProject,
    organizationDetails,
    projectDetails,
    organizations,
    projects,
    setCurrentOrganization,
    setCurrentProject
  } = useAuth();

  const [loadingOrg, setLoadingOrg] = useState(false);
  const [loadingProj, setLoadingProj] = useState(false);

  // Os dados de org e projeto já são carregados pelo AuthContext
  // Não precisamos de useEffect aqui, apenas funções de reload manual

  // Busca nome da organização atual das relações como fallback
  const currentOrgRelation = organizations.find(
    org => org.organization_id === currentOrganization
  );

  // Busca nome do projeto atual das relações como fallback
  const currentProjRelation = projects.find(
    proj => proj.project_id === currentProject
  );

  // Usa organizationDetails se disponível, senão usa dados da relação
  const displayOrgName = organizationDetails?.name || currentOrgRelation?.organization_name || 'Carregando...';
  const displayProjName = projectDetails?.name || currentProjRelation?.project_name || 'Carregando...';

  const handleReloadOrg = async () => {
    if (!currentOrganization) return;
    setLoadingOrg(true);
    try {
      await setCurrentOrganization(currentOrganization);
    } catch (error) {
      console.error("Erro ao recarregar organização:", error);
    } finally {
      setLoadingOrg(false);
    }
  };

  const handleReloadProj = async () => {
    if (!currentProject) return;
    setLoadingProj(true);
    try {
      await setCurrentProject(currentProject);
    } catch (error) {
      console.error("Erro ao recarregar projeto:", error);
    } finally {
      setLoadingProj(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <SettingsIcon className="h-8 w-8" />
            <span>Configurações do Sistema</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Informações sobre organização, projeto e usuário logado
          </p>
        </div>

        {/* Diagnostic Panel */}
        <DiagnosticPanel />

        {/* Image Management Section */}
        <div className="mb-6">
          <ImageManagementSection />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Usuário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Usuário Logado</span>
              </CardTitle>
              <CardDescription>Suas informações de conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 pb-3 border-b">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{user.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">ID do Usuário</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{user.id}</code>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Função</span>
                      <Badge variant="default" className="capitalize">
                        {user.role || 'member'}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Permissões</span>
                      <div className="flex items-center space-x-1">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {user.permissions?.includes('all') || user.permissions?.includes('master_admin')
                            ? 'Todas'
                            : user.permissions?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={user.active ? "default" : "destructive"} className="flex items-center space-x-1">
                        {user.active ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            <span>Ativo</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3" />
                            <span>Inativo</span>
                          </>
                        )}
                      </Badge>
                    </div>

                    {user.created_at && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Cadastrado em</span>
                        <span className="text-sm flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(user.created_at)}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Permissões Detalhadas */}
                  {user.permissions && user.permissions.length > 0 && (
                    <div className="pt-3 border-t">
                      <p className="text-sm font-medium mb-2">Permissões Específicas:</p>
                      <div className="flex flex-wrap gap-2">
                        {user.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                  <p>Usuário não autenticado</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações da Organização */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>Organização Atual</span>
                  </CardTitle>
                  <CardDescription>Detalhes da organização selecionada</CardDescription>
                </div>
                {currentOrganization && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReloadOrg}
                    disabled={loadingOrg}
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingOrg ? 'animate-spin' : ''}`} />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentOrganization ? (
                <>
                  <div className="flex items-center space-x-3 pb-3 border-b">
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Building className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{displayOrgName}</p>
                      <p className="text-sm text-muted-foreground">
                        {organizationDetails?.description || 'Sem descrição'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">ID da Organização</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{currentOrganization}</code>
                    </div>

                    {organizationDetails?.email && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Email</span>
                        <span className="text-sm flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{organizationDetails.email}</span>
                        </span>
                      </div>
                    )}

                    {organizationDetails?.phone && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Telefone</span>
                        <span className="text-sm">{organizationDetails.phone}</span>
                      </div>
                    )}

                    {organizationDetails?.address && (
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">Endereço</span>
                        <span className="text-sm text-right max-w-xs">{organizationDetails.address}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={organizationDetails?.active ? "default" : "destructive"}>
                        {organizationDetails?.active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>

                    {organizationDetails?.created_at && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Criada em</span>
                        <span className="text-sm flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(organizationDetails.created_at)}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Total de organizações do usuário */}
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      Você tem acesso a <strong>{organizations.length}</strong> organização(ões)
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                  <p>Nenhuma organização selecionada</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações do Projeto */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <FolderOpen className="h-5 w-5" />
                    <span>Projeto Atual</span>
                  </CardTitle>
                  <CardDescription>Detalhes do projeto selecionado</CardDescription>
                </div>
                {currentProject && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReloadProj}
                    disabled={loadingProj}
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingProj ? 'animate-spin' : ''}`} />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {currentProject ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 pb-3 border-b">
                      <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <FolderOpen className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-lg">{displayProjName}</p>
                        <p className="text-sm text-muted-foreground">
                          {projectDetails?.description || 'Sem descrição'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">ID do Projeto</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{currentProject}</code>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge variant={projectDetails?.active ? "default" : "destructive"}>
                          {projectDetails?.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>

                      {projectDetails?.created_at && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Criado em</span>
                          <span className="text-sm flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(projectDetails.created_at)}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Estatísticas ou informações adicionais */}
                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-medium mb-3 text-sm">Informações Adicionais</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Organização pai</span>
                          <span className="font-medium">{displayOrgName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total de projetos</span>
                          <span className="font-medium">{projects.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                  <p>Nenhum projeto selecionado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
