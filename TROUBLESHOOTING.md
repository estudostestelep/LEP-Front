# Guia de Resolução de Problemas - OrganizationProjectSelector

## ⚠️ Problema: Componente não aparece ou mostra aviso amarelo

Se você vê:
```
⚠️ Nenhuma organização vinculada
```

Ou o componente simplesmente não aparece, siga este guia.

---

## 🔍 Diagnóstico Rápido

### Passo 1: Abra o Console do Navegador

1. Pressione `F12`
2. Vá para aba `Console`
3. Faça login novamente
4. Procure por: `OrganizationProjectSelector - Estado:`

**O que você deve ver**:
```javascript
OrganizationProjectSelector - Estado: {
  orgsCount: 1,        // ← Deve ser > 0
  projsCount: 1,       // ← Deve ser > 0
  currentOrg: "uuid",  // ← Deve ter valor
  currentProj: "uuid", // ← Deve ter valor
  orgDetails: { ... }, // ← Deve ter dados
  projDetails: { ... },// ← Deve ter dados
  loading: false
}
```

**Se você vê**:
```javascript
{
  orgsCount: 0,        // ← PROBLEMA!
  projsCount: 0,       // ← PROBLEMA!
  ...
}
```

**Significa**: O backend não está retornando organizations/projects no login.

---

## 🛠️ Soluções

### Solução 1: Verificar Resposta do Backend

#### Passo 1: Abrir Network Tab
1. F12 → Aba `Network`
2. Faça login
3. Procure requisição `POST /login`
4. Clique nela → Aba `Response`

#### Passo 2: Verificar Estrutura da Resposta

**✅ Resposta CORRETA** (backend atualizado):
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "permissions": ["admin"],
    "active": true
  },
  "token": "eyJhbGc...",
  "organizations": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "organization_id": "org-uuid-123",
      "role": "owner",
      "active": true,
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    }
  ],
  "projects": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "project_id": "proj-uuid-456",
      "role": "admin",
      "active": true,
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

**❌ Resposta ANTIGA** (backend não atualizado):
```json
{
  "user": {
    "id": "uuid",
    "organization_id": "org-uuid",  // ← Campo antigo
    "project_id": "proj-uuid",      // ← Campo antigo
    "role": "admin",                // ← Campo antigo
    ...
  },
  "token": "eyJhbGc..."
  // ← SEM organizations array
  // ← SEM projects array
}
```

---

### Solução 2: Backend Precisa Ser Atualizado

Se o backend retorna a estrutura antiga, você tem duas opções:

#### Opção A: Atualizar o Backend (RECOMENDADO)

O backend precisa retornar `organizations` e `projects` no login.

**Verifique se o backend foi atualizado** conforme o guia de migração.

#### Opção B: Criar Adaptador Temporário (workaround)

Se não puder atualizar o backend agora, crie um adaptador no frontend:

**Edite**: `src/context/authContext.tsx`

Encontre a função `login` e adicione:

```typescript
const login = async (credentials: LoginRequest) => {
  try {
    setLoading(true);

    const response = await authService.login(credentials);
    const { token: authToken, user: userData, organizations: userOrgs, projects: userProjects } = response.data;

    // ⭐ ADAPTADOR TEMPORÁRIO para backend antigo
    let finalOrgs = userOrgs || [];
    let finalProjects = userProjects || [];

    // Se o backend retornou estrutura antiga (user.organization_id)
    if (!userOrgs && userData.organization_id) {
      console.warn('⚠️ Backend usando estrutura antiga - criando adaptador');

      finalOrgs = [{
        id: 'temp-' + Date.now(),
        user_id: userData.id,
        organization_id: userData.organization_id,
        role: userData.role || 'member',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];

      finalProjects = [{
        id: 'temp-' + Date.now(),
        user_id: userData.id,
        project_id: userData.project_id,
        role: userData.role || 'member',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    }

    setOrganizations(finalOrgs);
    setProjects(finalProjects);

    // Define primeira organização e projeto como padrão
    const defaultOrg = finalOrgs?.[0]?.organization_id || null;
    const defaultProject = finalProjects?.[0]?.project_id || null;

    // ... resto do código continua igual
  }
};
```

