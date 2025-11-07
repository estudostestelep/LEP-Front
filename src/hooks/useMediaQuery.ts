import { useState, useEffect } from 'react';

/**
 * Hook para detectar media queries
 * Útil para renderização condicional baseada em tamanho de tela
 *
 * @param query - Media query string (ex: "(min-width: 1024px)")
 * @returns boolean indicando se a media query é atendida
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Verificar se window está disponível (SSR safe)
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create listener function
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Add listener
    media.addEventListener('change', listener);

    // Cleanup
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * Predefined breakpoints que correspondem ao Tailwind
 */
export const BREAKPOINTS = {
  sm: '(min-width: 640px)',     // sm
  md: '(min-width: 768px)',     // md
  lg: '(min-width: 1024px)',    // lg
  xl: '(min-width: 1280px)',    // xl
  '2xl': '(min-width: 1536px)', // 2xl
} as const;

/**
 * Hook de conveniência para breakpoint lg (usado para cards vs list)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(BREAKPOINTS.lg);
}

/**
 * Hook de conveniência para breakpoint md
 */
export function useIsMedium(): boolean {
  return useMediaQuery(BREAKPOINTS.md);
}

/**
 * Hook de conveniência para mobile (abaixo de md)
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: 767px)`);
}
