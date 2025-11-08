import api from "./api";
import { ThemeCustomization, DEFAULT_THEME_COLORS } from "@/types/theme";

/**
 * 🎨 Serviço para gerenciar customização de tema do projeto
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
   * Resetar para cores padrão
   */
  resetToDefaults: () =>
    api.post<ThemeCustomization>("/project/settings/theme/reset", {}),

  /**
   * Deletar customização de tema
   */
  deleteTheme: () => api.delete<{ message: string }>("/project/settings/theme"),
};

/**
 * Validar cor HEX
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
 * Validar todas as cores e configurações de tema
 */
export const validateThemeColors = (theme: Partial<ThemeCustomization>): string[] => {
  const errors: string[] = [];

  const colorFields = [
    // Cores principais (obrigatórias)
    { key: "primary_color", label: "Cor Primária" },
    { key: "secondary_color", label: "Cor Secundária" },
    { key: "background_color", label: "Fundo" },
    { key: "card_background_color", label: "Fundo do Card" },
    { key: "text_color", label: "Texto Principal" },
    { key: "text_secondary_color", label: "Texto Secundário" },
    { key: "accent_color", label: "Cor de Destaque" },
    // Cores semânticas (opcionais)
    { key: "destructive_color", label: "Cor de Erro" },
    { key: "success_color", label: "Cor de Sucesso" },
    { key: "warning_color", label: "Cor de Aviso" },
    { key: "border_color", label: "Cor de Bordas" },
    { key: "price_color", label: "Cor do Preço" },
    // Configurações do sistema (opcionais)
    { key: "focus_ring_color", label: "Cor de Focus Ring" },
    { key: "input_background_color", label: "Fundo de Inputs" },
  ];

  // Validar cores HEX
  for (const field of colorFields) {
    const value = theme[field.key as keyof ThemeCustomization] as string;
    if (value && !validateHexColor(value)) {
      errors.push(`${field.label} deve estar em formato HEX válido (#RRGGBB)`);
    }
  }

  // Validar opacidade desabilitada
  if (theme.disabled_opacity !== undefined && !validateOpacity(theme.disabled_opacity)) {
    errors.push('Opacidade deve estar entre 0.0 e 1.0');
  }

  // Validar intensidade de sombras
  if (theme.shadow_intensity !== undefined && !validateShadowIntensity(theme.shadow_intensity)) {
    errors.push('Intensidade de sombras deve estar entre 0.0 e 2.0');
  }

  return errors;
};

/**
 * Converter tema para CSS variables
 * Suporta tanto campos legados quanto variantes light/dark
 */
