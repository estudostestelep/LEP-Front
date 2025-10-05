import api from "./api";
import { Tag } from "./tagService";

export type ProductType = "prato" | "bebida" | "vinho";

export interface Product {
  // Campos base
  id: string;
  organization_id: string;
  project_id: string;
  name: string;
  description?: string;
  image_url?: string;

  // Tipo e organização
  type: ProductType;
  order: number;
  active: boolean;
  pdv_code?: string;

  // Relacionamentos com estrutura de cardápio
  category_id?: string;
  subcategory_id?: string;

  // Campos de preço
  price_normal: number;
  price_promo?: number;

  // Campos para Bebida/Vinho
  volume?: number;
  alcohol_content?: number;

  // Campos específicos para Vinho
  vintage?: string;
  country?: string;
  region?: string;
  winery?: string;
  wine_type?: string;
  grapes?: string[];
  price_bottle?: number;
  price_half_bottle?: number;
  price_glass?: number;

  // Outros campos
  stock?: number;
  prep_time_minutes?: number;

  // Campos deprecados (manter para compatibilidade)
  category?: string;
  available?: boolean;
  price?: number;

  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  image_url?: string;
  type: ProductType;
  order?: number;
  active?: boolean;
  pdv_code?: string;
  category_id?: string;
  subcategory_id?: string;
  price_normal: number;
  price_promo?: number;
  volume?: number;
  alcohol_content?: number;
  vintage?: string;
  country?: string;
  region?: string;
  winery?: string;
  wine_type?: string;
  grapes?: string[];
  price_bottle?: number;
  price_half_bottle?: number;
  price_glass?: number;
  stock?: number;
  prep_time_minutes?: number;
}

export interface UpdateProductDTO {
  id: string;
  name?: string;
  description?: string;
  image_url?: string;
  type?: ProductType;
  order?: number;
  active?: boolean;
  pdv_code?: string;
  category_id?: string;
  subcategory_id?: string;
  price_normal?: number;
  price_promo?: number;
  volume?: number;
  alcohol_content?: number;
  vintage?: string;
  country?: string;
  region?: string;
  winery?: string;
  wine_type?: string;
  grapes?: string[];
  price_bottle?: number;
  price_half_bottle?: number;
  price_glass?: number;
  stock?: number;
  prep_time_minutes?: number;
}

// Compatibilidade com código antigo
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  available: boolean;
  prep_time_minutes: number;
  category: string;
  image_url?: string;
  stock?: number;
  notes?: string;
}

export const productService = {
  // CRUD básico
  getAll: () => api.get<Product[]>("/product"),
  getById: (id: string) => api.get<Product>(`/product/${id}`),
  create: (data: CreateProductDTO | CreateProductRequest) =>
    api.post<Product>("/product", data),
  update: (id: string, data: Partial<Product> | Partial<UpdateProductDTO>) =>
    api.put<Product>(`/product/${id}`, data),
  remove: (id: string) => api.delete(`/product/${id}`),

  // Upload de imagem
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post<{
      success: boolean;
      image_url: string;
      filename: string;
      size: number;
      organization_id: string;
      project_id: string;
    }>("/upload/product/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Atualizar apenas a imagem de um produto
  updateImage: (id: string, imageUrl: string) =>
    api.put(`/product/${id}/image`, { image_url: imageUrl }),

  // NOVOS MÉTODOS para cardápio

  // Atualizar ordem
  updateOrder: (id: string, order: number) =>
    api.put(`/product/${id}/order`, { order }),

  // Atualizar status (play/pause)
  updateStatus: (id: string, active: boolean) =>
    api.put(`/product/${id}/status`, { active }),

  // Filtros por tipo
  getByType: (type: ProductType) =>
    api.get<Product[]>(`/product/type/${type}`),

  // Filtros por categoria
  getByCategory: (categoryId: string) =>
    api.get<Product[]>(`/product/category/${categoryId}`),

  // Filtros por subcategoria
  getBySubcategory: (subcategoryId: string) =>
    api.get<Product[]>(`/product/subcategory/${subcategoryId}`),

  // Gerenciamento de Tags
  getProductTags: (productId: string) =>
    api.get<Tag[]>(`/product/${productId}/tags`),
  addTagToProduct: (productId: string, tagId: string) =>
    api.post(`/product/${productId}/tags`, { tag_id: tagId }),
  removeTagFromProduct: (productId: string, tagId: string) =>
    api.delete(`/product/${productId}/tags/${tagId}`),
  getProductsByTag: (tagId: string) =>
    api.get<Product[]>(`/product/by-tag?tag_id=${tagId}`),
};

// Validação de Product
export const validateProduct = (product: Partial<CreateProductDTO>): string[] => {
  const errors: string[] = [];

  if (!product.name || product.name.trim().length === 0) {
    errors.push("Nome do produto é obrigatório");
  }

  if (!product.type || !["prato", "bebida", "vinho"].includes(product.type)) {
    errors.push("Tipo de produto inválido");
  }

  if (!product.price_normal || product.price_normal <= 0) {
    errors.push("Preço normal é obrigatório e deve ser maior que 0");
  }

  // Validações específicas para vinho
  if (product.type === "vinho") {
    if (!product.vintage) {
      errors.push("Safra é obrigatória para vinhos");
    }
    if (!product.country) {
      errors.push("País é obrigatório para vinhos");
    }
    if (!product.grapes || product.grapes.length === 0) {
      errors.push("Uvas são obrigatórias para vinhos");
    }
  }

  return errors;
};
