import api from "./api";
import { ThemeCustomization } from "@/types/theme";

/**
 * 🎨 Serviço para gerenciar customização de tema do projeto com suporte a Light/Dark
 *
 * Endpoints:
 * - GET /project/settings/theme
 * - POST /project/settings/theme
 * - PUT /project/settings/theme
 * - POST /project/settings/theme/reset
 * - DELETE /project/settings/theme
 */
export const themeCustomizationService = {
  /**
   * Obter customização de tema do projeto
   */
  getTheme: () => api.get<ThemeCustomization>("/project/settings/theme"),

  /**
   * Criar ou atualizar customização de tema
   */
  saveTheme: (theme: Partial<ThemeCustomization>) =>
    api.post<ThemeCustomization>("/project/settings/theme", theme),

  /**
   * Atualizar customização de tema (alias PUT)
   */
  updateTheme: (theme: Partial<ThemeCustomization>) =>
    api.put<ThemeCustomization>("/project/settings/theme", theme),

  /**
   * Resetar para cores padrão (light/dark profissionais)
   */
  resetToDefaults: () =>
    api.post<ThemeCustomization>("/project/settings/theme/reset", {}),

  /**
   * Deletar customização de tema
   */
  deleteTheme: () => api.delete<{ message: string }>("/project/settings/theme"),
};

/**
 * ==================== VALIDATION FUNCTIONS ====================
 */

/**
 * Validar cor HEX (#RRGGBB ou #RRGGBBAA)
 */
export const validateHexColor = (color: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
  return hexRegex.test(color);
};

/**
 * Validar opacidade (0.0 - 1.0)
 */
export const validateOpacity = (value: number | undefined): boolean => {
  if (value === undefined) return true;
  return value >= 0 && value <= 1;
};

/**
 * Validar intensidade de sombras (0.0 - 2.0)
 */
export const validateShadowIntensity = (value: number | undefined): boolean => {
  if (value === undefined) return true;
  return value >= 0 && value <= 2;
};

/**
 * Validar todas as cores e configurações de tema (Light/Dark)
 */
