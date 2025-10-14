import { useAuth } from '@/context/authContext';
import { Building2, FolderKanban, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const OrganizationProjectSelector = () => {
  const {
    organizations,
    projects,
    currentOrganization,
    currentProject,
    organizationDetails,
    projectDetails,
    setCurrentOrganization,
    setCurrentProject,
    loading
  } = useAuth();

  // ✅ CORREÇÃO: Filtrar projetos pela organização selecionada
  const filteredProjects = projects.filter(p =>
    p.active && p.organization_id === currentOrganization
  );

  // DEBUG - Log para verificar dados
  console.log('OrganizationProjectSelector - Estado:', {
    orgsCount: organizations.length,
    projsCount: projects.length,
    filteredProjsCount: filteredProjects.length,
    currentOrg: currentOrganization,
    currentProj: currentProject,
    orgDetails: organizationDetails,
    projDetails: projectDetails,
    loading
  });

  const handleOrgChange = async (orgId: string) => {
    try {
      await setCurrentOrganization(orgId);
      toast.success('Organização alterada com sucesso');
    } catch (error) {
      toast.error('Erro ao trocar organização');
      console.error(error);
    }
  };

  const handleProjectChange = async (projectId: string) => {
    try {
      await setCurrentProject(projectId);
      toast.success('Projeto alterado com sucesso');
    } catch (error) {
      toast.error('Erro ao trocar projeto');
      console.error(error);
    }
  };

  // Mostra aviso se não houver organizações
  if (organizations.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-lg">
        <span className="text-xs text-yellow-700">
          ⚠️ Nenhuma organização vinculada
        </span>
      </div>
    );
  }

  // Mostra loader se ainda está carregando dados
  if (loading && !organizationDetails) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-lg border border-border">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-lg border border-border">
      {/* Seletor de Organização */}
      <div className="relative group">
        <label className="flex items-center gap-2 cursor-pointer">
          <Building2 className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          <div className="flex items-center gap-1.5">
            <select
              value={currentOrganization || ''}
              onChange={(e) => handleOrgChange(e.target.value)}
              className="appearance-none bg-transparent border-none text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:ring-0 pr-5 max-w-[150px] truncate"
              title={organizationDetails?.name || 'Organização'}
            >
              {organizations.map((userOrg) => (
                <option key={userOrg.id} value={userOrg.organization_id}>
                  {userOrg.organization_name
                    ? `${userOrg.organization_name} (${userOrg.role})`
                    : `Org ${userOrg.organization_id.slice(0, 8)} (${userOrg.role})`}
                </option>
              ))}
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground pointer-events-none absolute right-0" />
          </div>
        </label>
      </div>

      {/* Separador */}
      {filteredProjects.length > 0 && (
        <div className="h-5 w-px bg-border" />
      )}

      {/* Seletor de Projeto */}
      {filteredProjects.length > 0 && (
        <div className="relative group">
          <label className="flex items-center gap-2 cursor-pointer">
            <FolderKanban className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div className="flex items-center gap-1.5">
              <select
                value={currentProject || ''}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="appearance-none bg-transparent border-none text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:ring-0 pr-5 max-w-[150px] truncate"
                title={projectDetails?.name || 'Projeto'}
              >
                {filteredProjects.map((userProj) => (
                  <option key={userProj.id} value={userProj.project_id}>
                    {userProj.project_name
                      ? `${userProj.project_name} (${userProj.role})`
                      : `Projeto ${userProj.project_id.slice(0, 8)} (${userProj.role})`}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground pointer-events-none absolute right-0" />
            </div>
          </label>
        </div>
      )}
    </div>
  );
};
