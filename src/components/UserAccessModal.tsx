import { useState, useEffect } from "react";
import { User, userService } from "@/api/userService";
import { Organization } from "@/api/organizationService";
import { Project } from "@/api/projectService";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, Building, FolderOpen, X, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { AxiosError } from "axios";

interface UserAccessModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  allOrganizations: Organization[];
  allProjects: Project[];
}

export default function UserAccessModal({
  user,
  open,
  onClose,
  onSuccess,
  allOrganizations,
  allProjects
}: UserAccessModalProps) {
  const { user: currentUser, currentOrganization, currentProject, refreshUserAccess } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Estados de seleção
  const [selectedOrgIds, setSelectedOrgIds] = useState<string[]>([]);
  const [selectedProjIds, setSelectedProjIds] = useState<string[]>([]);

  // Estados iniciais para detectar mudanças
  const [initialOrgIds, setInitialOrgIds] = useState<string[]>([]);
  const [initialProjIds, setInitialProjIds] = useState<string[]>([]);

  // Estados de busca/filtro
  const [orgSearch, setOrgSearch] = useState("");
  const [projSearch, setProjSearch] = useState("");

  // Carrega os acessos atuais do usuário
  const loadUserAccess = async () => {
    if (!user.id) return;

    try {
      setLoading(true);
      setError("");
      const response = await userService.getUserAccess(user.id);

      const orgIds = response.data.organizations.map(o => o.organization_id);
      const projIds = response.data.projects.map(p => p.project_id);

      setSelectedOrgIds(orgIds);
      setSelectedProjIds(projIds);
      setInitialOrgIds(orgIds);
      setInitialProjIds(projIds);
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      setError(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao carregar acessos do usuário"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && user.id) {
      loadUserAccess();
      setSuccessMessage("");
    }
  }, [open, user.id]);

  // Filtros
  const filteredOrgs = allOrganizations.filter(org =>
    org.name.toLowerCase().includes(orgSearch.toLowerCase())
  );

  // Filtrar projetos: mostrar projetos das orgs selecionadas OU todos se nenhuma org selecionada
  const filteredProjs = allProjects.filter(proj => {
    const matchesSearch = proj.name.toLowerCase().includes(projSearch.toLowerCase());

    // Se nenhuma organização selecionada, mostra TODOS os projetos para facilitar seleção
    if (selectedOrgIds.length === 0) return matchesSearch;

    // Caso contrário, mostra apenas projetos das orgs selecionadas
    const belongsToSelectedOrg = selectedOrgIds.includes(proj.organization_id);
    return belongsToSelectedOrg && matchesSearch;
  });

  // Detecta mudanças
  const hasChanges = () => {
    const orgsChanged = JSON.stringify([...selectedOrgIds].sort()) !== JSON.stringify([...initialOrgIds].sort());
    const projsChanged = JSON.stringify([...selectedProjIds].sort()) !== JSON.stringify([...initialProjIds].sort());
    return orgsChanged || projsChanged;
  };

  // Handlers de seleção
  const toggleOrg = (orgId: string) => {
    setSelectedOrgIds(prev => {
      const isRemoving = prev.includes(orgId);

      if (isRemoving) {
        // Se está removendo a org, remover também todos os projetos dela
        const projectsOfOrg = allProjects
          .filter(p => p.organization_id === orgId)
          .map(p => p.id);

        setSelectedProjIds(currentProjs =>
          currentProjs.filter(projId => !projectsOfOrg.includes(projId))
        );

        return prev.filter(id => id !== orgId);
      } else {
        // Se está adicionando a org
        return [...prev, orgId];
      }
    });
  };

  const toggleProj = (projId: string) => {
    const isAdding = !selectedProjIds.includes(projId);

    setSelectedProjIds(prev =>
      prev.includes(projId)
        ? prev.filter(id => id !== projId)
        : [...prev, projId]
    );

    // ✨ Smart: se está adicionando um projeto, automaticamente adiciona sua org
    if (isAdding) {
      const proj = allProjects.find(p => p.id === projId);
      if (proj && !selectedOrgIds.includes(proj.organization_id)) {
        setSelectedOrgIds(prev => [...prev, proj.organization_id]);
      }
    }
  };

  const selectAllOrgs = () => {
    setSelectedOrgIds(filteredOrgs.map(o => o.id));
  };

  const deselectAllOrgs = () => {
    setSelectedOrgIds([]);
  };

  const selectAllProjs = () => {
    setSelectedProjIds(filteredProjs.map(p => p.id));
  };

  const deselectAllProjs = () => {
    setSelectedProjIds([]);
  };

  // Salvar alterações
  const handleSave = async () => {
    if (!user.id) return;

    // ✅ PROTEÇÃO: Verificar se está removendo org/proj atual do próprio usuário
    const isSelf = currentUser?.id === user.id;
    if (isSelf) {
      if (currentOrganization && !selectedOrgIds.includes(currentOrganization)) {
        setError('❌ Você não pode remover a organização na qual está logado atualmente');
        return;
      }
      if (currentProject && !selectedProjIds.includes(currentProject)) {
        setError('❌ Você não pode remover o projeto no qual está logado atualmente');
        return;
      }
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const response = await userService.updateUserAccess(user.id, {
        organization_ids: selectedOrgIds,
        project_ids: selectedProjIds
      });

      setSuccessMessage(
        `✓ ${response.data.organizations_added} org(s) adicionada(s), ` +
        `${response.data.organizations_removed} removida(s) | ` +
        `${response.data.projects_added} proj(s) adicionado(s), ` +
        `${response.data.projects_removed} removido(s)`
      );

      // Atualizar estados iniciais
      setInitialOrgIds([...selectedOrgIds]);
      setInitialProjIds([...selectedProjIds]);

      // ✅ NOVO: Recarregar acessos se for o próprio usuário
      if (isSelf) {
        console.log('Recarregando acessos após auto-modificação');
        await refreshUserAccess();
      }

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      setError(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao salvar alterações"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-card rounded-lg shadow-2xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="text-xl font-semibold">Gerenciar Acessos</h3>
            <p className="text-sm text-muted-foreground">
              Usuário: <strong>{user.name}</strong> ({user.email})
            </p>
          </div>
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-md bg-green-500/10 border border-green-500/20 flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-400">{successMessage}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organizações */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <Building className="h-5 w-5" />
                    <span>Organizações</span>
                  </CardTitle>
                  <CardDescription>
                    <Badge variant="secondary" className="mt-1">
                      {selectedOrgIds.length} de {allOrganizations.length} selecionadas
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar organizações..."
                      value={orgSearch}
                      onChange={(e) => setOrgSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={selectAllOrgs}
                      className="flex-1"
                    >
                      Selecionar Todos
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={deselectAllOrgs}
                      className="flex-1"
                    >
                      Limpar
                    </Button>
                  </div>

                  {/* List */}
                  <div className="border border-input rounded-md p-3 max-h-80 overflow-y-auto bg-background">
                    {filteredOrgs.length > 0 ? (
                      filteredOrgs.map((org) => {
                        const projectsCount = allProjects.filter(p => p.organization_id === org.id).length;
                        const isSelf = currentUser?.id === user.id;
                        const isCurrentOrg = isSelf && org.id === currentOrganization;
                        const isDisabled = isCurrentOrg;

                        return (
                          <label
                            key={org.id}
                            className={`flex items-center space-x-3 py-2 px-2 rounded transition-colors ${isDisabled
                                ? 'bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 cursor-not-allowed'
                                : 'hover:bg-muted cursor-pointer'
                              }`}
                            title={isDisabled ? 'Esta é a organização na qual você está logado atualmente' : ''}
                          >
                            <input
                              type="checkbox"
                              checked={selectedOrgIds.includes(org.id)}
                              onChange={() => !isDisabled && toggleOrg(org.id)}
                              disabled={isDisabled}
                              className="rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium">{org.name}</p>
                                  {isCurrentOrg && (
                                    <Badge variant="default" className="text-xs bg-blue-600">
                                      <Lock className="h-3 w-3 mr-1" />
                                      Atual
                                    </Badge>
                                  )}
                                </div>
                                {projectsCount > 0 && (
                                  <Badge variant="secondary" className="text-xs ml-2">
                                    {projectsCount} {projectsCount === 1 ? 'projeto' : 'projetos'}
                                  </Badge>
                                )}
                              </div>
                              {org.description && (
                                <p className="text-xs text-muted-foreground">{org.description}</p>
                              )}
                            </div>
                          </label>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma organização encontrada
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Projetos */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <FolderOpen className="h-5 w-5" />
                    <span>Projetos</span>
                  </CardTitle>
                  <CardDescription className="space-y-1">
                    <Badge variant="secondary" className="mt-1">
                      {selectedProjIds.length} de {allProjects.length} selecionados
                    </Badge>
                    {selectedOrgIds.length === 0 && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        💡 Selecione projetos diretamente (suas orgs serão adicionadas automaticamente)
                      </p>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar projetos..."
                      value={projSearch}
                      onChange={(e) => setProjSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={selectAllProjs}
                      className="flex-1"
                    >
                      Selecionar Todos
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={deselectAllProjs}
                      className="flex-1"
                    >
                      Limpar
                    </Button>
                  </div>

                  {/* List */}
                  <div className="border border-input rounded-md p-3 max-h-80 overflow-y-auto bg-background">
                    {filteredProjs.length > 0 ? (
                      filteredProjs.map((proj) => {
                        const orgName = allOrganizations.find(o => o.id === proj.organization_id)?.name;
                        const isSelf = currentUser?.id === user.id;
                        const isCurrentProj = isSelf && proj.id === currentProject;
                        const isDisabled = isCurrentProj;

                        return (
                          <label
                            key={proj.id}
                            className={`flex items-center space-x-3 py-2 px-2 rounded transition-colors ${isDisabled
                                ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 cursor-not-allowed'
                                : 'hover:bg-muted cursor-pointer'
                              }`}
                            title={isDisabled ? 'Este é o projeto no qual você está logado atualmente' : ''}
                          >
                            <input
                              type="checkbox"
                              checked={selectedProjIds.includes(proj.id)}
                              onChange={() => !isDisabled && toggleProj(proj.id)}
                              disabled={isDisabled}
                              className="rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{proj.name}</p>
                                {isCurrentProj && (
                                  <Badge variant="default" className="text-xs bg-green-600">
                                    <Lock className="h-3 w-3 mr-1" />
                                    Atual
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                {proj.description && (
                                  <p className="text-xs text-muted-foreground">{proj.description}</p>
                                )}
                                {orgName && (
                                  <Badge variant="outline" className="text-xs">
                                    {orgName}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-sm text-muted-foreground">
                          Nenhum projeto encontrado
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className="flex items-center space-x-2">
            {hasChanges() && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Alterações pendentes
              </Badge>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving || !hasChanges()}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
