import api from "./api";
import {
  ProductDisplaySettings,
  CreateDisplaySettingsDTO,
  UpdateDisplaySettingsDTO,
} from "@/types/settings";

/**
 * ✨ Serviço para gerenciar configurações de exibição de produtos
 *
 * Endpoints:
 * - GET /project/settings/display
 * - PUT /project/settings/display
 * - POST /project/settings/display
 */
export const displaySettingsService = {
  /**
   * Obter configurações de exibição do projeto
   */
  getSettings: () =>
    api.get<ProductDisplaySettings>("/project/settings/display"),

  /**
   * Atualizar configurações de exibição
   */
  updateSettings: (settings: UpdateDisplaySettingsDTO) =>
    api.put<ProductDisplaySettings>("/project/settings/display", settings),

  /**
   * Criar configurações de exibição (primeira vez)
   */
  createSettings: (settings: CreateDisplaySettingsDTO) =>
    api.post<ProductDisplaySettings>("/project/settings/display", settings),

  /**
   * Resetar para valores padrão
   */
  resetToDefaults: () =>
    api.post<ProductDisplaySettings>("/project/settings/display/reset", {}),
};

/**
 * Validar configurações de exibição
 */
export const validateDisplaySettings = (
  settings: Partial<CreateDisplaySettingsDTO>
): string[] => {
  const errors: string[] = [];

  if (
    settings.show_prep_time === undefined &&
    settings.show_rating === undefined &&
    settings.show_description === undefined
  ) {
    errors.push(
      "Pelo menos um campo de exibição deve ser selecionado"
    );
  }

  return errors;
};
