/**
 * Theme Generator - LEP System
 *
 * Funções para gerar e aplicar temas dinamicamente.
 * Converte objetos de tema em variáveis CSS e as aplica ao DOM.
 */

import { hexToRgb, normalizeHex } from './color-utils';

// ============================================================================
// TYPES
// ============================================================================

export interface ThemeColors {
  primary: string;
  secondary?: string;
  background?: string;
  card?: string;
  accent?: string;
  destructive?: string;
  [key: string]: string | undefined;
}

export interface CSSVariableMap {
  [key: string]: string;
}

// ============================================================================
// HEX TO HSL CONVERSION
// ============================================================================

/**
 * Converte HEX para HSL (formato usado nas variáveis CSS do projeto)
 * @param hex - Cor em HEX
 * @returns String no formato "H S% L%" (exemplo: "220 60% 50%")
 */
export function hexToHsl(hex: string): string {
  const normalized = normalizeHex(hex);
  const rgb = hexToRgb(normalized);

  // Normaliza RGB para 0-1
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lRounded = Math.round(l * 100);

  return `${h} ${s}% ${lRounded}%`;
}

// ============================================================================
// THEME VARIABLES GENERATOR
// ============================================================================

/**
 * Gera um mapa de variáveis CSS a partir de um objeto de tema
 * @param colors - Objeto com as cores do tema
 * @param prefix - Prefixo para as variáveis (padrão: '--')
 * @returns Mapa de variáveis CSS
 */
export function generateThemeVariables(
  colors: ThemeColors,
  prefix: string = '--'
): CSSVariableMap {
  const variables: CSSVariableMap = {};

  Object.entries(colors).forEach(([key, value]) => {
    if (value) {
      try {
        // Converte HEX para HSL
        const hslValue = hexToHsl(value);

        // Usa o nome da chave como nome da variável
        // Exemplo: 'primary' -> '--primary'
        const cssVarName = `${prefix}${key}`;
        variables[cssVarName] = hslValue;
      } catch (error) {
        console.warn(`Invalid color for ${key}: ${value}`, error);
      }
    }
  });

  return variables;
}

// ============================================================================
// APPLY THEME TO DOM
// ============================================================================

/**
 * Aplica variáveis de tema ao elemento raiz (ou outro elemento)
 * @param variables - Mapa de variáveis CSS
 * @param element - Elemento a aplicar (padrão: document.documentElement)
 */
export function applyThemeVariables(
  variables: CSSVariableMap,
  element: HTMLElement = document.documentElement
): void {
  Object.entries(variables).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
}

/**
 * Remove variáveis de tema do elemento
 * @param variableNames - Nomes das variáveis a remover
 * @param element - Elemento de onde remover (padrão: document.documentElement)
 */
export function removeThemeVariables(
  variableNames: string[],
  element: HTMLElement = document.documentElement
): void {
  variableNames.forEach((name) => {
    element.style.removeProperty(name);
  });
}

/**
 * Aplica tema diretamente do objeto de cores
 * @param colors - Objeto com as cores do tema
 * @param element - Elemento a aplicar (padrão: document.documentElement)
 */
export function applyTheme(
  colors: ThemeColors,
  element?: HTMLElement
): void {
  const variables = generateThemeVariables(colors);
  applyThemeVariables(variables, element);
}

// ============================================================================
// THEME PERSISTENCE
// ============================================================================

const THEME_STORAGE_KEY = 'lep-custom-theme';

/**
 * Salva tema customizado no localStorage
 * @param colors - Objeto com as cores do tema
 */
export function saveThemeToStorage(colors: ThemeColors): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(colors));
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
}

/**
 * Recupera tema customizado do localStorage
 * @returns Objeto com as cores do tema, ou null se não encontrado
 */
export function getThemeFromStorage(): ThemeColors | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to retrieve theme from localStorage:', error);
    return null;
  }
}

/**
 * Remove tema customizado do localStorage
 */
export function removeThemeFromStorage(): void {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to remove theme from localStorage:', error);
  }
}

// ============================================================================
// THEME CSS GENERATION
// ============================================================================

/**
 * Gera CSS bruto a partir de um objeto de tema
 * Útil para exportar tema como arquivo CSS
 * @param colors - Objeto com as cores do tema
 * @param selector - Seletor CSS a usar (padrão: ':root')
 * @returns String com CSS formatado
 */
export function generateThemeCSS(
  colors: ThemeColors,
  selector: string = ':root'
): string {
  const variables = generateThemeVariables(colors);

  const cssLines = Object.entries(variables).map(
    ([key, value]) => `  ${key}: ${value};`
  );

  return `${selector} {\n${cssLines.join('\n')}\n}`;
}

/**
 * Gera arquivo CSS completo com tema
 * @param colors - Objeto com as cores do tema
 * @param filename - Nome do arquivo (padrão: 'custom-theme.css')
 */
export function downloadThemeCSS(colors: ThemeColors, filename: string = 'custom-theme.css'): void {
  const css = generateThemeCSS(colors);

  const blob = new Blob([css], { type: 'text/css' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================================================
// THEME VALIDATION
// ============================================================================

/**
 * Valida um objeto de tema
 * @param colors - Objeto a validar
 * @returns true se válido, false caso contrário
 */
export function isValidTheme(colors: unknown): colors is ThemeColors {
  if (!colors || typeof colors !== 'object') {
    return false;
  }

  const theme = colors as Record<string, unknown>;

  // Deve ter pelo menos a cor 'primary'
  if (!theme.primary || typeof theme.primary !== 'string') {
    return false;
  }

  // Todas as cores devem ser strings válidas em HEX
  for (const [, value] of Object.entries(theme)) {
    if (value !== undefined && typeof value !== 'string') {
      return false;
    }
    if (typeof value === 'string') {
      try {
        normalizeHex(value);
      } catch {
        return false;
      }
    }
  }

  return true;
}

// ============================================================================
// THEME PRESETS
// ============================================================================

export const THEME_PRESETS = {
  professional: {
    primary: '#1E293B',
    secondary: '#64748B',
    accent: '#3B82F6',
    destructive: '#EF4444',
    background: '#FFFFFF',
    card: '#FFFFFF',
  },
  ocean: {
    primary: '#0369A1',
    secondary: '#06B6D4',
    accent: '#0EA5E9',
    destructive: '#DC2626',
    background: '#FFFFFF',
    card: '#F0F9FF',
  },
  sunset: {
    primary: '#EA580C',
    secondary: '#F97316',
    accent: '#FB923C',
    destructive: '#DC2626',
    background: '#FFFFFF',
    card: '#FFF7ED',
  },
  forest: {
    primary: '#15803D',
    secondary: '#22C55E',
    accent: '#84CC16',
    destructive: '#DC2626',
    background: '#FFFFFF',
    card: '#F0FDF4',
  },
  midnight: {
    primary: '#1E1B4B',
    secondary: '#3F3F46',
    accent: '#6366F1',
    destructive: '#DC2626',
    background: '#0F172A',
    card: '#1E293B',
  },
} as const;

/**
 * Retorna um tema preset pelo nome
 * @param presetName - Nome do preset
 * @returns Objeto com as cores do preset
 */
export function getThemePreset(
  presetName: keyof typeof THEME_PRESETS
): ThemeColors {
  return THEME_PRESETS[presetName];
}

/**
 * Lista todos os presets disponíveis
 * @returns Array com os nomes dos presets
 */
export function listThemePresets(): Array<keyof typeof THEME_PRESETS> {
  return Object.keys(THEME_PRESETS) as Array<keyof typeof THEME_PRESETS>;
}
