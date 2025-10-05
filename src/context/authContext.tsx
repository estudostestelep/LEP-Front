import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginRequest } from '@/api/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  organization_id: string;
  project_id: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  setOrgAndProject: (organization_id: string, project_id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);


      const response = await authService.login(credentials);
      const { token: authToken, user: userData } = response.data;

      console.log('Login response from backend:', response.data);
      console.log('User data received:', userData);

      // Verifica se o backend retornou organization_id e project_id, senão usa valores baseados no usuário
      const userWithOrgData: User = {
        ...userData,
        organization_id: userData.organization_id,
        project_id: userData.project_id
      };

      console.log('User with org data:', userWithOrgData);

      // Armazena token e dados do usuário
      setToken(authToken);
      setUser(userWithOrgData);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userWithOrgData));
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  };

  const setOrgAndProject = (organization_id: string, project_id: string) => {
    if (user) {
      const updatedUser = { ...user, organization_id, project_id };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Inicialização - carrega dados do localStorage sem verificar token
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          console.log('Sessão restaurada do localStorage:', { userId: userData.id, name: userData.name });
        } catch (error) {
          console.warn('Erro ao recuperar sessão:', error);
          // Em caso de erro, limpa dados
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
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
      login,
      logout,
      checkAuth,
      setOrgAndProject
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
