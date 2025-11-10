import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  themeCustomizationService,
  saveThemeToLocalStorage,
  getDefaultTheme,
  applyThemeToDom,
  isDarkModePreferred,
} from '@/api/themeCustomizationService';
import { ThemeCustomization } from '@/types/theme';

interface ThemeContextType {
  theme: ThemeCustomization | null;
  loading: boolean;
  error: string | null;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  loadTheme: () => Promise<void>;
  updateTheme: (colors: Partial<ThemeCustomization>) => Promise<void>;
  resetTheme: () => Promise<void>;
  applyTheme: (theme: ThemeCustomization, isDarkMode: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Detectar preferência do sistema
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return isDarkModePreferred();
    }
    return false;
  });

  const [theme, setTheme] = useState<ThemeCustomization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aplicar tema ao DOM (novo sistema light/dark)
  const applyTheme = (themeData: ThemeCustomization, isDark: boolean) => {
    applyThemeToDom(themeData, isDark);

    // Atualizar o estado e persistir
    setTheme(themeData);
    saveThemeToLocalStorage(themeData);

    // Forçar uma renderização imediata
    if (typeof document !== 'undefined') {
      void document.documentElement.offsetHeight;
    }
  };

  // Carregar tema da API ou usar defaults
  const loadTheme = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tentar carregar da API
      const response = await themeCustomizationService.getTheme();
      applyTheme(response.data, isDarkMode);
    } catch (err) {
      console.warn('Failed to load theme from API, using defaults:', err);

      // Fallback para tema padrão profissional
      const defaultTheme = getDefaultTheme();
      applyTheme(defaultTheme, isDarkMode);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar tema
  const updateTheme = async (colors: Partial<ThemeCustomization>) => {
    try {
      setError(null);

      if (!theme) {
        throw new Error('Theme not loaded');
      }

      const updatedData = { ...theme, ...colors, is_active: true };
      const response = await themeCustomizationService.saveTheme(updatedData);
      applyTheme(response.data, isDarkMode);
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
      applyTheme(response.data, isDarkMode);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao resetar tema';
      setError(message);
      throw err;
    }
  };

  // Auto-load do tema na inicialização
  useEffect(() => {
    const initTheme = async () => {
      try {
        await loadTheme();
      } catch (err) {
        console.warn('Theme initialization failed, using default:', err);
        // Fallback final - usar tema padrão
        const defaultTheme = getDefaultTheme();
        applyTheme(defaultTheme, isDarkMode);
      }
    };

    initTheme();
  }, []);

  // Recarregar tema quando modo muda
  useEffect(() => {
    if (theme) {
      applyTheme(theme, isDarkMode);
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        loading,
        error,
        isDarkMode,
        setIsDarkMode,
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