export const validateThemeColors = (theme: Partial<ThemeCustomization>): string[] => {
  const errors: string[] = [];

  // ========== LIGHT MODE - 11 cores principais ==========
  const lightMainColors = [
    { key: "primary_color_light", label: "Cor Primária (Light)" },
    { key: "secondary_color_light", label: "Cor Secundária (Light)" },
    { key: "background_color_light", label: "Fundo (Light)" },
    { key: "card_background_color_light", label: "Fundo do Card (Light)" },
    { key: "text_color_light", label: "Texto Principal (Light)" },
    { key: "text_secondary_color_light", label: "Texto Secundário (Light)" },
    { key: "accent_color_light", label: "Cor de Destaque (Light)" },
  ];

  // ========== DARK MODE - 11 cores principais ==========
  const darkMainColors = [
    { key: "primary_color_dark", label: "Cor Primária (Dark)" },
    { key: "secondary_color_dark", label: "Cor Secundária (Dark)" },
    { key: "background_color_dark", label: "Fundo (Dark)" },
    { key: "card_background_color_dark", label: "Fundo do Card (Dark)" },
    { key: "text_color_dark", label: "Texto Principal (Dark)" },
    { key: "text_secondary_color_dark", label: "Texto Secundário (Dark)" },
    { key: "accent_color_dark", label: "Cor de Destaque (Dark)" },
  ];

  // ========== LIGHT MODE - 5 cores semânticas ==========
  const lightSemanticColors = [
    { key: "destructive_color_light", label: "Cor de Erro (Light)" },
    { key: "success_color_light", label: "Cor de Sucesso (Light)" },
    { key: "warning_color_light", label: "Cor de Aviso (Light)" },
    { key: "border_color_light", label: "Cor de Bordas (Light)" },
    { key: "price_color_light", label: "Cor do Preço (Light)" },
  ];

  // ========== DARK MODE - 5 cores semânticas ==========
  const darkSemanticColors = [
    { key: "destructive_color_dark", label: "Cor de Erro (Dark)" },
    { key: "success_color_dark", label: "Cor de Sucesso (Dark)" },
    { key: "warning_color_dark", label: "Cor de Aviso (Dark)" },
    { key: "border_color_dark", label: "Cor de Bordas (Dark)" },
    { key: "price_color_dark", label: "Cor do Preço (Dark)" },
  ];

  // ========== LIGHT MODE - 2 cores sistema ==========
  const lightSystemColors = [
    { key: "focus_ring_color_light", label: "Cor de Focus Ring (Light)" },
    { key: "input_background_color_light", label: "Fundo de Inputs (Light)" },
  ];

  // ========== DARK MODE - 2 cores sistema ==========
  const darkSystemColors = [
    { key: "focus_ring_color_dark", label: "Cor de Focus Ring (Dark)" },
    { key: "input_background_color_dark", label: "Fundo de Inputs (Dark)" },
  ];

  const allColorFields = [
    ...lightMainColors,
    ...darkMainColors,
    ...lightSemanticColors,
    ...darkSemanticColors,
    ...lightSystemColors,
    ...darkSystemColors,
  ];

  // Validar cores HEX
  for (const field of allColorFields) {
    const value = theme[field.key as keyof ThemeCustomization] as string | undefined;
    if (value && !validateHexColor(value)) {
      errors.push(`${field.label} deve estar em formato HEX válido (#RRGGBB)`);
    }
  }

  // Validar opacidade desabilitada
  if (theme.disabled_opacity !== undefined && !validateOpacity(theme.disabled_opacity)) {
    errors.push("Opacidade deve estar entre 0.0 e 1.0");
  }

  // Validar intensidade de sombras
  if (theme.shadow_intensity !== undefined && !validateShadowIntensity(theme.shadow_intensity)) {
    errors.push("Intensidade de sombras deve estar entre 0.0 e 2.0");
  }

  return errors;
};

/**
 * ==================== THEME UTILITIES ====================
 */

/**
 * Converte HEX para HSL (formato shadcn/ui)
 * @param hex - Cor em HEX (#RRGGBB ou #RRGGBBAA)
 * @returns String no formato "H S% L%" (exemplo: "220 60% 50%")
 */
