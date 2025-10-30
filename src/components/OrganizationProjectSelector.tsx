import { useAuth } from '@/context/authContext';
import { Building2, FolderKanban, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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

  // Filtrar projetos pela organização selecionada
  const filteredProjects = projects.filter(p =>
    p.active && p.organization_id === currentOrganization
  );

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
      <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <span className="text-xs text-yellow-600 dark:text-yellow-500">
          ⚠️ Nenhuma organização vinculada
        </span>
      </div>
    );
  }

  // Mostra loader se ainda está carregando dados
  if (loading && !organizationDetails) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/40 rounded-lg border border-border">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Carregando...</span>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-3 px-3 py-1.5 bg-muted/40 rounded-lg border border-border transition-all duration-200 hover:bg-muted/60">
        {/* Seletor de Organização */}
        <div className="flex items-center gap-2 min-w-0">
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="min-w-0">
                <Select
                  value={currentOrganization || ''}
                  onValueChange={handleOrgChange}
                >
                  <SelectTrigger
                    className={cn(
                      "h-7 border-none bg-transparent px-0 hover:bg-transparent focus:ring-0 focus:ring-offset-0",
                      "min-w-[120px] max-w-[180px] lg:max-w-[220px]"
                    )}
                  >
                    <SelectValue>
                      <span className="text-sm font-medium truncate">
                        {organizationDetails?.name || 'Organização'}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    align="start"
                    sideOffset={8}
                    alignOffset={-28}
                    className="min-w-[280px]"
                  >
                    {organizations.map((userOrg) => {
                      const orgName = userOrg.organization_name || `Org ${userOrg.organization_id.slice(0, 8)}`;

                      return (
                        <SelectItem
                          key={userOrg.id}
                          value={userOrg.organization_id}
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col items-start w-full gap-0.5">
                            <span className="font-medium text-sm leading-tight">{orgName}</span>
                            <span className="text-xs text-muted-foreground capitalize leading-tight">
                              {userOrg.role}
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[250px]">
              <p className="font-medium">{organizationDetails?.name}</p>
              {organizationDetails?.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {organizationDetails.description}
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Separador */}
        {filteredProjects.length > 0 && (
          <Separator orientation="vertical" className="h-6" />
        )}

        {/* Seletor de Projeto */}
        {filteredProjects.length > 0 && (
          <div className="flex items-center gap-2 min-w-0">
            <FolderKanban className="h-4 w-4 text-muted-foreground shrink-0" />
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="min-w-0">
                  <Select
                    value={currentProject || ''}
                    onValueChange={handleProjectChange}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-7 border-none bg-transparent px-0 hover:bg-transparent focus:ring-0 focus:ring-offset-0",
                        "min-w-[120px] max-w-[180px] lg:max-w-[220px]"
                      )}
                    >
                      <SelectValue>
                        <span className="text-sm font-medium truncate">
                          {projectDetails?.name || 'Projeto'}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      align="start"
                      sideOffset={8}
                      alignOffset={-28}
                      className="min-w-[280px]"
                    >
                      {filteredProjects.map((userProj) => {
                        const projName = userProj.project_name || `Projeto ${userProj.project_id.slice(0, 8)}`;

                        return (
                          <SelectItem
                            key={userProj.id}
                            value={userProj.project_id}
                            className="cursor-pointer"
                          >
                            <div className="flex flex-col items-start w-full gap-0.5">
                              <span className="font-medium text-sm leading-tight">{projName}</span>
                              <span className="text-xs text-muted-foreground capitalize leading-tight">
                                {userProj.role}
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[250px]">
                <p className="font-medium">{projectDetails?.name}</p>
                {projectDetails?.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {projectDetails.description}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
