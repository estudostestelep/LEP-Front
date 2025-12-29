/**
 * ✨ Tipos para o sistema de cardápios
 *
 * Inclui tipos para Menu, Category, Subcategory e relacionamentos
 * com novos campos para seleção inteligente de cardápios
 */

export interface Menu {
  id: string;
  organization_id: string;
  project_id: string;
  name: string;
  styling?: string;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;

  // ✨ Novos campos para seleção automática
  time_range_start?: Date | string | null;
  time_range_end?: Date | string | null;
  priority?: number;
  is_manual_override?: boolean;
  applicable_days?: number[] | null; // [0,1,2,3,4] = dias da semana
  applicable_dates?: string[] | null; // ["2025-12-25", ...]
}

export interface Category {
  id: string;
  organization_id: string;
  project_id: string;
  menu_id: string;
  name: string;
  image_url?: string;
  notes?: string;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Subcategory {
  id: string;
  organization_id: string;
  project_id: string;
  name: string;
  photo?: string;
  notes?: string;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface SubcategoryCategory {
  id: string;
  subcategory_id: string;
  category_id: string;
  created_at: string;
}

// Types para requests/responses
export interface CreateMenuDTO {
  name: string;
  styling?: string;
  order?: number;
  active?: boolean;
  time_range_start?: string;
  time_range_end?: string;
  priority?: number;
  applicable_days?: number[];
  applicable_dates?: string[];
}

export interface UpdateMenuDTO extends Partial<CreateMenuDTO> {
  id?: string;
}

export interface MenuFilters {
  active?: boolean;
  organization_id?: string;
  project_id?: string;
}

// ✨ Type para MenuInfo (com status e informações adicionais)
export interface MenuInfo {
  menu: Menu;
  status: "active" | "scheduled" | "inactive";
  status_reason: string;
  is_manual_override: boolean;
  next_active_time?: Date;
  days_applicable?: number[];
  dates_applicable?: string[];
}
