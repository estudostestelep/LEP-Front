import { useContext } from 'react';
import { ThemeProviderContext } from '@/components/theme-provider';

/**
 * Hook que usa o ThemeProvider centralizado.
 * Resolvido para 'light' ou 'dark' considerando preferências do sistema.
 */
export function useTheme() {
  const context = useContext(ThemeProviderContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  const { theme, setTheme } = context;

  // Resolver o tema para 'light' ou 'dark' considerando 'system'
  let resolvedTheme: 'light' | 'dark' = 'light';
  if (theme === 'dark') {
    resolvedTheme = 'dark';
  } else if (theme === 'system') {
    resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  const toggleTheme = () => {
    if (resolvedTheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
}