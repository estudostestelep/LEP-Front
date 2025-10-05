import { useAuth } from '@/context/authContext';

/**
 * Hook customizado para obter organização e projeto atuais
 * Substitui o uso direto de user.organization_id e user.project_id
 */
export const useCurrentTenant = () => {
  const { currentOrganization, currentProject } = useAuth();

  return {
    organization_id: currentOrganization || '',
    project_id: currentProject || ''
  };
};
