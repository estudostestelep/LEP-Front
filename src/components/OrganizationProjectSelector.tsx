import { useAuth } from '@/context/authContext';
import { Building2, FolderKanban, ChevronDown, Loader2 } from 'lucide-react';

export const OrganizationProjectSelector = () => {
  const {
    organizations,
    projects,
    currentOrganization,
    currentProject,
    organizationsData,
    projectsData,
    setCurrentOrganization,
    setCurrentProject,
    loading
  } = useAuth();

  // Filtra projetos da organização atual
  const currentOrgProjects = projects.filter(p => {
    const projectData = projectsData.get(p.project_id);
    return projectData?.organization_id === currentOrganization;
  });

  // Não mostra nada se não houver organizações
  if (organizations.length === 0) {
    return null;
  }

  const currentOrgData = organizationsData.get(currentOrganization || '');
  const currentProjectData = projectsData.get(currentProject || '');

  // Mostra loader se ainda está carregando dados
  if (loading && organizationsData.size === 0) {
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
              onChange={(e) => setCurrentOrganization(e.target.value)}
              className="appearance-none bg-transparent border-none text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:ring-0 pr-5 max-w-[150px] truncate"
              title={currentOrgData?.name || 'Organização'}
            >
              {organizations.map((userOrg) => {
                const org = organizationsData.get(userOrg.organization_id);
                return (
                  <option key={userOrg.id} value={userOrg.organization_id}>
                    {org?.name || `Org ${userOrg.organization_id.slice(0, 8)}`}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground pointer-events-none absolute right-0" />
          </div>
        </label>
      </div>

      {/* Separador */}
      {currentOrgProjects.length > 0 && (
        <div className="h-5 w-px bg-border" />
      )}

      {/* Seletor de Projeto */}
      {currentOrgProjects.length > 0 && (
        <div className="relative group">
          <label className="flex items-center gap-2 cursor-pointer">
            <FolderKanban className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div className="flex items-center gap-1.5">
              <select
                value={currentProject || ''}
                onChange={(e) => setCurrentProject(e.target.value)}
                className="appearance-none bg-transparent border-none text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:ring-0 pr-5 max-w-[150px] truncate"
                title={currentProjectData?.name || 'Projeto'}
              >
                {currentOrgProjects.map((userProj) => {
                  const proj = projectsData.get(userProj.project_id);
                  return (
                    <option key={userProj.id} value={userProj.project_id}>
                      {proj?.name || `Projeto ${userProj.project_id.slice(0, 8)}`}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground pointer-events-none absolute right-0" />
            </div>
          </label>
        </div>
      )}
    </div>
  );
};
