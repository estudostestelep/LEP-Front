# Resolução do Problema - OrganizationProjectSelector

## 🎯 Problema Identificado

Você não consegue visualizar o componente `OrganizationProjectSelector` no header após o login.

## 🔍 Causa Raiz

O componente só aparece se houver organizações vinculadas ao usuário. Há 3 possíveis causas:

### 1. Backend não retorna `organizations` e `projects`
O endpoint `/login` está retornando a estrutura antiga sem os arrays.

### 2. Usuário não está vinculado a organizações/projetos
O usuário existe mas não tem relacionamentos `UserOrganization` / `UserProject`.

### 3. localStorage não está sendo populado
Erro na persistência dos dados após login.

---

## ✅ Mudanças Aplicadas

### 1. Componente com Debug
Agora o componente mostra logs no console e um aviso visual:

**Se não houver organizações**, mostra:
```
⚠️ Nenhuma organização vinculada
```

**Logs no console**:
```javascript
OrganizationProjectSelector - Estado: {
  orgsCount: 0,  // ← Aqui você vê o problema
  projsCount: 0,
  ...
}
```

### 2. Documentação Criada

- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Guia completo de resolução
- **[DEBUG.md](./DEBUG.md)** - Ferramentas de diagnóstico

---

## 🛠️ Como Resolver

### Opção 1: Verificar Backend (PRIMEIRO PASSO)

1. Abra DevTools (F12)
2. Vá para aba **Network**
3. Faça login
4. Procure requisição `POST /login`
5. Clique → aba **Response**

**Verifique se a resposta tem**:
```json
{
  "user": { ... },
  "token": "...",
  "organizations": [ ... ],  // ← DEVE EXISTIR
  "projects": [ ... ]        // ← DEVE EXISTIR
}
```

#### Se NÃO tem organizations/projects:

**O backend precisa ser atualizado** para retornar esses dados. Consulte o guia de migração do backend.

---

### Opção 2: Vincular Usuário (SE ARRAYS VAZIOS)

Se o backend retorna `organizations: []` e `projects: []`:

#### Via API:
```bash
POST /user/{userId}/organization
{
  "organization_id": "org-uuid",
  "role": "owner"
}

POST /user/{userId}/project
{
  "project_id": "project-uuid",
  "role": "admin"
}
```

#### Via SQL:
```sql
INSERT INTO user_organizations (id, user_id, organization_id, role, active, created_at, updated_at)
VALUES (gen_random_uuid(), 'user-id', 'org-id', 'owner', true, NOW(), NOW());

INSERT INTO user_projects (id, user_id, project_id, role, active, created_at, updated_at)
VALUES (gen_random_uuid(), 'user-id', 'project-id', 'admin', true, NOW(), NOW());
```

---

### Opção 3: Verificar localStorage

No console do navegador (F12):

```javascript
// Verificar dados salvos
JSON.parse(localStorage.getItem('@LEP:organizations'))
JSON.parse(localStorage.getItem('@LEP:projects'))

// Se estiverem vazios ou null, faça:
localStorage.clear();
// Depois faça login novamente
```

---

## 🧪 Script de Teste Automático

Cole no console (F12) após o login:

```javascript
const diagnostico = {
  localStorage: {
    organizations: JSON.parse(localStorage.getItem('@LEP:organizations') || '[]'),
    projects: JSON.parse(localStorage.getItem('@LEP:projects') || '[]'),
    currentOrg: localStorage.getItem('@LEP:currentOrganization'),
    currentProj: localStorage.getItem('@LEP:currentProject')
  }
};

console.log('=== DIAGNÓSTICO ===');
console.table(diagnostico.localStorage);

const problemas = [];

if (diagnostico.localStorage.organizations.length === 0) {
  problemas.push('❌ Nenhuma organização encontrada');
}

if (diagnostico.localStorage.projects.length === 0) {
  problemas.push('❌ Nenhum projeto encontrado');
}

if (!diagnostico.localStorage.currentOrg) {
  problemas.push('❌ currentOrganization não definido');
}

if (!diagnostico.localStorage.currentProj) {
  problemas.push('❌ currentProject não definido');
}

if (problemas.length > 0) {
  console.error('PROBLEMAS ENCONTRADOS:');
  problemas.forEach(p => console.error(p));
  console.log('\n📖 Consulte TROUBLESHOOTING.md para soluções');
} else {
  console.log('✅ Tudo OK! O componente deve aparecer.');
}
```

---

## 📋 Checklist de Resolução

Execute na ordem:

1. [ ] **Abrir console e verificar logs**
   - F12 → Console
   - Procurar por: `OrganizationProjectSelector - Estado`
   - Verificar `orgsCount` e `projsCount`

2. [ ] **Verificar requisição de login**
   - F12 → Network
   - POST /login → Response
   - Verificar se tem `organizations` e `projects`

3. [ ] **Verificar localStorage**
   - Executar script de teste acima
   - Verificar se dados foram salvos

4. [ ] **Vincular usuário** (se necessário)
   - Via API ou SQL
   - Fazer logout e login novamente

5. [ ] **Verificar visual**
   - Deve aparecer no header
   - Ou mostrar aviso: `⚠️ Nenhuma organização vinculada`

---

## 🎯 Resultado Esperado

Após resolver, você deve ver:

### No Header:
```
┌────────────────────────────────────────┐
│ 🏢 Restaurante Principal (owner) ▼     │
│ 📁 Filial Centro (admin) ▼             │
└────────────────────────────────────────┘
```

### No Console:
```javascript
OrganizationProjectSelector - Estado: {
  orgsCount: 1,                    // ✅ > 0
  projsCount: 1,                   // ✅ > 0
  currentOrg: "uuid...",           // ✅ Definido
  currentProj: "uuid...",          // ✅ Definido
  orgDetails: { name: "..." },     // ✅ Carregado
  projDetails: { name: "..." },    // ✅ Carregado
  loading: false                   // ✅ Não está carregando
}
```

### Funcionalidade:
- ✅ Selects aparecem
- ✅ Pode trocar entre organizações
- ✅ Pode trocar entre projetos
- ✅ Toasts aparecem ao trocar
- ✅ Roles são exibidos: `"Nome (role)"`

---

## 🆘 Precisa de Ajuda?

1. **Leia**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Guia detalhado
2. **Debug**: [DEBUG.md](./DEBUG.md) - Ferramentas de diagnóstico
3. **Verifique logs**: Console do navegador sempre mostra o estado
4. **Backend**: Certifique-se que foi atualizado para multi-tenant

---

## 📝 Próximos Passos

Após resolver:

1. ✅ Componente aparecerá automaticamente
2. ✅ Remova os logs de debug se quiser (linha 18-27 do componente)
3. ✅ Teste trocar entre organizações/projetos
4. ✅ Verifique se os headers das requisições mudam
5. ✅ Pronto para produção!
