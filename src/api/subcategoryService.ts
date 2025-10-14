import api from "./api";
import { Category } from "./categoryService";

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
  deleted_at?: string;
}

export interface CreateSubcategoryDTO {
  name: string;
  photo?: string;
  notes?: string;
  order?: number;
  active?: boolean;
}

export interface UpdateSubcategoryDTO {
  id: string;
  name?: string;
  photo?: string;
  notes?: string;
  order?: number;
  active?: boolean;
}

export const subcategoryService = {
  // Listar todos
  getAll: () => api.get<Subcategory[]>("/subcategory"),

  // Listar ativos
  getActive: () => api.get<Subcategory[]>("/subcategory/active"),

  // Obter por ID
  getById: (id: string) => api.get<Subcategory>(`/subcategory/${id}`),

  // Obter por categoria
  getByCategory: (categoryId: string) =>
    api.get<Subcategory[]>(`/subcategory/category/${categoryId}`),

  // Criar
  create: (subcategory: CreateSubcategoryDTO) =>
    api.post<Subcategory>("/subcategory", subcategory),

  // Atualizar
  update: (id: string, subcategory: Partial<UpdateSubcategoryDTO>) =>
    api.put<Subcategory>(`/subcategory/${id}`, subcategory),

  // Atualizar ordem
  updateOrder: (id: string, order: number) =>
    api.put(`/subcategory/${id}/order`, { order }),

  // Atualizar status
  updateStatus: (id: string, active: boolean) =>
    api.put(`/subcategory/${id}/status`, { active }),

  // Deletar
  remove: (id: string) => api.delete(`/subcategory/${id}`),

  // Adicionar categoria à subcategoria (N:N)
  addCategory: (subcategoryId: string, categoryId: string) =>
    api.post(`/subcategory/${subcategoryId}/category/${categoryId}`),

  // Remover categoria da subcategoria (N:N)
  removeCategory: (subcategoryId: string, categoryId: string) =>
    api.delete(`/subcategory/${subcategoryId}/category/${categoryId}`),

  // Obter categorias da subcategoria
  getCategories: (subcategoryId: string) =>
    api.get<Category[]>(`/subcategory/${subcategoryId}/categories`),
};

// Validação de Subcategory
export const validateSubcategory = (
  subcategory: Partial<CreateSubcategoryDTO>
): string[] => {
  const errors: string[] = [];

  if (!subcategory.name || subcategory.name.trim().length === 0) {
    errors.push("Nome da subcategoria é obrigatório");
  }

  if (subcategory.name && subcategory.name.length > 100) {
    errors.push("Nome da subcategoria deve ter no máximo 100 caracteres");
  }

  if (subcategory.order !== undefined && subcategory.order < 0) {
    errors.push("Ordem deve ser maior ou igual a 0");
  }

  return errors;
};
