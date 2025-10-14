export interface User {
  id: string;
  name: string;
  email: string;
  role?: string; // Função do usuário (opcional)
  permissions: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserOrganization {
  id: string;
  user_id: string;
  organization_id: string;
  organization_name?: string; // Nome da organização (retornado pelo backend)
  role: string; // "owner", "admin", "member"
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProject {
  id: string;
  user_id: string;
  project_id: string;
  project_name?: string; // Nome do projeto (retornado pelo backend)
  organization_id: string; // ✅ OBRIGATÓRIO: ID da organização pai (para filtrar projetos)
  role: string; // "admin", "manager", "waiter", "member"
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  organizations: UserOrganization[];
  projects: UserProject[];
}
