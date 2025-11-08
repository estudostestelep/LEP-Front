export interface ThemeCustomization {
  id: string;
  project_id: string;
  organization_id: string;

  // ============================================================================
  // LEGADO - Campos originais (mantidos para compatibilidade)
  // ============================================================================
  primary_color?: string;           // DEPRECATED: Use primary_color_light/dark
  secondary_color?: string;         // DEPRECATED: Use secondary_color_light/dark
  background_color?: string;        // DEPRECATED: Use background_color_light/dark
  card_background_color?: string;   // DEPRECATED: Use card_background_color_light/dark
  text_color?: string;              // DEPRECATED: Use text_color_light/dark
  text_secondary_color?: string;    // DEPRECATED: Use text_secondary_color_light/dark
  accent_color?: string;            // DEPRECATED: Use accent_color_light/dark
  destructive_color?: string;       // DEPRECATED: Use destructive_color_light/dark
  success_color?: string;           // DEPRECATED: Use success_color_light/dark
  warning_color?: string;           // DEPRECATED: Use warning_color_light/dark
  border_color?: string;            // DEPRECATED: Use border_color_light/dark
  price_color?: string;             // DEPRECATED: Use price_color_light/dark
  focus_ring_color?: string;        // DEPRECATED: Use focus_ring_color_light/dark
  input_background_color?: string;  // DEPRECATED: Use input_background_color_light/dark

  // ============================================================================
  // NOVO - Cores Principais com variantes Light/Dark (11 cores)
  // ============================================================================
  primary_color_light?: string;           // Light mode (#1E293B)
  primary_color_dark?: string;            // Dark mode (#F8FAFC)
  secondary_color_light?: string;         // Light mode (#8B5CF6)
  secondary_color_dark?: string;          // Dark mode (#A78BFA)
  background_color_light?: string;        // Light mode (#FFFFFF)
  background_color_dark?: string;         // Dark mode (#0F172A)
  card_background_color_light?: string;   // Light mode (#FFFFFF)
  card_background_color_dark?: string;    // Dark mode (#1E293B)
  text_color_light?: string;              // Light mode (#0F172A)
  text_color_dark?: string;               // Dark mode (#F8FAFC)
  text_secondary_color_light?: string;    // Light mode (#64748B)
  text_secondary_color_dark?: string;     // Dark mode (#94A3B8)
  accent_color_light?: string;            // Light mode (#EC4899)
  accent_color_dark?: string;             // Dark mode (#F472B6)

  // ============================================================================
  // NOVO - Cores Semânticas com variantes Light/Dark (5 cores)
  // ============================================================================
  destructive_color_light?: string;       // Light mode (#EF4444)
  destructive_color_dark?: string;        // Dark mode (#DC2626)
  success_color_light?: string;           // Light mode (#10B981)
  success_color_dark?: string;            // Dark mode (#34D399)
  warning_color_light?: string;           // Light mode (#F59E0B)
  warning_color_dark?: string;            // Dark mode (#FBBF24)
  border_color_light?: string;            // Light mode (#E5E7EB)
  border_color_dark?: string;             // Dark mode (#475569)
  price_color_light?: string;             // Light mode (#10B981)
  price_color_dark?: string;              // Dark mode (#34D399)

  // ============================================================================
  // NOVO - Configurações do Sistema com variantes Light/Dark (2 cores)
  // ============================================================================
  focus_ring_color_light?: string;        // Light mode (#3B82F6)
  focus_ring_color_dark?: string;         // Dark mode (#93C5FD)
  input_background_color_light?: string;  // Light mode (#F3F4F6)
  input_background_color_dark?: string;   // Dark mode (#1F2937)

  // Configurações numéricas (aplicadas a ambos os modos)
  disabled_opacity?: number;              // Opacidade para disabled (0.5)
  shadow_intensity?: number;              // Intensidade de shadows (1.0)

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
