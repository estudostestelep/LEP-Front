/**
 * Design Tokens - LEP System
 *
 * Constantes TypeScript para todos os design tokens do sistema.
 * Sincronizadas com as variáveis CSS em src/index.css
 *
 * Uso:
 * import { COLORS, SPACING, SHADOWS } from '@/tokens/design-tokens';
 *
 * style={{ gap: SPACING.sm, boxShadow: SHADOWS.md }}
 */

// ============================================================================
// COLORS - Cores Semânticas (resolvem para variáveis CSS)
// ============================================================================

export const COLORS = {
  // Backgrounds
  background: 'hsl(var(--background))',
  card: 'hsl(var(--card))',
  popover: 'hsl(var(--popover))',

  // Foreground / Text
  foreground: 'hsl(var(--foreground))',
  cardForeground: 'hsl(var(--card-foreground))',
  popoverForeground: 'hsl(var(--popover-foreground))',

  // Primary
  primary: 'hsl(var(--primary))',
  primaryForeground: 'hsl(var(--primary-foreground))',

  // Secondary
  secondary: 'hsl(var(--secondary))',
  secondaryForeground: 'hsl(var(--secondary-foreground))',

  // Muted
  muted: 'hsl(var(--muted))',
  mutedForeground: 'hsl(var(--muted-foreground))',

  // Accent
  accent: 'hsl(var(--accent))',
  accentForeground: 'hsl(var(--accent-foreground))',

  // Destructive
  destructive: 'hsl(var(--destructive))',
  destructiveForeground: 'hsl(var(--destructive-foreground))',

  // Borders & Inputs
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
} as const;

// ============================================================================
// SPACING - Escala de Espaçamento (base 4px)
// ============================================================================

export const SPACING = {
  unit: 'var(--spacing-unit)', // 4px (0.25rem)
  xs: 'var(--spacing-xs)', // 8px (0.5rem)
  sm: 'var(--spacing-sm)', // 16px (1rem)
  md: 'var(--spacing-md)', // 24px (1.5rem)
  lg: 'var(--spacing-lg)', // 32px (2rem)
  xl: 'var(--spacing-xl)', // 48px (3rem)
  '2xl': 'var(--spacing-2xl)', // 64px (4rem)
} as const;

export const SPACING_VALUES = {
  unit: '0.25rem',
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
  '2xl': '4rem',
} as const;

// ============================================================================
// BORDER RADIUS - Raio de Borda
// ============================================================================

export const BORDER_RADIUS = {
  sm: 'var(--border-radius-sm)', // 6px (0.375rem)
  md: 'var(--border-radius-md)', // 8px (0.5rem)
  lg: 'var(--border-radius-lg)', // 12px (0.75rem)
} as const;

export const BORDER_RADIUS_VALUES = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
} as const;

// ============================================================================
// BORDERS - Estilos de Borda
// ============================================================================

export const BORDER_WIDTH = {
  default: 'var(--border-width)', // 1px
} as const;

export const BORDERS = {
  default: `var(--border-width) solid hsl(var(--border))`,
  input: `var(--border-width) solid hsl(var(--input))`,
} as const;

// ============================================================================
// SHADOWS - Sombras e Elevação
// ============================================================================

export const SHADOWS = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
} as const;

export const SHADOWS_VALUES = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

// ============================================================================
// TRANSITIONS - Animações e Transições
// ============================================================================

export const TRANSITIONS = {
  fast: 'var(--transition-fast)', // 150ms ease-in-out
  base: 'var(--transition-base)', // 200ms ease-in-out
  slow: 'var(--transition-slow)', // 300ms ease-in-out
} as const;

export const TRANSITIONS_VALUES = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
} as const;

// ============================================================================
// BUTTONS - Estilos de Botão
// ============================================================================

export const BUTTON = {
  paddingY: 'var(--button-padding-y)', // 0.5rem
  paddingX: 'var(--button-padding-x)', // 1rem
  borderWidth: 'var(--button-border-width)', // 1px
  borderRadius: 'var(--button-border-radius)', // 0.5rem
} as const;

export const BUTTON_VALUES = {
  paddingY: '0.5rem',
  paddingX: '1rem',
  borderWidth: '1px',
  borderRadius: '0.5rem',
  padding: '0.5rem 1rem',
} as const;

