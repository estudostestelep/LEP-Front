/**
 * ✨ Tipos para configurações do sistema (Settings)
 *
 * Inclui tipos para exibição de produtos e outras configurações do projeto
 */

/**
 * Configurações de exibição de produtos
 *
 * Controla quais campos dos produtos são visíveis em:
 * - Página pública de cardápio
 * - Admin menu
 * - APIs de produtos
 */
export interface ProductDisplaySettings {
  id?: string;
  project_id?: string;

  // Exibição de campos
  show_prep_time: boolean;      // ⏱️ Tempo de preparo
  show_rating: boolean;         // ⭐ Avaliações/Estrelas
  show_description: boolean;    // 📝 Descrição do produto

  // Outros campos opcionais para expansão futura
  show_price?: boolean;
  show_availability?: boolean;
  show_allergens?: boolean;

  created_at?: string;
  updated_at?: string;
}

/**
 * DTO para criar/atualizar configurações de exibição
 */
export interface CreateDisplaySettingsDTO {
  show_prep_time: boolean;
  show_rating: boolean;
  show_description: boolean;
  show_price?: boolean;
  show_availability?: boolean;
  show_allergens?: boolean;
}

export type UpdateDisplaySettingsDTO = Partial<CreateDisplaySettingsDTO>;

/**
 * Resposta da API para configurações
 */
export interface DisplaySettingsResponse {
  data: ProductDisplaySettings;
  message?: string;
}

/**
 * Valores padrão para configurações de exibição
 */
export const DEFAULT_DISPLAY_SETTINGS: ProductDisplaySettings = {
  show_prep_time: true,
  show_rating: true,
  show_description: true,
};
