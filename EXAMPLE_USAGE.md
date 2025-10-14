# Exemplo de Uso - Seletor de Organização/Projeto

## 🎨 Componente Visual no Header

Os 2 selects foram adicionados ao header da aplicação e aparecem automaticamente quando o usuário está logado.

### Localização
- **Arquivo**: [src/components/OrganizationProjectSelector.tsx](src/components/OrganizationProjectSelector.tsx)
- **Integração**: [src/components/navbar.tsx](src/components/navbar.tsx) linha 113
- **Posição**: Entre o menu de navegação e o botão "Sair"

### Aparência

```
┌─────────────────────────────────────────────────────────────────┐
│  LEP System   Home  Menu  ...                                   │
│                                                                  │
│    ┌──────────────────┐  │  ┌──────────────────┐   Olá, João   │
│    │ 🏢 Restaurante 1 ▼│  │  │ 📁 Filial Centro ▼│   [Sair]     │
│    └──────────────────┘  │  └──────────────────┘                │
└─────────────────────────────────────────────────────────────────┘
        ↑ Organização        ↑ Projeto
```

### Design
- **Fundo**: Cinza claro (`bg-muted/40`)
- **Borda**: Sutil (`border border-border`)
- **Ícones**:
  - 🏢 `Building2` para Organização
  - 📁 `FolderKanban` para Projeto
  - ⌄ `ChevronDown` indicando dropdown
- **Separador**: Linha vertical entre os dois selects
- **Hover**: Ícones mudam de cor ao passar o mouse
- **Responsivo**: Nomes truncados se muito longos (max 150px)

---

## 📋 Como Testar

### 1. Certifique-se que o Backend está Retornando os Dados

O endpoint `/login` deve retornar:

