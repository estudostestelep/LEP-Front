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
  organizationsData: Map<string, Organization>;
  projectsData: Map<string, Project>;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  setCurrentOrganization: (orgId: string) => void;
  setCurrentProject: (projectId: string) => void;
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
  const [organizationsData, setOrganizationsData] = useState<Map<string, Organization>>(new Map());
  const [projectsData, setProjectsData] = useState<Map<string, Project>>(new Map());

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);

      const response = await authService.login(credentials);
      const { token: authToken, user: userData, organizations: userOrgs, projects: userProjects } = response.data;

      console.log('Login response from backend:', response.data);

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

      // Carrega dados das organizações e projetos
      if (userOrgs && userOrgs.length > 0) {
        const orgsMap = new Map<string, Organization>();
        for (const userOrg of userOrgs) {
          try {
            const org = await organizationService.getById(userOrg.organization_id);
            orgsMap.set(userOrg.organization_id, org.data);
          } catch (error) {
            console.warn(`Erro ao carregar organização ${userOrg.organization_id}:`, error);
          }
        }
        setOrganizationsData(orgsMap);
      }

      if (userProjects && userProjects.length > 0) {
        const projsMap = new Map<string, Project>();
        for (const userProj of userProjects) {
          try {
            const proj = await projectService.getById(userProj.project_id);
            projsMap.set(userProj.project_id, proj.data);
          } catch (error) {
            console.warn(`Erro ao carregar projeto ${userProj.project_id}:`, error);
          }
        }
        setProjectsData(projsMap);
      }

      // Persistir no localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('organizations', JSON.stringify(userOrgs));
      localStorage.setItem('projects', JSON.stringify(userProjects));
      localStorage.setItem('currentOrganization', defaultOrg || '');
      localStorage.setItem('currentProject', defaultProject || '');

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
      setOrganizationsData(new Map());
      setProjectsData(new Map());
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('organizations');
      localStorage.removeItem('projects');
      localStorage.removeItem('currentOrganization');
      localStorage.removeItem('currentProject');
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    const storedToken = localStorage.getItem('token');
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
      setOrganizationsData(new Map());
      setProjectsData(new Map());
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('organizations');
      localStorage.removeItem('projects');
      localStorage.removeItem('currentOrganization');
      localStorage.removeItem('currentProject');
      return false;
    }
  };

  const setCurrentOrganization = (orgId: string) => {
    setCurrentOrganizationState(orgId);
    localStorage.setItem('currentOrganization', orgId);

    // Ao trocar de organização, resetar o projeto para o primeiro disponível dessa org
    const orgProjects = projects.filter(p => {
      const projectData = projectsData.get(p.project_id);
      return projectData?.organization_id === orgId;
    });

    if (orgProjects.length > 0) {
      setCurrentProject(orgProjects[0].project_id);
    } else {
      setCurrentProjectState(null);
      localStorage.removeItem('currentProject');
    }
  };

  const setCurrentProject = (projectId: string) => {
    setCurrentProjectState(projectId);
    localStorage.setItem('currentProject', projectId);
  };

  // Inicialização - carrega dados do localStorage sem verificar token
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const storedOrgs = localStorage.getItem('organizations');
      const storedProjects = localStorage.getItem('projects');
      const storedCurrentOrg = localStorage.getItem('currentOrganization');
      const storedCurrentProject = localStorage.getItem('currentProject');

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
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('organizations');
          localStorage.removeItem('projects');
          localStorage.removeItem('currentOrganization');
          localStorage.removeItem('currentProject');
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
      organizationsData,
      projectsData,
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