export const themeToCSSVariables = (theme: ThemeCustomization): Record<string, string> => {
  // Usar variantes light/dark se disponíveis, senão usar legado como fallback
  const variables: Record<string, string> = {};

  // Cores principais
  if (theme.primary_color_light) variables["--primary-light"] = theme.primary_color_light;
  if (theme.primary_color_dark) variables["--primary-dark"] = theme.primary_color_dark;
  if (!theme.primary_color_light && theme.primary_color) variables["--primary-light"] = theme.primary_color;
  if (!theme.primary_color_dark && theme.primary_color) variables["--primary-dark"] = theme.primary_color;

  if (theme.secondary_color_light) variables["--secondary-light"] = theme.secondary_color_light;
  if (theme.secondary_color_dark) variables["--secondary-dark"] = theme.secondary_color_dark;
  if (!theme.secondary_color_light && theme.secondary_color) variables["--secondary-light"] = theme.secondary_color;
  if (!theme.secondary_color_dark && theme.secondary_color) variables["--secondary-dark"] = theme.secondary_color;

  if (theme.background_color_light) variables["--background-light"] = theme.background_color_light;
  if (theme.background_color_dark) variables["--background-dark"] = theme.background_color_dark;
  if (!theme.background_color_light && theme.background_color) variables["--background-light"] = theme.background_color;
  if (!theme.background_color_dark && theme.background_color) variables["--background-dark"] = theme.background_color;

  if (theme.card_background_color_light) variables["--card-light"] = theme.card_background_color_light;
  if (theme.card_background_color_dark) variables["--card-dark"] = theme.card_background_color_dark;
  if (!theme.card_background_color_light && theme.card_background_color) variables["--card-light"] = theme.card_background_color;
  if (!theme.card_background_color_dark && theme.card_background_color) variables["--card-dark"] = theme.card_background_color;

  if (theme.text_color_light) variables["--text-light"] = theme.text_color_light;
  if (theme.text_color_dark) variables["--text-dark"] = theme.text_color_dark;
  if (!theme.text_color_light && theme.text_color) variables["--text-light"] = theme.text_color;
  if (!theme.text_color_dark && theme.text_color) variables["--text-dark"] = theme.text_color;

  if (theme.text_secondary_color_light) variables["--text-secondary-light"] = theme.text_secondary_color_light;
  if (theme.text_secondary_color_dark) variables["--text-secondary-dark"] = theme.text_secondary_color_dark;
  if (!theme.text_secondary_color_light && theme.text_secondary_color) variables["--text-secondary-light"] = theme.text_secondary_color;
  if (!theme.text_secondary_color_dark && theme.text_secondary_color) variables["--text-secondary-dark"] = theme.text_secondary_color;

  if (theme.accent_color_light) variables["--accent-light"] = theme.accent_color_light;
  if (theme.accent_color_dark) variables["--accent-dark"] = theme.accent_color_dark;
  if (!theme.accent_color_light && theme.accent_color) variables["--accent-light"] = theme.accent_color;
  if (!theme.accent_color_dark && theme.accent_color) variables["--accent-dark"] = theme.accent_color;

  // Cores semânticas
  if (theme.destructive_color_light) variables["--destructive-light"] = theme.destructive_color_light;
  if (theme.destructive_color_dark) variables["--destructive-dark"] = theme.destructive_color_dark;
  if (theme.success_color_light) variables["--success-light"] = theme.success_color_light;
  if (theme.success_color_dark) variables["--success-dark"] = theme.success_color_dark;
  if (theme.warning_color_light) variables["--warning-light"] = theme.warning_color_light;
  if (theme.warning_color_dark) variables["--warning-dark"] = theme.warning_color_dark;
  if (theme.border_color_light) variables["--border-light"] = theme.border_color_light;
  if (theme.border_color_dark) variables["--border-dark"] = theme.border_color_dark;
  if (theme.price_color_light) variables["--price-light"] = theme.price_color_light;
  if (theme.price_color_dark) variables["--price-dark"] = theme.price_color_dark;

  // Configurações do sistema
  if (theme.focus_ring_color_light) variables["--focus-ring-light"] = theme.focus_ring_color_light;
  if (theme.focus_ring_color_dark) variables["--focus-ring-dark"] = theme.focus_ring_color_dark;
  if (theme.input_background_color_light) variables["--input-bg-light"] = theme.input_background_color_light;
  if (theme.input_background_color_dark) variables["--input-bg-dark"] = theme.input_background_color_dark;

  // Configurações numéricas
  if (theme.disabled_opacity !== undefined) variables["--disabled-opacity"] = theme.disabled_opacity.toString();
  if (theme.shadow_intensity !== undefined) variables["--shadow-intensity"] = theme.shadow_intensity.toString();

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
 * Obter tema padrão com todos os campos
 */
export const getDefaultTheme = (): ThemeCustomization => ({
  id: "",
  project_id: "",
  organization_id: "",
  // Cores principais (legado)
  primary_color: DEFAULT_THEME_COLORS.primaryColor,
  secondary_color: DEFAULT_THEME_COLORS.secondaryColor,
  background_color: DEFAULT_THEME_COLORS.backgroundColor,
  card_background_color: DEFAULT_THEME_COLORS.cardBackgroundColor,
  text_color: DEFAULT_THEME_COLORS.textColor,
  text_secondary_color: DEFAULT_THEME_COLORS.textSecondaryColor,
  accent_color: DEFAULT_THEME_COLORS.accentColor,
  // Configurações numéricas
  disabled_opacity: 0.5,
  shadow_intensity: 1.0,
  // Metadados
  is_active: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});
