import api from './api';
import { UserOrganization } from '@/types/auth';

interface AddUserToOrganizationRequest {
  organization_id: string;
  role: string;
}

interface UpdateUserOrganizationRequest {
  role?: string;
  active?: boolean;
}

export const userOrganizationService = {
  addUserToOrganization: async (userId: string, data: AddUserToOrganizationRequest) => {
    const response = await api.post<UserOrganization>(`/user/${userId}/organization`, data);
    return response.data;
  },

  removeUserFromOrganization: async (userId: string, orgId: string) => {
    await api.delete(`/user/${userId}/organization/${orgId}`);
  },

  updateUserOrganization: async (id: string, data: UpdateUserOrganizationRequest) => {
    const response = await api.put<UserOrganization>(`/user-organization/${id}`, data);
    return response.data;
  },

  getUserOrganizations: async (userId: string) => {
    const response = await api.get<UserOrganization[]>(`/user/${userId}/organizations`);
    return response.data;
  },

  getOrganizationUsers: async (orgId: string) => {
    const response = await api.get<UserOrganization[]>(`/organization/${orgId}/users`);
    return response.data;
  },
};
