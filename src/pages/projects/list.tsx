import { useEffect, useState } from "react";
import { projectService, Project } from "@/api/projectService";
import { organizationService, Organization } from "@/api/organizationService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, FolderOpen, Plus, Edit, Trash2, Building, Search } from "lucide-react";
import ProjectForm from "./form";
import ConfirmModal from "@/components/confirmModal";
import { AxiosError } from "axios";

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [projectsRes, organizationsRes] = await Promise.all([
        projectService.getAll(),
        organizationService.getAll()
      ]);

      setProjects(projectsRes.data);
      setFilteredProjects(projectsRes.data);
      setOrganizations(organizationsRes.data);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      setError(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao carregar projetos"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    try {
      await projectService.remove(projectToDelete);
      const updatedProjects = projects.filter(p => p.id !== projectToDelete);
      setProjects(updatedProjects);
      applyFilters(updatedProjects, searchTerm, selectedOrganization);
      setShowConfirm(false);
      setProjectToDelete(null);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      alert(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao excluir projeto"
      );
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProject(null);
    fetchData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const applyFilters = (projectList: Project[], search: string, orgId: string) => {
    let filtered = projectList;

    // Filtro por texto
    if (search.trim()) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtro por organização
    if (orgId) {
      filtered = filtered.filter(project => project.organization_id === orgId);
    }

    setFilteredProjects(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(projects, value, selectedOrganization);
  };

  const handleOrganizationFilter = (value: string) => {
    setSelectedOrganization(value);
    applyFilters(projects, searchTerm, value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedOrganization("");
    setFilteredProjects(projects);
  };

  const getOrganizationName = (organizationId: string) => {
    return organizations.find(org => org.id === organizationId)?.name || "Organização não encontrada";
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando projetos...</p>
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
              <FolderOpen className="h-8 w-8" />
              <span>Gerenciar Projetos</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie todos os projetos do sistema
            </p>
          </div>

          <Button
            size="lg"
            className="flex items-center space-x-2"
            onClick={handleNewProject}
          >
            <Plus className="h-4 w-4" />
            <span>Novo Projeto</span>
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar projetos..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div>
                <select
                  value={selectedOrganization}
                  onChange={(e) => handleOrganizationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                >
                  <option value="">Todas as organizações</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Button type="button" onClick={clearFilters} variant="outline" className="w-full">
                  Limpar Filtros
                </Button>
              </div>
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
                  onClick={fetchData}
                  className="ml-auto"
                >
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      {project.description && (
                        <CardDescription className="line-clamp-2">
                          {project.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditProject(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => project.id && handleDeleteClick(project.id)}
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
                    <Badge variant={project.active ? "default" : "secondary"}>
                      {project.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <span className="text-sm text-muted-foreground">
                        {getOrganizationName(project.organization_id)}
                      </span>
                    </div>
                  </div>

                  {project.created_at && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span>Criado em</span>
                      <span>
                        {new Date(project.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm || selectedOrganization ? "Nenhum projeto encontrado" : "Nenhum projeto cadastrado"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedOrganization ?
                  "Nenhum projeto corresponde aos filtros aplicados." :
                  "Comece criando seu primeiro projeto."
                }
              </p>
              {!searchTerm && !selectedOrganization && (
                <Button onClick={handleNewProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Projeto
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results count */}
        {(searchTerm || selectedOrganization) && (
          <div className="text-center text-sm text-muted-foreground mt-4">
            {filteredProjects.length} de {projects.length} projetos encontrados
          </div>
        )}

        {/* Modals */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <ProjectForm
                initialData={editingProject || undefined}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}

        <ConfirmModal
          open={showConfirm}
          title="Excluir Projeto"
          message="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowConfirm(false);
            setProjectToDelete(null);
          }}
        />
      </div>
    </div>
  );
}