```json
{
  "user": {
    "id": "uuid-do-usuario",
    "name": "João Silva",
    "email": "joao@example.com",
    "permissions": ["admin"],
    "active": true,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  },
  "token": "jwt-token-aqui",
  "organizations": [
    {
      "id": "uuid-user-org-1",
      "user_id": "uuid-do-usuario",
      "organization_id": "uuid-org-1",
      "role": "owner",
      "active": true,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    },
    {
      "id": "uuid-user-org-2",
      "user_id": "uuid-do-usuario",
      "organization_id": "uuid-org-2",
      "role": "admin",
      "active": true,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "projects": [
    {
      "id": "uuid-user-proj-1",
      "user_id": "uuid-do-usuario",
      "project_id": "uuid-proj-1",
      "role": "admin",
      "active": true,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    },
    {
      "id": "uuid-user-proj-2",
      "user_id": "uuid-do-usuario",
      "project_id": "uuid-proj-2",
      "role": "manager",
      "active": true,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### 2. Endpoints de Organização e Projeto

O sistema também precisa destes endpoints para buscar os nomes:

```
GET /organization/:id
GET /project/:id
```

Exemplo de resposta `/organization/:id`:
```json
{
  "id": "uuid-org-1",
  "name": "Restaurante Principal",
  "description": "Matriz do restaurante",
  "email": "contato@restaurante.com",
  "phone": "+5511999999999",
  "address": "Rua Principal, 123",
  "active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

Exemplo de resposta `/project/:id`:
```json
{
  "id": "uuid-proj-1",
  "name": "Filial Centro",
  "description": "Filial do centro da cidade",
  "organization_id": "uuid-org-1",
  "active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

### 3. Iniciar o Frontend

```bash
npm run dev
```

### 4. Fazer Login

1. Acesse `http://localhost:5173/login`
2. Faça login com um usuário que tenha múltiplas organizações/projetos
3. Você será redirecionado e verá os 2 selects no header

### 5. Testar Troca de Contexto

1. **Trocar Organização**: Clique no primeiro select (🏢) e escolha outra organização
   - O projeto será automaticamente resetado para o primeiro da nova org
   - Todas as requisições subsequentes usarão a nova organização

2. **Trocar Projeto**: Clique no segundo select (📁) e escolha outro projeto
   - Todas as requisições subsequentes usarão o novo projeto

3. **Verificar Headers**: Abra o DevTools (F12) → Network
   - Veja que todas as requisições agora incluem:
     - `X-Lpe-Organization-Id: <novo-org-id>`
     - `X-Lpe-Project-Id: <novo-project-id>`

---

## 🔍 Comportamentos Especiais

### Carregamento Inicial
- Mostra um spinner e texto "Carregando..." enquanto busca dados das orgs/projetos

### Sem Organizações
- Se o usuário não tiver organizações, os selects não aparecem

### Filtragem de Projetos
- O select de projetos mostra apenas projetos da organização atual
- Ao trocar de organização, o primeiro projeto disponível é selecionado automaticamente

### Persistência
- A seleção é salva no `localStorage`
- Ao recarregar a página, mantém a última org/projeto selecionados

### Nomes Não Carregados
- Se não conseguir carregar o nome da org/projeto, mostra:
  - `Org 12345678` (primeiros 8 chars do UUID)
  - `Projeto 87654321`

---

## 🎯 Teste de Integração Completa

### Cenário: Alternar entre Restaurantes

**Setup:**
- Usuário tem acesso a 2 restaurantes (organizações)
- Cada restaurante tem 2 filiais (projetos)

**Passos:**
1. Login → Restaurante 1 / Filial A selecionados automaticamente
2. Criar um produto → produto criado no Restaurante 1 / Filial A
3. Alternar para Restaurante 2 → Filial C selecionada automaticamente
4. Listar produtos → lista vazia (contexto diferente)
5. Criar outro produto → produto criado no Restaurante 2 / Filial C
6. Voltar para Restaurante 1 → Filial A
7. Listar produtos → vê o primeiro produto criado

**Resultado esperado:** ✅ Cada contexto mantém seus próprios dados

---

## 🐛 Troubleshooting

### "Selects não aparecem no header"
**Possíveis causas:**
- Usuário não está logado
- Backend não retornou `organizations` no login
- Array `organizations` está vazio

**Solução:**
1. Verifique o console: `localStorage.getItem('organizations')`
2. Deve retornar um array JSON com pelo menos 1 item

### "Nomes aparecem como 'Org 12345678'"
**Causa:** Endpoint `/organization/:id` não está funcionando

**Solução:**
1. Verifique o console do navegador (erros de API)
2. Teste o endpoint diretamente: `GET https://lep-system-516622888070.us-central1.run.app/organization/<id>`

### "Headers não são enviados nas requisições"
**Causa:** `currentOrganization` ou `currentProject` não estão no localStorage

**Solução:**
1. Faça logout e login novamente
2. Verifique:
   - `localStorage.getItem('currentOrganization')`
   - `localStorage.getItem('currentProject')`

---

## 📸 Preview em Diferentes Estados

### Estado Normal (com dados)
```
╔═══════════════════════════════════════════════════════╗
║  [🏢 Restaurante Principal ▼]  │  [📁 Filial Centro ▼] ║
╚═══════════════════════════════════════════════════════╝
```

### Carregando
```
╔═══════════════════════════╗
║  ⟳ Carregando...          ║
╚═══════════════════════════╝
```

### Apenas 1 Projeto
```
╔═════════════════════════════════════════╗
║  [🏢 Meu Restaurante ▼]  │  [📁 Main ▼] ║
╚═════════════════════════════════════════╝
```

### Sem Projetos (não mostra separador nem 2º select)
```
╔═══════════════════════════╗
║  [🏢 Meu Restaurante ▼]   ║
╚═══════════════════════════╝
```

---

## 💡 Dicas de UX

### Indicação Visual de Mudança
Quando o usuário troca de org/projeto, considere:
- Mostrar um toast: "Contexto alterado para [Nome]"
- Recarregar a página/lista atual
- Limpar estados de formulários abertos

### Role/Permissão por Contexto
Você pode acessar o role do usuário em cada contexto:

```typescript
const { organizations, currentOrganization } = useAuth();
const userOrgRelation = organizations.find(
  o => o.organization_id === currentOrganization
);
const isOwner = userOrgRelation?.role === 'owner';
```

---

**Pronto para usar! 🎉**
