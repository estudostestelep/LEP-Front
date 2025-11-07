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
 * Validar todas as cores de tema
 */
export const validateThemeColors = (theme: Partial<ThemeCustomization>): string[] => {
  const errors: string[] = [];

  const colorFields = [
    { key: "primary_color", label: "Cor Primária" },
    { key: "secondary_color", label: "Cor Secundária" },
    { key: "background_color", label: "Fundo" },
    { key: "card_background_color", label: "Fundo do Card" },
    { key: "text_color", label: "Texto Principal" },
    { key: "text_secondary_color", label: "Texto Secundário" },
    { key: "accent_color", label: "Cor de Destaque" },
  ];

  for (const field of colorFields) {
    const value = theme[field.key as keyof ThemeCustomization] as string;
    if (value && !validateHexColor(value)) {
      errors.push(`${field.label} deve estar em formato HEX válido (#RRGGBB)`);
    }
  }

  return errors;
};

/**
 * Converter tema para CSS variables
 */
export const themeToCSSVariables = (theme: ThemeCustomization): Record<string, string> => {
  return {
    "--color-primary": theme.primary_color,
    "--color-secondary": theme.secondary_color,
    "--color-background": theme.background_color,
    "--color-card-background": theme.card_background_color,
    "--color-text": theme.text_color,
    "--color-text-secondary": theme.text_secondary_color,
    "--color-accent": theme.accent_color,
  };
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
 * Obter tema padrão
 */
export const getDefaultTheme = (): ThemeCustomization => ({
  id: "",
  project_id: "",
  organization_id: "",
  primary_color: DEFAULT_THEME_COLORS.primaryColor,
  secondary_color: DEFAULT_THEME_COLORS.secondaryColor,
  background_color: DEFAULT_THEME_COLORS.backgroundColor,
  card_background_color: DEFAULT_THEME_COLORS.cardBackgroundColor,
  text_color: DEFAULT_THEME_COLORS.textColor,
  text_secondary_color: DEFAULT_THEME_COLORS.textSecondaryColor,
  accent_color: DEFAULT_THEME_COLORS.accentColor,
  is_active: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});
