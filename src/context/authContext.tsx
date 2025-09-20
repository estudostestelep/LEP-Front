import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginRequest } from '@/api/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  orgId: string;
  projectId: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  setOrgAndProject: (orgId: string, projectId: string) => void;
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

      // Precisa definir orgId e projectId - por enquanto usando valores padrão
      const userWithOrgData: User = {
        ...userData,
        orgId: userData.orgId || 'default-org',
        projectId: userData.projectId || 'default-project'
      };

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

  const setOrgAndProject = (orgId: string, projectId: string) => {
    if (user) {
      const updatedUser = { ...user, orgId, projectId };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Inicialização - verifica autenticação ao carregar
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);

          // Verifica se o token ainda é válido
          const isValid = await checkAuth();
          if (!isValid) {
            // Se token inválido, limpa dados (já feito no checkAuth)
            console.warn('Token inválido durante inicialização');
          }
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
