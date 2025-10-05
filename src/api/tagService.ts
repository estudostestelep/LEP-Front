import api from "./api";

export interface Tag {
  id: string;
  organization_id: string;
  project_id: string;
  name: string;
  color?: string; // Código hexadecimal (ex: "#FF5733")
  description?: string;
  entity_type?: string; // "product" | "customer" | "table" | "reservation" | "order"
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export const tagService = {
  // Buscar tag por ID
  getTag: (id: string) => api.get<Tag>(`/tag/${id}`),

  // Listar todas as tags
  listTags: () => api.get<Tag[]>("/tag"),

  // Listar apenas tags ativas
  listActiveTags: () => api.get<Tag[]>("/tag/active"),

  // Buscar tags por tipo de entidade
  getTagsByEntityType: (entityType: string) =>
    api.get<Tag[]>(`/tag/entity/${entityType}`),

  // Criar tag
  createTag: (tag: Partial<Tag>) => api.post<Tag>("/tag", tag),

  // Atualizar tag
  updateTag: (id: string, tag: Partial<Tag>) =>
    api.put<Tag>(`/tag/${id}`, tag),

  // Deletar tag
  deleteTag: (id: string) => api.delete(`/tag/${id}`),
};

// Validações Frontend
export const validateTag = (tag: Partial<Tag>): string[] => {
  const errors: string[] = [];

  if (!tag.name || tag.name.trim().length === 0) {
    errors.push("Nome é obrigatório");
  }

  if (tag.color && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(tag.color)) {
    errors.push("Cor deve ser hexadecimal válida (ex: #FF5733)");
  }

  if (
    tag.entity_type &&
    !["product", "customer", "table", "reservation", "order"].includes(
      tag.entity_type
    )
  ) {
    errors.push("Tipo de entidade inválido");
  }

  return errors;
};