const hexToHsl = (hex: string): string => {
  // Remove o # se presente
  const normalized = hex.replace(/^#/, '');

  // Parse RGB
  const r = parseInt(normalized.substring(0, 2), 16) / 255;
  const g = parseInt(normalized.substring(2, 4), 16) / 255;
  const b = parseInt(normalized.substring(4, 6), 16) / 255;

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
};

/**
 * Converter tema para CSS variables (formato shadcn/ui)
 * Aplica cores baseado no modo light/dark atual
 * Mapeia as cores do backend para as variáveis CSS esperadas pelo index.css
 */
export const themeToCSSVariables = (theme: ThemeCustomization, isDarkMode: boolean): Record<string, string> => {
  const variables: Record<string, string> = {};

  if (isDarkMode) {
    // DARK MODE - Cores principais
    if (theme.primary_color_dark) variables["--primary"] = hexToHsl(theme.primary_color_dark);
    if (theme.secondary_color_dark) variables["--secondary"] = hexToHsl(theme.secondary_color_dark);
    if (theme.background_color_dark) variables["--background"] = hexToHsl(theme.background_color_dark);
    if (theme.card_background_color_dark) variables["--card"] = hexToHsl(theme.card_background_color_dark);
    if (theme.text_color_dark) variables["--foreground"] = hexToHsl(theme.text_color_dark);
    if (theme.card_foreground_color_dark) variables["--card-foreground"] = hexToHsl(theme.card_foreground_color_dark);
    if (theme.popover_foreground_color_dark) variables["--popover-foreground"] = hexToHsl(theme.popover_foreground_color_dark);
    if (theme.text_secondary_color_dark) variables["--muted-foreground"] = hexToHsl(theme.text_secondary_color_dark);
    if (theme.accent_color_dark) variables["--accent"] = hexToHsl(theme.accent_color_dark);
    if (theme.secondary_foreground_color_dark) variables["--secondary-foreground"] = hexToHsl(theme.secondary_foreground_color_dark);
    if (theme.accent_foreground_color_dark) variables["--accent-foreground"] = hexToHsl(theme.accent_foreground_color_dark);
    if (theme.muted_color_dark) variables["--muted"] = hexToHsl(theme.muted_color_dark);

    // Semânticas dark
    if (theme.destructive_color_dark) variables["--destructive"] = hexToHsl(theme.destructive_color_dark);
    if (theme.success_color_dark) variables["--success"] = hexToHsl(theme.success_color_dark);
    if (theme.warning_color_dark) variables["--warning"] = hexToHsl(theme.warning_color_dark);
    if (theme.border_color_dark) variables["--border"] = hexToHsl(theme.border_color_dark);
    if (theme.price_color_dark) variables["--price"] = hexToHsl(theme.price_color_dark);
    if (theme.info_color_dark) variables["--info"] = hexToHsl(theme.info_color_dark);
    if (theme.rating_color_dark) variables["--rating"] = hexToHsl(theme.rating_color_dark);
    if (theme.time_color_dark) variables["--time"] = hexToHsl(theme.time_color_dark);

    // Sistema dark
    if (theme.focus_ring_color_dark) variables["--ring"] = hexToHsl(theme.focus_ring_color_dark);
    if (theme.input_background_color_dark) variables["--input"] = hexToHsl(theme.input_background_color_dark);
  } else {
    // LIGHT MODE - Cores principais
    if (theme.primary_color_light) variables["--primary"] = hexToHsl(theme.primary_color_light);
    if (theme.secondary_color_light) variables["--secondary"] = hexToHsl(theme.secondary_color_light);
    if (theme.background_color_light) variables["--background"] = hexToHsl(theme.background_color_light);
    if (theme.card_background_color_light) variables["--card"] = hexToHsl(theme.card_background_color_light);
    if (theme.text_color_light) variables["--foreground"] = hexToHsl(theme.text_color_light);
    if (theme.card_foreground_color_light) variables["--card-foreground"] = hexToHsl(theme.card_foreground_color_light);
    if (theme.popover_foreground_color_light) variables["--popover-foreground"] = hexToHsl(theme.popover_foreground_color_light);
    if (theme.text_secondary_color_light) variables["--muted-foreground"] = hexToHsl(theme.text_secondary_color_light);
    if (theme.accent_color_light) variables["--accent"] = hexToHsl(theme.accent_color_light);
    if (theme.secondary_foreground_color_light) variables["--secondary-foreground"] = hexToHsl(theme.secondary_foreground_color_light);
    if (theme.accent_foreground_color_light) variables["--accent-foreground"] = hexToHsl(theme.accent_foreground_color_light);
    if (theme.muted_color_light) variables["--muted"] = hexToHsl(theme.muted_color_light);

    // Semânticas light
    if (theme.destructive_color_light) variables["--destructive"] = hexToHsl(theme.destructive_color_light);
    if (theme.success_color_light) variables["--success"] = hexToHsl(theme.success_color_light);
    if (theme.warning_color_light) variables["--warning"] = hexToHsl(theme.warning_color_light);
    if (theme.border_color_light) variables["--border"] = hexToHsl(theme.border_color_light);
    if (theme.price_color_light) variables["--price"] = hexToHsl(theme.price_color_light);
    if (theme.info_color_light) variables["--info"] = hexToHsl(theme.info_color_light);
    if (theme.rating_color_light) variables["--rating"] = hexToHsl(theme.rating_color_light);
    if (theme.time_color_light) variables["--time"] = hexToHsl(theme.time_color_light);

    // Sistema light
    if (theme.focus_ring_color_light) variables["--ring"] = hexToHsl(theme.focus_ring_color_light);
    if (theme.input_background_color_light) variables["--input"] = hexToHsl(theme.input_background_color_light);
  }

  // Configurações numéricas (aplicam em ambos os modos)
  if (theme.disabled_opacity !== undefined) {
    variables["--opacity-disabled"] = theme.disabled_opacity.toString();
  }
  if (theme.shadow_intensity !== undefined) {
    variables["--shadow-intensity"] = theme.shadow_intensity.toString();
  }

  return variables;
};

/**
 * Obter tema do localStorage como fallback
 */
export const getThemeFromLocalStorage = (): ThemeCustomization | null => {
  try {
    const stored = localStorage.getItem("theme_customization");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to parse stored theme:", error);
  }
  return null;
};

/**
 * Salvar tema no localStorage
 */
export const saveThemeToLocalStorage = (theme: ThemeCustomization): void => {
  try {
    localStorage.setItem("theme_customization", JSON.stringify(theme));
  } catch (error) {
    console.error("Failed to save theme to localStorage:", error);
  }
};

/**
 * Obter tema padrão profissional com luz/dark
 */
export const getDefaultTheme = (): ThemeCustomization => ({
  id: "",
  project_id: "",
  organization_id: "",

  // LIGHT MODE - Cores principais
  primary_color_light: "#1E293B",
  secondary_color_light: "#F0F4F8",
  background_color_light: "#FFFFFF",
  card_background_color_light: "#FFFFFF",
  card_foreground_color_light: "#0F172A",
  popover_foreground_color_light: "#0F172A",
  text_color_light: "#0F172A",
  text_secondary_color_light: "#64748B",
  accent_color_light: "#F0F4F8",
  secondary_foreground_color_light: "#0F172A",
  accent_foreground_color_light: "#0F172A",
  muted_color_light: "#F0F4F8",

  // DARK MODE - Cores principais
  primary_color_dark: "#F8FAFC",
  secondary_color_dark: "#334155",
  background_color_dark: "#0F172A",
  card_background_color_dark: "#1E293B",
  card_foreground_color_dark: "#F8FAFC",
  popover_foreground_color_dark: "#F8FAFC",
  text_color_dark: "#F8FAFC",
  text_secondary_color_dark: "#94A3B8",
  accent_color_dark: "#475569",
  secondary_foreground_color_dark: "#F8FAFC",
  accent_foreground_color_dark: "#F8FAFC",
  muted_color_dark: "#334155",

  // LIGHT MODE - 5 cores semânticas
  destructive_color_light: "#EF4444",
  success_color_light: "#10B981",
  warning_color_light: "#F59E0B",
  border_color_light: "#E2E8F0",
  price_color_light: "#10B981",
  info_color_light: "#0891B2",
  rating_color_light: "#FBBF24",
  time_color_light: "#64748B",

  // DARK MODE - 5 cores semânticas
  destructive_color_dark: "#DC2626",
  success_color_dark: "#34D399",
  warning_color_dark: "#FBBF24",
  border_color_dark: "#475569",
  price_color_dark: "#34D399",
  info_color_dark: "#22D3EE",
  rating_color_dark: "#FBBF24",
  time_color_dark: "#94A3B8",

  // LIGHT MODE - 2 cores sistema
  focus_ring_color_light: "#0F172A",
  input_background_color_light: "#E2E8F0",

  // DARK MODE - 2 cores sistema
  focus_ring_color_dark: "#CBD5E1",
  input_background_color_dark: "#334155",

  // Configurações numéricas
  disabled_opacity: 0.5,
  shadow_intensity: 1.0,

  // Metadados
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

/**
 * Detectar modo escuro baseado em preferências do sistema
 */
export const isDarkModePreferred = (): boolean => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

/**
 * Aplicar tema às CSS variables do DOM
 */
export const applyThemeToDom = (theme: ThemeCustomization, isDarkMode: boolean): void => {
  const variables = themeToCSSVariables(theme, isDarkMode);
  const root = document.documentElement;

  for (const [key, value] of Object.entries(variables)) {
    root.style.setProperty(key, value);
  }
};
