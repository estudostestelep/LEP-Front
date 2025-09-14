import api from "./api";

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  available?: boolean;
}

export const productService = {
  getAll: () => api.get<Product[]>("/products"),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  create: (data: Product) => api.post<Product>("/products", data),
  update: (id: string, data: Product) => api.put<Product>(`/products/${id}`, data),
  remove: (id: string) => api.delete(`/products/${id}`),
};
