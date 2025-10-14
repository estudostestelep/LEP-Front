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
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  setCurrentOrganization: (orgId: string) => Promise<void>;
  setCurrentProject: (projectId: string) => Promise<void>;
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

      // Carrega detalhes da organização e projeto atuais
      if (defaultOrg) {
        try {
          const org = await organizationService.getById(defaultOrg);
          setOrganizationDetails(org.data);
        } catch (error) {
          console.warn(`Erro ao carregar organização ${defaultOrg}:`, error);
        }
      }

      if (defaultProject) {
        try {
          const proj = await projectService.getById(defaultProject);
          setProjectDetails(proj.data);
        } catch (error) {
          console.warn(`Erro ao carregar projeto ${defaultProject}:`, error);
        }
      }

      // Persistir no localStorage
      localStorage.setItem('@LEP:token', authToken);
      localStorage.setItem('@LEP:user', JSON.stringify(userData));
      localStorage.setItem('@LEP:organizations', JSON.stringify(userOrgs));
      localStorage.setItem('@LEP:projects', JSON.stringify(userProjects));
      localStorage.setItem('@LEP:currentOrganization', defaultOrg || '');
      localStorage.setItem('@LEP:currentProject', defaultProject || '');

      console.log('Login concluído com sucesso');
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
      return false;
    }
  };

  const setCurrentOrganization = async (orgId: string) => {
    setCurrentOrganizationState(orgId);
    localStorage.setItem('@LEP:currentOrganization', orgId);

    // Carregar detalhes da organização
    try {
      const org = await organizationService.getById(orgId);
      setOrganizationDetails(org.data);
    } catch (error) {
      console.warn(`Erro ao carregar organização ${orgId}:`, error);
    }

    // Filtrar projetos da organização e selecionar o primeiro
    if (!user) return;

    try {
      const response = await projectService.getAll();
      const allProjects = response.data;
      const orgProjects = projects.filter(p => {
        const projData = allProjects.find(proj => proj.id === p.project_id);
        return projData?.organization_id === orgId;
      });

      if (orgProjects.length > 0) {
        await setCurrentProject(orgProjects[0].project_id);
      } else {
        setCurrentProjectState(null);
        setProjectDetails(null);
        localStorage.removeItem('@LEP:currentProject');
      }
    } catch (error) {
      console.error('Erro ao filtrar projetos da organização:', error);
    }
  };

  const setCurrentProject = async (projectId: string) => {
    setCurrentProjectState(projectId);
    localStorage.setItem('@LEP:currentProject', projectId);

    // Carregar detalhes do projeto
    try {
      const proj = await projectService.getById(projectId);
      setProjectDetails(proj.data);
    } catch (error) {
      console.warn(`Erro ao carregar projeto ${projectId}:`, error);
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

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const orgsData = storedOrgs ? JSON.parse(storedOrgs) : [];
          const projectsData = storedProjects ? JSON.parse(storedProjects) : [];

          setToken(storedToken);
          setUser(userData);
          setOrganizations(orgsData);
          setProjects(projectsData);
          setCurrentOrganizationState(storedCurrentOrg);
          setCurrentProjectState(storedCurrentProject);

          console.log('Sessão restaurada do localStorage:', {
            userId: userData.id,
            name: userData.name,
            orgsCount: orgsData.length,
            projectsCount: projectsData.length,
            currentOrg: storedCurrentOrg,
            currentProject: storedCurrentProject
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
          localStorage.removeItem('@LEP:token');
          localStorage.removeItem('@LEP:user');
          localStorage.removeItem('@LEP:organizations');
          localStorage.removeItem('@LEP:projects');
          localStorage.removeItem('@LEP:currentOrganization');
          localStorage.removeItem('@LEP:currentProject');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []); // Dependências vazias para executar apenas uma vez

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
      login,
      logout,
      checkAuth,
      setCurrentOrganization,
      setCurrentProject
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
