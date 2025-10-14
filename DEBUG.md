# Debug - OrganizationProjectSelector não aparece

## Problema
O componente OrganizationProjectSelector não está visível após o login.

## Causas Possíveis

### 1. Backend não retorna organizations/projects no login
O endpoint `/login` deve retornar:
```json
{
  "user": { ... },
  "token": "...",
  "organizations": [ ... ],  // ← DEVE EXISTIR
  "projects": [ ... ]        // ← DEVE EXISTIR
}
```

**Verificar**: Abra o DevTools → Network → procure requisição `/login` → veja a resposta

### 2. Arrays vazios
Mesmo que o backend retorne, os arrays podem estar vazios:
```json
{
  "organizations": [],  // ← VAZIO!
  "projects": []        // ← VAZIO!
}
```

## Como Debugar

### Passo 1: Verificar localStorage
No console do navegador (F12):
```javascript
// Verificar se tem organizações
JSON.parse(localStorage.getItem('@LEP:organizations'))

// Verificar se tem projetos
JSON.parse(localStorage.getItem('@LEP:projects'))

// Verificar usuário
JSON.parse(localStorage.getItem('@LEP:user'))
```

### Passo 2: Verificar resposta do login
1. Abra DevTools (F12)
2. Aba Network
3. Faça login
4. Procure a requisição `POST /login`
5. Veja a resposta (Response tab)

**Esperado**:
```json
{
  "user": { ... },
  "token": "eyJ...",
  "organizations": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "organization_id": "org-uuid",
      "role": "owner",
      "active": true
    }
  ],
  "projects": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "project_id": "proj-uuid",
      "role": "admin",
      "active": true
    }
  ]
}
```

### Passo 3: Verificar console do frontend
Procure por logs:
```
Login response from backend: { ... }
```

## Soluções Temporárias

### Solução 1: Mostrar sempre (para debug)
Edite `OrganizationProjectSelector.tsx` linha 39:
```typescript
// ANTES
if (organizations.length === 0) {
  return null;
}

// DEPOIS (temporário para debug)
if (organizations.length === 0) {
  return (
    <div className="px-3 py-1 bg-red-100 border border-red-300 rounded text-xs text-red-700">
      ⚠️ Nenhuma organização carregada
    </div>
  );
}
```

### Solução 2: Adicionar logs de debug
Adicione no início do componente:
```typescript
export const OrganizationProjectSelector = () => {
  const { organizations, projects, ... } = useAuth();

  // DEBUG
  console.log('OrganizationProjectSelector - Debug:', {
    orgsCount: organizations.length,
    projsCount: projects.length,
    organizations,
    projects
  });

  // ... resto do código
}
```

## Solução Definitiva

### Se o backend não retorna organizations/projects:

O backend precisa ser atualizado para retornar esses dados no login. Verifique o handler de login no backend.

### Se o usuário não tem organizations/projects:

Execute no backend (ou via script):
```sql
-- Criar relacionamento user-organization
INSERT INTO user_organizations (user_id, organization_id, role, active)
VALUES ('user-uuid', 'org-uuid', 'owner', true);

-- Criar relacionamento user-project
INSERT INTO user_projects (user_id, project_id, role, active)
VALUES ('user-uuid', 'project-uuid', 'admin', true);
```

Ou use os endpoints:
```bash
# Adicionar user a uma org
POST /user/{userId}/organization
{
  "organization_id": "org-uuid",
  "role": "owner"
}

# Adicionar user a um projeto
POST /user/{userId}/project
{
  "project_id": "project-uuid",
  "role": "admin"
}
```

## Verificação Rápida

Execute este código no console do navegador após login:
```javascript
const orgs = JSON.parse(localStorage.getItem('@LEP:organizations') || '[]');
const projs = JSON.parse(localStorage.getItem('@LEP:projects') || '[]');

console.log({
  hasOrgs: orgs.length > 0,
  hasProjects: projs.length > 0,
  organizations: orgs,
  projects: projs
});

if (orgs.length === 0) {
  console.error('❌ PROBLEMA: Nenhuma organização encontrada!');
  console.log('O backend deve retornar organizations no login');
}

if (projs.length === 0) {
  console.error('❌ PROBLEMA: Nenhum projeto encontrado!');
  console.log('O backend deve retornar projects no login');
}
```
