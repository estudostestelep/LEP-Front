import api from "./api";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  prep_time_minutes: number;
  category: string;
  image_url?: string;
  stock?: number;
  notes?: string;
  organization_id?: string;
  project_id?: string;
  created_at?: string;
  updated_at?: string;
}

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
  getAll: () => api.get<Product[]>("/product"),
  getById: (id: string) => api.get<Product>(`/product/${id}`),
  create: (data: CreateProductRequest) => api.post<Product>("/product", data),
  update: (id: string, data: Partial<Product>) => api.put<Product>(`/product/${id}`, data),
  remove: (id: string) => api.delete(`/product/${id}`),

  // Upload de imagem
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<{
      success: boolean;
      image_url: string;
      filename: string;
      size: number;
      organization_id: string;
      project_id: string;
    }>("/upload/product/image", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Atualizar apenas a imagem de um produto
  updateImage: (id: string, imageUrl: string) =>
    api.put(`/product/${id}/image`, { image_url: imageUrl }),
};
