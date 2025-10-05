import api from "./api";

export interface Menu {
  id: string;
  organization_id: string;
  project_id: string;
  name: string;
  styling?: {
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
    };
    fonts?: {
      title?: string;
      body?: string;
    };
    layout?: "grid" | "list" | "cards";
  };
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateMenuDTO {
  name: string;
  styling?: Menu["styling"];
  order?: number;
  active?: boolean;
}

export interface UpdateMenuDTO {
  id: string;
  name?: string;
  styling?: Menu["styling"];
  order?: number;
  active?: boolean;
}

export const menuService = {
  // Listar todos
  getAll: () => api.get<Menu[]>("/menu"),

  // Listar ativos
  getActive: () => api.get<Menu[]>("/menu/active"),

  // Obter por ID
  getById: (id: string) => api.get<Menu>(`/menu/${id}`),

  // Criar
  create: (menu: CreateMenuDTO) => api.post<Menu>("/menu", menu),

  // Atualizar
  update: (id: string, menu: Partial<UpdateMenuDTO>) =>
    api.put<Menu>(`/menu/${id}`, menu),

  // Atualizar ordem
  updateOrder: (id: string, order: number) =>
    api.put(`/menu/${id}/order`, { order }),

  // Atualizar status (play/pause)
  updateStatus: (id: string, active: boolean) =>
    api.put(`/menu/${id}/status`, { active }),

  // Deletar
  remove: (id: string) => api.delete(`/menu/${id}`),
};

// Validação de Menu
export const validateMenu = (menu: Partial<CreateMenuDTO>): string[] => {
  const errors: string[] = [];

  if (!menu.name || menu.name.trim().length === 0) {
    errors.push("Nome do menu é obrigatório");
  }

  if (menu.name && menu.name.length > 100) {
    errors.push("Nome do menu deve ter no máximo 100 caracteres");
  }

  if (menu.order !== undefined && menu.order < 0) {
    errors.push("Ordem deve ser maior ou igual a 0");
  }

  return errors;
};
