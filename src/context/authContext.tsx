import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginRequest } from '@/api/authService';
import { User, UserOrganization, UserProject, Organization, Project } from '@/types/auth';
import { organizationService } from '@/api/organizationService';
import { projectService } from '@/api/projectService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  organizations: UserOrganization[];
  projects: UserProject[];
  currentOrganization: string | null;
  currentProject: string | null;
  organizationDetails: Organization | null;
  projectDetails: Project | null;
  isMasterAdmin: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  setCurrentOrganization: (orgId: string) => Promise<void>;
  setCurrentProject: (projectId: string) => Promise<void>;
  refreshUserAccess: () => Promise<void>; // ✅ NOVO: Recarregar acessos
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<UserOrganization[]>([]);
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [currentOrganization, setCurrentOrganizationState] = useState<string | null>(null);
  const [currentProject, setCurrentProjectState] = useState<string | null>(null);
  const [organizationDetails, setOrganizationDetails] = useState<Organization | null>(null);
  const [projectDetails, setProjectDetails] = useState<Project | null>(null);

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);

      const response = await authService.login(credentials);
      const { token: authToken, user: userData, organizations: userOrgs, projects: userProjects } = response.data;

      console.log('Login response from backend:', response.data);

      // Validação: usuário deve ter pelo menos 1 organização
      if (!userOrgs || userOrgs.length === 0) {
        throw new Error('Usuário não está vinculado a nenhuma organização. Contate o administrador.');
      }

      // Armazena dados básicos
      setToken(authToken);
      setUser(userData);
      setOrganizations(userOrgs || []);
      setProjects(userProjects || []);

      // Define primeira organização e projeto como padrão
      const defaultOrg = userOrgs?.[0]?.organization_id || null;
      const defaultProject = userProjects?.[0]?.project_id || null;

      setCurrentOrganizationState(defaultOrg);
      setCurrentProjectState(defaultProject);

      // ✅ OTIMIZAÇÃO: Usar dados já retornados pelo backend
      // Backend já retorna organization_name e project_name nos DTOs
      if (defaultOrg) {
        const orgRelation = userOrgs.find(uo => uo.organization_id === defaultOrg);
        if (orgRelation?.organization_name) {
          // Cria organizationDetails a partir dos dados da relação
          const orgDetails: Organization = {
            id: defaultOrg,
            name: orgRelation.organization_name,
            active: orgRelation.active,
            created_at: orgRelation.created_at,
            updated_at: orgRelation.updated_at
          };
          setOrganizationDetails(orgDetails);
          localStorage.setItem('@LEP:organizationDetails', JSON.stringify(orgDetails));
          console.log('Organização definida a partir dos dados de login:', orgDetails);
        } else {
          // Fallback: buscar detalhes completos apenas se não vier no DTO
          console.warn('organization_name não encontrado no DTO, buscando detalhes...');
          try {
            const org = await organizationService.getById(defaultOrg);
            setOrganizationDetails(org.data);
            localStorage.setItem('@LEP:organizationDetails', JSON.stringify(org.data));
          } catch (error) {
            console.warn(`Erro ao carregar organização ${defaultOrg}:`, error);
          }
        }
      }

      if (defaultProject) {
        const projRelation = userProjects.find(up => up.project_id === defaultProject);
        if (projRelation?.project_name) {
          // Cria projectDetails a partir dos dados da relação
          const projDetails: Project = {
            id: defaultProject,
            name: projRelation.project_name,
            organization_id: defaultOrg || '',
            active: projRelation.active,
            created_at: projRelation.created_at,
            updated_at: projRelation.updated_at
          };
          setProjectDetails(projDetails);
          localStorage.setItem('@LEP:projectDetails', JSON.stringify(projDetails));
          console.log('Projeto definido a partir dos dados de login:', projDetails);
        } else {
          // Fallback: buscar detalhes completos apenas se não vier no DTO
          console.warn('project_name não encontrado no DTO, buscando detalhes...');
          try {
            const proj = await projectService.getById(defaultProject);
            setProjectDetails(proj.data);
            localStorage.setItem('@LEP:projectDetails', JSON.stringify(proj.data));
          } catch (error) {
            console.warn(`Erro ao carregar projeto ${defaultProject}:`, error);
          }
        }
      }

      // Persistir no localStorage
      localStorage.setItem('@LEP:token', authToken);
      localStorage.setItem('@LEP:user', JSON.stringify(userData));
      localStorage.setItem('@LEP:organizations', JSON.stringify(userOrgs));
      localStorage.setItem('@LEP:projects', JSON.stringify(userProjects));
      localStorage.setItem('@LEP:currentOrganization', defaultOrg || '');
      localStorage.setItem('@LEP:currentProject', defaultProject || '');

      console.log('Login concluído com sucesso - detalhes carregados');
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Tenta fazer logout no backend (mesmo que falhe, limpa dados locais)
      await authService.logout();
    } catch (error) {
      console.warn('Erro no logout do backend:', error);
    } finally {
      // Sempre limpa dados locais
      setUser(null);
      setToken(null);
      setOrganizations([]);
      setProjects([]);
      setCurrentOrganizationState(null);
      setCurrentProjectState(null);
      setOrganizationDetails(null);
      setProjectDetails(null);
      localStorage.removeItem('@LEP:token');
      localStorage.removeItem('@LEP:user');
      localStorage.removeItem('@LEP:organizations');
      localStorage.removeItem('@LEP:projects');
      localStorage.removeItem('@LEP:currentOrganization');
      localStorage.removeItem('@LEP:currentProject');
      localStorage.removeItem('@LEP:organizationDetails');
      localStorage.removeItem('@LEP:projectDetails');
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    const storedToken = localStorage.getItem('@LEP:token');
    if (!storedToken) {
      return false;
    }

    try {
      await authService.checkToken();
      return true;
    } catch {
      // Token inválido - limpa dados
      setUser(null);
      setToken(null);
      setOrganizations([]);
      setProjects([]);
      setCurrentOrganizationState(null);
      setCurrentProjectState(null);
      setOrganizationDetails(null);
      setProjectDetails(null);
      localStorage.removeItem('@LEP:token');
      localStorage.removeItem('@LEP:user');
      localStorage.removeItem('@LEP:organizations');
      localStorage.removeItem('@LEP:projects');
      localStorage.removeItem('@LEP:currentOrganization');
      localStorage.removeItem('@LEP:currentProject');
      localStorage.removeItem('@LEP:organizationDetails');
      localStorage.removeItem('@LEP:projectDetails');
      return false;
    }
  };

  const setCurrentOrganization = async (orgId: string) => {
    setCurrentOrganizationState(orgId);
    localStorage.setItem('@LEP:currentOrganization', orgId);

    // ✅ OTIMIZAÇÃO: Primeiro tentar usar dados já em memória
    const orgRelation = organizations.find(uo => uo.organization_id === orgId);

    if (orgRelation?.organization_name) {
      // Usar dados da relação se disponíveis
      const orgDetails: Organization = {
        id: orgId,
        name: orgRelation.organization_name,
        active: orgRelation.active,
        created_at: orgRelation.created_at,
        updated_at: orgRelation.updated_at
      };
      setOrganizationDetails(orgDetails);
      localStorage.setItem('@LEP:organizationDetails', JSON.stringify(orgDetails));
      console.log('Organização definida a partir de dados em memória:', orgDetails);
    } else {
      // Fallback: Carregar detalhes completos da API
      try {
        const org = await organizationService.getById(orgId);
        setOrganizationDetails(org.data);
        localStorage.setItem('@LEP:organizationDetails', JSON.stringify(org.data));
        console.log('Organização carregada da API:', org.data);
      } catch (error) {
        console.warn(`Erro ao carregar organização ${orgId}:`, error);
      }
    }

    // ✅ CORREÇÃO: Filtrar projetos da organização selecionada
    if (!user) return;

    // Filtrar projetos do usuário que pertencem a esta organização
    const userProjectsForOrg = projects.filter(up =>
      up.active && up.organization_id === orgId
    );

    console.log(`Projetos encontrados para organização ${orgId}:`, userProjectsForOrg.length);

    if (userProjectsForOrg.length > 0) {
      // Seleciona o primeiro projeto ativo da organização
      await setCurrentProject(userProjectsForOrg[0].project_id);
    } else {
      setCurrentProjectState(null);
      setProjectDetails(null);
      localStorage.removeItem('@LEP:currentProject');
      localStorage.removeItem('@LEP:projectDetails');
      console.warn('Nenhum projeto ativo encontrado para esta organização');
    }
  };

  const setCurrentProject = async (projectId: string) => {
    setCurrentProjectState(projectId);
    localStorage.setItem('@LEP:currentProject', projectId);

    // ✅ OTIMIZAÇÃO: Primeiro tentar usar dados já em memória
    const projRelation = projects.find(up => up.project_id === projectId);

    if (projRelation?.project_name) {
      // Usar dados da relação se disponíveis
      const projDetails: Project = {
        id: projectId,
        name: projRelation.project_name,
        organization_id: currentOrganization || '',
        active: projRelation.active,
        created_at: projRelation.created_at,
        updated_at: projRelation.updated_at
      };
      setProjectDetails(projDetails);
      localStorage.setItem('@LEP:projectDetails', JSON.stringify(projDetails));
      console.log('Projeto definido a partir de dados em memória:', projDetails);
    } else {
      // Fallback: Carregar detalhes completos da API
      try {
        const proj = await projectService.getById(projectId);
        setProjectDetails(proj.data);
        localStorage.setItem('@LEP:projectDetails', JSON.stringify(proj.data));
        console.log('Projeto carregado da API:', proj.data);
      } catch (error) {
        console.warn(`Erro ao carregar projeto ${projectId}:`, error);
      }
    }
  };

  // Inicialização - carrega dados do localStorage sem verificar token
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('@LEP:token');
      const storedUser = localStorage.getItem('@LEP:user');
      const storedOrgs = localStorage.getItem('@LEP:organizations');
      const storedProjects = localStorage.getItem('@LEP:projects');
      const storedCurrentOrg = localStorage.getItem('@LEP:currentOrganization');
      const storedCurrentProject = localStorage.getItem('@LEP:currentProject');
      const storedOrgDetails = localStorage.getItem('@LEP:organizationDetails');
      const storedProjDetails = localStorage.getItem('@LEP:projectDetails');

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const orgsData = storedOrgs ? JSON.parse(storedOrgs) : [];
          const projectsData = storedProjects ? JSON.parse(storedProjects) : [];
          const orgDetailsData = storedOrgDetails ? JSON.parse(storedOrgDetails) : null;
          const projDetailsData = storedProjDetails ? JSON.parse(storedProjDetails) : null;

          setToken(storedToken);
          setUser(userData);
          setOrganizations(orgsData);
          setProjects(projectsData);
          setCurrentOrganizationState(storedCurrentOrg);
          setCurrentProjectState(storedCurrentProject);

          // ✅ NOVA FUNCIONALIDADE: Restaurar detalhes de organização e projeto
          if (orgDetailsData) {
            setOrganizationDetails(orgDetailsData);
          }
          if (projDetailsData) {
            setProjectDetails(projDetailsData);
          }

          console.log('Sessão restaurada do localStorage:', {
            userId: userData.id,
            name: userData.name,
            orgsCount: orgsData.length,
            projectsCount: projectsData.length,
            currentOrg: storedCurrentOrg,
            currentProject: storedCurrentProject,
            hasOrgDetails: !!orgDetailsData,
            hasProjDetails: !!projDetailsData
          });
        } catch (error) {
          console.warn('Erro ao recuperar sessão:', error);
          // Em caso de erro, limpa dados
          setUser(null);
          setToken(null);
          setOrganizations([]);
          setProjects([]);
          setCurrentOrganizationState(null);
          setCurrentProjectState(null);
          setOrganizationDetails(null);
          setProjectDetails(null);
          localStorage.removeItem('@LEP:token');
          localStorage.removeItem('@LEP:user');
          localStorage.removeItem('@LEP:organizations');
          localStorage.removeItem('@LEP:projects');
          localStorage.removeItem('@LEP:currentOrganization');
          localStorage.removeItem('@LEP:currentProject');
          localStorage.removeItem('@LEP:organizationDetails');
          localStorage.removeItem('@LEP:projectDetails');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []); // Dependências vazias para executar apenas uma vez

  // ✅ NOVO: Função para recarregar acessos do usuário após mudanças
  const refreshUserAccess = async () => {
    if (!user?.id) {
      console.warn('Não é possível recarregar acessos: usuário não logado');
      return;
    }

    try {
      console.log('Recarregando acessos do usuário...');

      // Buscar acessos atualizados do backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://lep-system-516622888070.us-central1.run.app'}/user/${user.id}/organizations-projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Lpe-Organization-Id': currentOrganization || '',
          'X-Lpe-Project-Id': currentProject || '',
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar acessos atualizados');
      }

      const data = await response.json();
      const userOrgs: UserOrganization[] = data.data?.organizations || [];
      const userProjects: UserProject[] = data.data?.projects || [];

      // Atualizar estados
      setOrganizations(userOrgs);
      setProjects(userProjects);

      // Persistir no localStorage
      localStorage.setItem('@LEP:organizations', JSON.stringify(userOrgs));
      localStorage.setItem('@LEP:projects', JSON.stringify(userProjects));

      // Verificar se organização/projeto atual ainda existe
      const currentOrgStillExists = userOrgs.some(o => o.organization_id === currentOrganization);
      const currentProjStillExists = userProjects.some(p => p.project_id === currentProject);

      if (!currentOrgStillExists && userOrgs.length > 0) {
        // Se a organização atual foi removida, selecionar a primeira disponível
        console.warn('Organização atual removida, selecionando primeira disponível');
        await setCurrentOrganization(userOrgs[0].organization_id);
      }

      if (!currentProjStillExists && userProjects.length > 0) {
        // Se o projeto atual foi removido, selecionar o primeiro disponível
        console.warn('Projeto atual removido, selecionando primeiro disponível');
        await setCurrentProject(userProjects[0].project_id);
      }

      console.log('Acessos recarregados com sucesso:', {
        organizations: userOrgs.length,
        projects: userProjects.length
      });
    } catch (error) {
      console.error('Erro ao recarregar acessos:', error);
    }
  };

  // Verifica se o usuário é Master Admin
  const isMasterAdmin = user?.permissions?.includes('master_admin') || false;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      organizations,
      projects,
      currentOrganization,
      currentProject,
      organizationDetails,
      projectDetails,
      isMasterAdmin,
      login,
      logout,
      checkAuth,
      setCurrentOrganization,
      setCurrentProject,
      refreshUserAccess
    }}>
      {children}
    </AuthContext.Provider>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