// ============================================================================
// INPUTS - Estilos de Input
// ============================================================================

export const INPUT = {
  paddingY: 'var(--input-padding-y)', // 0.5rem
  paddingX: 'var(--input-padding-x)', // 0.75rem
  height: 'var(--input-height)', // 2.5rem (40px)
  borderRadius: 'var(--input-border-radius)', // 0.5rem
} as const;

export const INPUT_VALUES = {
  paddingY: '0.5rem',
  paddingX: '0.75rem',
  height: '2.5rem',
  borderRadius: '0.5rem',
  padding: '0.5rem 0.75rem',
} as const;

// ============================================================================
// OPACITY - Estados de Opacidade
// ============================================================================

export const OPACITY = {
  disabled: 'var(--opacity-disabled)', // 0.5
  hover: 'var(--opacity-hover)', // 0.9
} as const;

export const OPACITY_VALUES = {
  disabled: 0.5,
  hover: 0.9,
} as const;

// ============================================================================
// TYPOGRAPHY - Escalas de Tipografia (usando Tailwind defaults)
// ============================================================================

export const FONT_SIZE = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  base: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
} as const;

export const FONT_WEIGHT = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export const LINE_HEIGHT = {
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// ============================================================================
// Z-INDEX - Camadas de Profundidade
// ============================================================================

export const Z_INDEX = {
  hide: '-1',
  base: '0',
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  backdrop: '1040',
  offcanvas: '1050',
  modal: '1060',
  popover: '1070',
  tooltip: '1080',
} as const;

// ============================================================================
// SEMANTIC TOKENS - Tokens Semânticos (compostos)
// ============================================================================

export const SEMANTIC = {
  focusRing: {
    outline: 'none',
    boxShadow: `0 0 0 3px hsl(var(--background)), 0 0 0 5px hsl(var(--ring))`,
  },
  focusRingDark: {
    outline: 'none',
    boxShadow: `0 0 0 3px hsl(var(--card)), 0 0 0 5px hsl(var(--ring))`,
  },
  disabledState: {
    opacity: OPACITY_VALUES.disabled,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  hoverTransition: {
    transition: `all var(--transition-base)`,
  },
} as const;

// ============================================================================
// PRESET COMBINATIONS - Combinações Pré-Definidas
// ============================================================================

export const BUTTON_STYLES = {
  primary: {
    backgroundColor: COLORS.primary,
    color: COLORS.primaryForeground,
    padding: BUTTON_VALUES.padding,
    borderRadius: BUTTON_VALUES.borderRadius,
    border: 'none',
    cursor: 'pointer',
    transition: `all var(--transition-base)`,
    '&:hover': {
      opacity: OPACITY_VALUES.hover,
    },
    '&:disabled': SEMANTIC.disabledState,
  },
  outline: {
    backgroundColor: 'transparent',
    color: COLORS.primary,
    padding: BUTTON_VALUES.padding,
    borderRadius: BUTTON_VALUES.borderRadius,
    border: `1px solid hsl(var(--border))`,
    cursor: 'pointer',
    transition: `all var(--transition-base)`,
    '&:hover': {
      backgroundColor: `hsl(var(--muted))`,
    },
    '&:disabled': SEMANTIC.disabledState,
  },
} as const;

export const INPUT_STYLES = {
  base: {
    padding: INPUT_VALUES.padding,
    borderRadius: INPUT_VALUES.borderRadius,
    border: `1px solid hsl(var(--input))`,
    backgroundColor: COLORS.card,
    color: COLORS.cardForeground,
    fontSize: FONT_SIZE.base,
    transition: `all var(--transition-base)`,
  },
  focus: {
    outline: 'none',
    borderColor: COLORS.ring,
    boxShadow: SEMANTIC.focusRing.boxShadow,
  },
} as const;

export const CARD_STYLES = {
  base: {
    backgroundColor: COLORS.card,
    color: COLORS.cardForeground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    boxShadow: SHADOWS.sm,
  },
  elevated: {
    backgroundColor: COLORS.card,
    color: COLORS.cardForeground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    boxShadow: SHADOWS.md,
  },
} as const;
