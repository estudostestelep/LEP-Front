import api from "./api";

export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  active?: boolean;
}

export const userService = {
  getAll: () => api.get<User[]>("/users"),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (data: User) => api.post<User>("/users", data),
  update: (id: string, data: User) => api.put<User>(`/users/${id}`, data),
  remove: (id: string) => api.delete(`/users/${id}`),
};
