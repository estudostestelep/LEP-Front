export interface ThemeCustomization {
  id: string;
  project_id: string;
  organization_id: string;

  // Cores Principais (7 campos originais)
  primary_color: string;           // Cor primária (#3b82f6)
  secondary_color: string;         // Cor secundária (#8b5cf6)
  background_color: string;        // Fundo (#09090b)
  card_background_color: string;   // Fundo do card (#18181b)
  text_color: string;              // Texto principal (#fafafa)
  text_secondary_color: string;    // Texto secundário (#a1a1aa)
  accent_color: string;            // Cor de destaque (#ec4899)

  // Cores Semânticas (5 novos campos)
  destructive_color?: string;      // Cor para erros/delete (#EF4444)
  success_color?: string;          // Cor para sucesso (#10B981)
  warning_color?: string;          // Cor para aviso (#F59E0B)
  border_color?: string;           // Cor para bordas (#E5E7EB)
  price_color?: string;            // Cor para preços (#10B981 padrão, mas customizável)

  // Configurações do Sistema (4 novos campos)
  disabled_opacity?: number;       // Opacidade para disabled (0.5)
  focus_ring_color?: string;       // Cor para focus ring (#3B82F6)
  input_background_color?: string; // Fundo de inputs (diferente de card)
  shadow_intensity?: number;       // Intensidade de shadows (1.0)

  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  textColor: string;
  textSecondaryColor: string;
  accentColor: string;
}

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primaryColor: '#000000',      // Não usado - usa CSS variables padrão do Tailwind
  secondaryColor: '#ffffff',    // Não usado - usa CSS variables padrão do Tailwind
  backgroundColor: '#ffffff',   // Não usado - usa CSS variables padrão do Tailwind
  cardBackgroundColor: '#ffffff', // Não usado - usa CSS variables padrão do Tailwind
  textColor: '#000000',         // Não usado - usa CSS variables padrão do Tailwind
  textSecondaryColor: '#666666', // Não usado - usa CSS variables padrão do Tailwind
  accentColor: '#cccccc',       // Não usado - usa CSS variables padrão do Tailwind
};

// ============================================================================
// THEME DEFINITION - Interface principal para temas
// ============================================================================

/**
 * Interface completa para definição de um tema
 * Inclui cores, tipografia, espaçamento e outros design tokens
 */
export interface ThemeDefinition {
  id?: string;
  name: string;
  description?: string;

  // Cores principais
  colors: {
    // Backgrounds
    background: string; // Fundo principal da página
    card: string; // Fundo de cards/containers
    popover: string; // Fundo de popovers/dropdowns

    // Foregrounds
    foreground: string; // Texto principal
    cardForeground: string; // Texto em cards
    popoverForeground: string; // Texto em popovers

    // Primary
    primary: string; // Cor principal (botões, destaques)
    primaryForeground: string; // Texto em elementos primários

    // Secondary
    secondary: string; // Cor secundária
    secondaryForeground: string; // Texto em elementos secundários

    // Muted
    muted: string; // Cor para estados desabilitados
    mutedForeground: string; // Texto em estados desabilitados

    // Accent
    accent: string; // Cor de destaque
    accentForeground: string; // Texto em destaques

    // Destructive
    destructive: string; // Cor para ações destrutivas
    destructiveForeground: string; // Texto em ações destrutivas

    // Borders
    border: string; // Cor padrão de bordas
    input: string; // Cor de bordas de inputs
    ring: string; // Cor de focus ring
  };

  // Tipografia (opcional - usa Tailwind defaults se não definido)
  typography?: {
    fontFamily?: string;
    fontSize?: Record<string, string>;
    fontWeight?: Record<string, number>;
    lineHeight?: Record<string, number>;
  };

  // Espaçamento (opcional - usa padrão se não definido)
  spacing?: Record<string, string>;

  // Shadows (opcional)
  shadows?: Record<string, string>;

  // Border radius (opcional)
  radius?: Record<string, string>;

  // Transitions (opcional)
  transitions?: Record<string, string>;

  // Metadados
  isDarkMode?: boolean;
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// DEFAULT THEMES - Temas pré-definidos profissionais
// ============================================================================

/**
 * Tema Light padrão - profissional e acessível
 */
export const DEFAULT_THEME_LIGHT: ThemeDefinition = {
  name: 'Light (Padrão)',
  description: 'Tema claro profissional com excelente contraste',
  isDarkMode: false,
  isCustom: false,
  colors: {
    // Backgrounds
    background: '#FFFFFF',
    card: '#FFFFFF',
    popover: '#FFFFFF',

    // Foregrounds
    foreground: '#0F172A',
    cardForeground: '#0F172A',
    popoverForeground: '#0F172A',

    // Primary
    primary: '#1E293B',
    primaryForeground: '#F8FAFC',

    // Secondary
    secondary: '#F0F4F8',
    secondaryForeground: '#1E293B',

    // Muted
    muted: '#F0F4F8',
    mutedForeground: '#64748B',

    // Accent
    accent: '#F0F4F8',
    accentForeground: '#1E293B',

    // Destructive
    destructive: '#EF4444',
    destructiveForeground: '#F8FAFC',

    // Borders
    border: '#E2E8F0',
    input: '#E2E8F0',
    ring: '#0F172A',
  },
};

/**
 * Tema Dark padrão - profissional e acessível
 */
export const DEFAULT_THEME_DARK: ThemeDefinition = {
  name: 'Dark (Padrão)',
  description: 'Tema escuro profissional com excelente contraste',
  isDarkMode: true,
  isCustom: false,
  colors: {
    // Backgrounds
    background: '#0F172A',
    card: '#1E293B',
    popover: '#1E293B',

    // Foregrounds
    foreground: '#F8FAFC',
    cardForeground: '#F8FAFC',
    popoverForeground: '#F8FAFC',

    // Primary
    primary: '#F8FAFC',
    primaryForeground: '#1E293B',

    // Secondary
    secondary: '#334155',
    secondaryForeground: '#F8FAFC',

    // Muted
    muted: '#334155',
    mutedForeground: '#94A3B8',

    // Accent
    accent: '#475569',
    accentForeground: '#F8FAFC',

    // Destructive
    destructive: '#DC2626',
    destructiveForeground: '#F8FAFC',

    // Borders
    border: '#475569',
    input: '#334155',
    ring: '#CBD5E1',
  },
};

// ============================================================================
// THEME PRESETS
// ============================================================================

export const THEME_PRESETS: Record<string, ThemeDefinition> = {
  lightDefault: DEFAULT_THEME_LIGHT,
  darkDefault: DEFAULT_THEME_DARK,
};
