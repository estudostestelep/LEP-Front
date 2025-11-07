import api from "./api";
import { Menu, CreateMenuDTO, UpdateMenuDTO } from "@/types/menu";

// Exportar Menu para compatibilidade com outros arquivos que fazem import de menuService
export type { Menu, CreateMenuDTO, UpdateMenuDTO };

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

  // ✨ Novos métodos para seleção inteligente
  // Obter o cardápio ativo agora (com lógica automática)
  getActiveMenu: () => api.get<Menu>("/menu/active-now"),

  // Obter opções de cardápio
  getMenuOptions: () => api.get<Menu[]>("/menu/options"),

  // Definir como override manual
  setMenuAsManualOverride: (id: string) =>
    api.put(`/menu/${id}/manual-override`, {}),

  // Remover override manual (voltar a automático)
  removeManualOverride: () =>
    api.delete("/menu/manual-override"),
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

  // ✨ Validações para novos campos
  if (menu.priority !== undefined && menu.priority < 0) {
    errors.push("Prioridade deve ser maior ou igual a 0");
  }

  return errors;
};
