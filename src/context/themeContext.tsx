import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  themeCustomizationService,
  getThemeFromLocalStorage,
  saveThemeToLocalStorage,
  getDefaultTheme,
  themeToCSSVariables,
} from '@/api/themeCustomizationService';
import { ThemeCustomization } from '@/types/theme';

interface ThemeContextType {
  theme: ThemeCustomization;
  loading: boolean;
  error: string | null;
  loadTheme: () => Promise<void>;
  updateTheme: (colors: Partial<ThemeCustomization>) => Promise<void>;
  resetTheme: () => Promise<void>;
  applyTheme: (theme: ThemeCustomization) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Inicializar com localStorage se disponível (que contém o último tema carregado da API)
  // Senão usar padrão
  const getInitialTheme = () => {
    const stored = getThemeFromLocalStorage();
    return stored || getDefaultTheme();
  };

  const [theme, setTheme] = useState<ThemeCustomization>(getInitialTheme());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aplicar tema ao DOM
  const applyTheme = (themeData: ThemeCustomization) => {
    const cssVariables = themeToCSSVariables(themeData);
    Object.entries(cssVariables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    setTheme(themeData);
    saveThemeToLocalStorage(themeData);
  };

  // Carregar tema da API ou localStorage
  const loadTheme = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tentar carregar da API
      const response = await themeCustomizationService.getTheme();
      applyTheme(response.data);
    } catch (err) {
      console.warn('Failed to load theme from API, using localStorage:', err);

      // Fallback para localStorage
      const storedTheme = getThemeFromLocalStorage();
      if (storedTheme) {
        applyTheme(storedTheme);
      } else {
        // Usar padrão
        const defaultTheme = getDefaultTheme();
        applyTheme(defaultTheme);
      }
    } finally {
      setLoading(false);
    }
  };

  // Atualizar tema
  const updateTheme = async (colors: Partial<ThemeCustomization>) => {
    try {
      setError(null);
      const updatedData = { ...theme, ...colors, is_active: true };
      const response = await themeCustomizationService.saveTheme(updatedData);
      applyTheme(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar tema';
      setError(message);
      throw err;
    }
  };

  // Resetar para padrão
  const resetTheme = async () => {
    try {
      setError(null);
      const response = await themeCustomizationService.resetToDefaults();
      applyTheme(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao resetar tema';
      setError(message);
      throw err;
    }
  };

  // Carregar tema ao inicializar
  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        loading,
        error,
        loadTheme,
        updateTheme,
        resetTheme,
        applyTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
