import api from "./api";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  prep_time_minutes?: number;
  category: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  available: boolean;
  prep_time_minutes?: number;
  category: string;
  image_url?: string;
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
    return api.post<{ url: string }>("/product/upload-image", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
