import api from './api';
import { UserProject } from '@/types/auth';

interface AddUserToProjectRequest {
  project_id: string;
  role: string;
}

interface UpdateUserProjectRequest {
  role?: string;
  active?: boolean;
}

export const userProjectService = {
  addUserToProject: async (userId: string, data: AddUserToProjectRequest) => {
    const response = await api.post<UserProject>(`/user/${userId}/project`, data);
    return response.data;
  },

  removeUserFromProject: async (userId: string, projectId: string) => {
    await api.delete(`/user/${userId}/project/${projectId}`);
  },

  updateUserProject: async (id: string, data: UpdateUserProjectRequest) => {
    const response = await api.put<UserProject>(`/user-project/${id}`, data);
    return response.data;
  },

  getUserProjects: async (userId: string) => {
    const response = await api.get<UserProject[]>(`/user/${userId}/projects`);
    return response.data;
  },

  getUserProjectsByOrganization: async (userId: string, orgId: string) => {
    const response = await api.get<UserProject[]>(`/user/${userId}/organization/${orgId}/projects`);
    return response.data;
  },

  getProjectUsers: async (projectId: string) => {
    const response = await api.get<UserProject[]>(`/project/${projectId}/users`);
    return response.data;
  },
};
