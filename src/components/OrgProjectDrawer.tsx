import { useState } from 'react';
import { useAuth } from '@/context/authContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  FolderKanban,
  Search,
  Check,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface OrgProjectDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrgProjectDrawer = ({ open, onOpenChange }: OrgProjectDrawerProps) => {
  const {
    organizations,
    projects,
    currentOrganization,
    currentProject,
    organizationDetails,
    projectDetails,
    setCurrentOrganization,
    setCurrentProject,
  } = useAuth();

  const [searchOrg, setSearchOrg] = useState('');
  const [searchProj, setSearchProj] = useState('');
  const [showProjects, setShowProjects] = useState(false);

  // Filtrar projetos pela organização selecionada
  const filteredProjects = projects.filter(p =>
    p.active && p.organization_id === currentOrganization
  );

  // Filtrar por busca
  const filteredOrgs = organizations.filter(o =>
    o.organization_name?.toLowerCase().includes(searchOrg.toLowerCase())
  );

  const filteredProjsSearch = filteredProjects.filter(p =>
    p.project_name?.toLowerCase().includes(searchProj.toLowerCase())
  );

  const handleOrgSelect = async (orgId: string) => {
    try {
      await setCurrentOrganization(orgId);
      toast.success('Organização alterada com sucesso');
      setShowProjects(true);
    } catch (error) {
      toast.error('Erro ao trocar organização');
      console.error(error);
    }
  };

  const handleProjectSelect = async (projectId: string) => {
    try {
      await setCurrentProject(projectId);
      toast.success('Projeto alterado com sucesso');
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao trocar projeto');
      console.error(error);
    }
  };

  const handleBack = () => {
    setShowProjects(false);
    setSearchProj('');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            {showProjects ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="mr-2 h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </Button>
                <FolderKanban className="h-5 w-5" />
                Selecionar Projeto
              </>
            ) : (
              <>
                <Building2 className="h-5 w-5" />
                Selecionar Organização
              </>
            )}
          </SheetTitle>
          <SheetDescription>
            {showProjects
              ? `Escolha um projeto da organização ${organizationDetails?.name || ''}`
              : 'Escolha uma organização para continuar'
            }
          </SheetDescription>
        </SheetHeader>

        <Separator />

        {/* Campo de busca */}
        <div className="px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={showProjects ? "Buscar projeto..." : "Buscar organização..."}
              value={showProjects ? searchProj : searchOrg}
              onChange={(e) => showProjects ? setSearchProj(e.target.value) : setSearchOrg(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de organizações/projetos */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {!showProjects ? (
            // Lista de Organizações
            <div className="space-y-1">
              {filteredOrgs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Nenhuma organização encontrada
                </div>
              ) : (
                filteredOrgs.map((org) => {
                  const isSelected = org.organization_id === currentOrganization;
                  return (
                    <button
                      key={org.id}
                      onClick={() => handleOrgSelect(org.organization_id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 text-left",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50 hover:bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {org.organization_name || `Org ${org.organization_id.slice(0, 8)}`}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {org.role}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="h-5 w-5 text-primary shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            // Lista de Projetos
            <div className="space-y-1">
              {filteredProjsSearch.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Nenhum projeto encontrado para esta organização
                </div>
              ) : (
                filteredProjsSearch.map((proj) => {
                  const isSelected = proj.project_id === currentProject;
                  return (
                    <button
                      key={proj.id}
                      onClick={() => handleProjectSelect(proj.project_id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 text-left",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50 hover:bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          <FolderKanban className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {proj.project_name || `Projeto ${proj.project_id.slice(0, 8)}`}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {proj.role}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="h-5 w-5 text-primary shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Contexto atual - Rodapé */}
        {!showProjects && currentOrganization && organizationDetails && (
          <>
            <Separator />
            <div className="px-6 py-4 bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Contexto Atual</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="font-medium">{organizationDetails.name}</span>
                </div>
                {projectDetails && (
                  <div className="flex items-center gap-2 text-sm">
                    <FolderKanban className="h-4 w-4 text-primary" />
                    <span className="font-medium">{projectDetails.name}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
