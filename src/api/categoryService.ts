import api from "./api";

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
  deleted_at?: string;
}

export interface CreateCategoryDTO {
  menu_id: string;
  name: string;
  image_url?: string;
  notes?: string;
  order?: number;
  active?: boolean;
}

export interface UpdateCategoryDTO {
  id: string;
  menu_id?: string;
  name?: string;
  image_url?: string;
  notes?: string;
  order?: number;
  active?: boolean;
}

export const categoryService = {
  // Listar todos
  getAll: () => api.get<Category[]>("/category"),

  // Listar ativos
  getActive: () => api.get<Category[]>("/category/active"),

  // Obter por ID
  getById: (id: string) => api.get<Category>(`/category/${id}`),

  // Obter por menu
  getByMenu: (menuId: string) =>
    api.get<Category[]>(`/category/menu/${menuId}`),

  // Criar
  create: (category: CreateCategoryDTO) =>
    api.post<Category>("/category", category),

  // Atualizar
  update: (id: string, category: Partial<UpdateCategoryDTO>) =>
    api.put<Category>(`/category/${id}`, category),

  // Atualizar ordem
  updateOrder: (id: string, order: number) =>
    api.put(`/category/${id}/order`, { order }),

  // Atualizar status
  updateStatus: (id: string, active: boolean) =>
    api.put(`/category/${id}/status`, { active }),

  // Deletar
  remove: (id: string) => api.delete(`/category/${id}`),
};

// Validação de Category
export const validateCategory = (
  category: Partial<CreateCategoryDTO>
): string[] => {
  const errors: string[] = [];

  if (!category.menu_id || category.menu_id.trim().length === 0) {
    errors.push("Menu é obrigatório");
  }

  if (!category.name || category.name.trim().length === 0) {
    errors.push("Nome da categoria é obrigatório");
  }

  if (category.name && category.name.length > 100) {
    errors.push("Nome da categoria deve ter no máximo 100 caracteres");
  }

  if (category.order !== undefined && category.order < 0) {
    errors.push("Ordem deve ser maior ou igual a 0");
  }

  return errors;
};
