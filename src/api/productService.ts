import api from "./api";

export interface Product {
  id?: string;
  organization_id?: string;
  project_id?: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  prep_time_minutes?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductRequest {
  organization_id: string;
  project_id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  prep_time_minutes?: number;
}

export const productService = {
  getAll: () => api.get<Product[]>("/product"),
  getById: (id: string) => api.get<Product>(`/product/${id}`),
  create: (data: CreateProductRequest) => api.post<Product>("/product", data),
  update: (id: string, data: Partial<Product>) => api.put<Product>(`/product/${id}`, data),
  remove: (id: string) => api.delete(`/product/${id}`),
};
