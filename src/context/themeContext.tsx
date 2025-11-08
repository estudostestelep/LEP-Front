import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  themeCustomizationService,
  getThemeFromLocalStorage,
  saveThemeToLocalStorage,
  getDefaultTheme,
  themeToCSSVariables,
} from '@/api/themeCustomizationService';
import { ThemeCustomization, ThemeDefinition, DEFAULT_THEME_LIGHT, DEFAULT_THEME_DARK } from '@/types/theme';
import { applyTheme as applyThemeVariables, saveThemeToStorage, getThemeFromStorage } from '@/lib/theme-generator';
import { validateContrast } from '@/lib/color-utils';

interface ThemeContextType {
  theme: ThemeCustomization;
  currentTheme?: ThemeDefinition;
  loading: boolean;
  error: string | null;
  loadTheme: () => Promise<void>;
  updateTheme: (colors: Partial<ThemeCustomization>) => Promise<void>;
  resetTheme: () => Promise<void>;
  applyTheme: (theme: ThemeCustomization) => void;
  validateColors: (colors: Record<string, string>) => { valid: boolean; warnings: string[] };
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Usar apenas o tema padrão (sem customizações)
  // Não usar localStorage para evitar conflitos com tema customizado anterior
  const getInitialTheme = () => {
    return getDefaultTheme();
  };

  const [theme, setTheme] = useState<ThemeCustomization>(getInitialTheme());
  const [currentTheme, setCurrentTheme] = useState<ThemeDefinition | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Detectar preferência do sistema
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Validar cores e retornar warnings
  const validateColors = (colors: Record<string, string>) => {
    const warnings: string[] = [];

    // Validar contraste entre pares de cores
    const pairs = [
      { fg: 'primary', bg: 'background' },
      { fg: 'foreground', bg: 'background' },
      { fg: 'destructive', bg: 'background' },
    ];

    pairs.forEach(({ fg, bg }) => {
      const fgColor = colors[fg];
      const bgColor = colors[bg];
      if (fgColor && bgColor) {
        const result = validateContrast(fgColor, bgColor);
        if (!result.isAccessible) {
          warnings.push(`⚠️ Contraste baixo entre ${fg} e ${bg}: ${result.message}`);
        }
      }
    });

    return {
      valid: warnings.length === 0,
      warnings,
    };
  };

  // Aplicar tema ao DOM (versão legada para compatibilidade)
  const applyTheme = (themeData: ThemeCustomization) => {
    const cssVariables = themeToCSSVariables(themeData);
    Object.entries(cssVariables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    setTheme(themeData);
    saveThemeToLocalStorage(themeData);
  };

  // Carregar tema da API ou localStorage (com auto-load na inicialização)
  const loadTheme = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tentar carregar da API
      const response = await themeCustomizationService.getTheme();
      applyTheme(response.data);
      setCurrentTheme({
        name: 'Custom Theme',
        colors: {
          primary: response.data.primary_color,
          primaryForeground: '#FFFFFF',
          background: response.data.background_color,
          card: response.data.card_background_color,
          foreground: response.data.text_color,
          cardForeground: response.data.text_color,
          popover: response.data.background_color,
          popoverForeground: response.data.text_color,
          secondary: response.data.secondary_color || '#F0F4F8',
          secondaryForeground: response.data.text_secondary_color || '#0F172A',
          muted: '#F0F4F8',
          mutedForeground: response.data.text_secondary_color || '#64748B',
          accent: response.data.accent_color || '#F0F4F8',
          accentForeground: response.data.text_color || '#1E293B',
          destructive: '#EF4444',
          destructiveForeground: '#F8FAFC',
          border: '#E2E8F0',
          input: '#E2E8F0',
          ring: response.data.primary_color,
        },
        isCustom: true,
      });
    } catch (err) {
      console.warn('Failed to load theme from API, using fallback:', err);

      // Fallback para localStorage (novo sistema)
      const storedTheme = getThemeFromStorage();
      if (storedTheme) {
        applyThemeVariables(storedTheme);
        setCurrentTheme({
          name: 'Stored Theme',
          colors: storedTheme,
          isCustom: true,
        });
      } else {
        // Usar tema padrão baseado em preferência do sistema
        const defaultTheme = isDarkMode ? DEFAULT_THEME_DARK : DEFAULT_THEME_LIGHT;
        applyThemeVariables(defaultTheme.colors);
        setCurrentTheme(defaultTheme);
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
      // Resetar para tema padrão do sistema
      const defaultTheme = isDarkMode ? DEFAULT_THEME_DARK : DEFAULT_THEME_LIGHT;
      setCurrentTheme(defaultTheme);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao resetar tema';
      setError(message);
      throw err;
    }
  };

  // Auto-load do tema na inicialização
  useEffect(() => {
    // Carregar tema com fallback para tema padrão
    const initTheme = async () => {
      try {
        await loadTheme();
      } catch (err) {
        console.warn('Theme initialization failed, using default:', err);
        // Fallback final - usar tema padrão
        const defaultTheme = isDarkMode ? DEFAULT_THEME_DARK : DEFAULT_THEME_LIGHT;
        applyThemeVariables(defaultTheme.colors);
        setCurrentTheme(defaultTheme);
        setLoading(false);
      }
    };

    initTheme();
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentTheme,
        loading,
        error,
        loadTheme,
        updateTheme,
        resetTheme,
        applyTheme,
        validateColors,
        isDarkMode,
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
