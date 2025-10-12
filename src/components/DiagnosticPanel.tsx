import { useAuth } from '@/context/authContext';
import { useCurrentTenant } from '@/hooks/useCurrentTenant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const DiagnosticPanel = () => {
  const {
    user,
    organizations,
    projects,
    currentOrganization,
    currentProject,
    organizationDetails,
    projectDetails
  } = useAuth();

  const { organization_id, project_id } = useCurrentTenant();

  // Check localStorage
  const storedToken = localStorage.getItem('@LEP:token');
  const storedOrg = localStorage.getItem('@LEP:currentOrganization');
  const storedProj = localStorage.getItem('@LEP:currentProject');

  return (
    <Card className="mb-6 border-blue-500">
      <CardHeader>
        <CardTitle className="text-sm">🔍 Diagnóstico do Sistema</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        {/* User Info */}
        <div>
          <strong>👤 Usuário:</strong>
          {user ? (
            <div className="ml-2 mt-1">
              <div>ID: <code className="bg-gray-100 dark:bg-gray-800 px-1">{user.id}</code></div>
              <div>Nome: {user.name}</div>
              <div>Email: {user.email}</div>
              <div>Permissões: {user.permissions?.join(', ') || 'nenhuma'}</div>
            </div>
          ) : (
            <Badge variant="destructive" className="ml-2">Não autenticado</Badge>
          )}
        </div>

        {/* Organizations */}
        <div>
          <strong>🏢 Organizações:</strong>
          {organizations.length > 0 ? (
            <div className="ml-2 mt-1">
              <div>Total: {organizations.length}</div>
              {organizations.map((uo) => (
                <div key={uo.id} className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div>Org ID: <code className="bg-white dark:bg-gray-700 px-1">{uo.organization_id}</code></div>
                  <div>Role: <Badge variant="outline">{uo.role}</Badge></div>
                  <div>Active: {uo.active ? '✅' : '❌'}</div>
                </div>
              ))}
            </div>
          ) : (
            <Badge variant="destructive" className="ml-2">Nenhuma organização</Badge>
          )}
        </div>

        {/* Projects */}
        <div>
          <strong>📁 Projetos:</strong>
          {projects.length > 0 ? (
            <div className="ml-2 mt-1">
              <div>Total: {projects.length}</div>
              {projects.map((up) => (
                <div key={up.id} className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div>Proj ID: <code className="bg-white dark:bg-gray-700 px-1">{up.project_id}</code></div>
                  <div>Role: <Badge variant="outline">{up.role}</Badge></div>
                  <div>Active: {up.active ? '✅' : '❌'}</div>
                </div>
              ))}
            </div>
          ) : (
            <Badge variant="destructive" className="ml-2">Nenhum projeto</Badge>
          )}
        </div>

        {/* Current Context */}
        <div className="border-t pt-2">
          <strong>🎯 Contexto Atual:</strong>
          <div className="ml-2 mt-1 space-y-1">
            <div>
              Org Atual: {currentOrganization ? (
                <code className="bg-green-100 dark:bg-green-900 px-1">{currentOrganization}</code>
              ) : (
                <Badge variant="destructive">Nenhuma</Badge>
              )}
            </div>
            <div>
              Org Nome: {organizationDetails?.name || 'Não carregado'}
            </div>
            <div>
              Proj Atual: {currentProject ? (
                <code className="bg-green-100 dark:bg-green-900 px-1">{currentProject}</code>
              ) : (
                <Badge variant="destructive">Nenhum</Badge>
              )}
            </div>
            <div>
              Proj Nome: {projectDetails?.name || 'Não carregado'}
            </div>
          </div>
        </div>

        {/* Hook Values */}
        <div className="border-t pt-2">
          <strong>🪝 Hook useCurrentTenant:</strong>
          <div className="ml-2 mt-1">
            <div>organization_id: {organization_id ? (
              <code className="bg-blue-100 dark:bg-blue-900 px-1">{organization_id}</code>
            ) : (
              <Badge variant="destructive">Vazio</Badge>
            )}</div>
            <div>project_id: {project_id ? (
              <code className="bg-blue-100 dark:bg-blue-900 px-1">{project_id}</code>
            ) : (
              <Badge variant="destructive">Vazio</Badge>
            )}</div>
          </div>
        </div>

        {/* localStorage */}
        <div className="border-t pt-2">
          <strong>💾 localStorage:</strong>
          <div className="ml-2 mt-1 space-y-1">
            <div>Token: {storedToken ? '✅ Presente' : '❌ Ausente'}</div>
            <div>Org: {storedOrg ? (
              <code className="bg-yellow-100 dark:bg-yellow-900 px-1">{storedOrg}</code>
            ) : '❌'}</div>
            <div>Proj: {storedProj ? (
              <code className="bg-yellow-100 dark:bg-yellow-900 px-1">{storedProj}</code>
            ) : '❌'}</div>
          </div>
        </div>

        {/* API Headers that will be sent */}
        <div className="border-t pt-2">
          <strong>📡 Headers que serão enviados:</strong>
          <div className="ml-2 mt-1 bg-blue-50 dark:bg-blue-950 p-2 rounded">
            <div>Authorization: Bearer {storedToken ? '***' : '❌'}</div>
            <div>X-Lpe-Organization-Id: {storedOrg || '❌'}</div>
            <div>X-Lpe-Project-Id: {storedProj || '❌'}</div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="border-t pt-2">
          <strong>✅ Status:</strong>
          <div className="ml-2 mt-1 space-y-1">
            {!user && <Badge variant="destructive">❌ Usuário não autenticado</Badge>}
            {user && organizations.length === 0 && (
              <Badge variant="destructive">❌ Usuário sem organizações</Badge>
            )}
            {user && organizations.length > 0 && !currentOrganization && (
              <Badge variant="destructive">❌ Nenhuma organização selecionada</Badge>
            )}
            {user && projects.length === 0 && (
              <Badge variant="destructive">❌ Usuário sem projetos</Badge>
            )}
            {user && projects.length > 0 && !currentProject && (
              <Badge variant="destructive">❌ Nenhum projeto selecionado</Badge>
            )}
            {user && currentOrganization && currentProject && (
              <Badge variant="default" className="bg-green-600">✅ Sistema OK</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