---

### Solução 3: Usuário Não Tem Organizations/Projects

Se o backend está correto mas retorna arrays vazios:

```json
{
  "organizations": [],  // ← VAZIO
  "projects": []        // ← VAZIO
}
```

**Significa**: O usuário não foi vinculado a nenhuma organização/projeto.

#### Como Vincular Usuário

**Opção A: Via API**

```bash
# 1. Adicionar usuário a uma organização
curl -X POST https://lep-system-516622888070.us-central1.run.app/user/{userId}/organization \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "organization_id": "org-uuid",
    "role": "owner"
  }'

# 2. Adicionar usuário a um projeto
curl -X POST https://lep-system-516622888070.us-central1.run.app/user/{userId}/project \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "project_id": "project-uuid",
    "role": "admin"
  }'
```

**Opção B: Via Banco de Dados**

```sql
-- Vincular usuário a organização
INSERT INTO user_organizations (id, user_id, organization_id, role, active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'user-uuid-aqui',
  'organization-uuid-aqui',
  'owner',
  true,
  NOW(),
  NOW()
);

-- Vincular usuário a projeto
INSERT INTO user_projects (id, user_id, project_id, role, active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'user-uuid-aqui',
  'project-uuid-aqui',
  'admin',
  true,
  NOW(),
  NOW()
);
```

---

## 🧪 Teste Manual

Execute no console do navegador (F12):

```javascript
// Verificar localStorage
const check = {
  user: JSON.parse(localStorage.getItem('@LEP:user')),
  organizations: JSON.parse(localStorage.getItem('@LEP:organizations') || '[]'),
  projects: JSON.parse(localStorage.getItem('@LEP:projects') || '[]'),
  currentOrg: localStorage.getItem('@LEP:currentOrganization'),
  currentProj: localStorage.getItem('@LEP:currentProject')
};

console.table(check);

// Diagnóstico
if (check.organizations.length === 0) {
  console.error('❌ Nenhuma organização no localStorage');
  console.log('Possíveis causas:');
  console.log('1. Backend não retornou organizations no login');
  console.log('2. Usuário não está vinculado a nenhuma organização');
  console.log('3. Erro ao persistir no localStorage');
} else {
  console.log('✅ Organizações encontradas:', check.organizations.length);
}

if (check.projects.length === 0) {
  console.error('❌ Nenhum projeto no localStorage');
} else {
  console.log('✅ Projetos encontrados:', check.projects.length);
}
```

---

## 📋 Checklist de Diagnóstico

- [ ] Console mostra logs do `OrganizationProjectSelector`?
- [ ] `orgsCount` e `projsCount` são > 0?
- [ ] Requisição `/login` retorna `organizations` e `projects`?
- [ ] localStorage tem `@LEP:organizations` e `@LEP:projects`?
- [ ] Usuário está vinculado a pelo menos 1 org/projeto no banco?
- [ ] Backend foi atualizado para nova estrutura multi-tenant?

---

## 🆘 Ainda com Problemas?

1. **Limpe o localStorage e faça login novamente**:
   ```javascript
   localStorage.clear();
   // Depois faça login
   ```

2. **Verifique os logs do backend** quando fizer login

3. **Use o adaptador temporário** (Solução 2 - Opção B) se o backend ainda não foi atualizado

4. **Consulte**: [DEBUG.md](./DEBUG.md) para mais detalhes

---

## ✅ Como Saber se Está Funcionando

Você deve ver no header:

```
┌────────────────────────────────────────┐
│  🏢 Restaurante Principal (owner) ▼    │
│  📁 Filial Centro (admin) ▼            │
└────────────────────────────────────────┘
```

E no console:

```
OrganizationProjectSelector - Estado: {
  orgsCount: 2,
  projsCount: 3,
  currentOrg: "uuid...",
  currentProj: "uuid...",
  orgDetails: { name: "Restaurante Principal" },
  projDetails: { name: "Filial Centro" },
  loading: false
}
```
