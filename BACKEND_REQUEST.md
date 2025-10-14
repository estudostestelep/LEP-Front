# Solicitação de Alteração no Backend - Response do Login

## Problema Atual

O endpoint `/login` retorna apenas as **relações** (UserOrganization e UserProject) com IDs, mas não inclui os nomes das organizações e projetos. Isso força o frontend a fazer chamadas adicionais às APIs para buscar esses detalhes.

**Response atual:**
```json
{
  "organizations": [
    {
      "id": "5df17ae5-9d05-4d11-8213-374cdb5c66db",
      "user_id": "856247fc-4464-4c63-afaf-2130c4db4e72",
      "organization_id": "123e4567-e89b-12d3-a456-426614174000",
      "role": "owner",
      "active": true,
      "created_at": "2025-10-12T17:13:33.445419-03:00",
      "updated_at": "2025-10-12T17:13:33.445419-03:00"
    }
  ],
  "projects": [
    {
      "id": "fe825bb8-2082-4784-af14-e6f9c99d41df",
      "user_id": "856247fc-4464-4c63-afaf-2130c4db4e72",
      "project_id": "ff96637d-b726-4ddb-87a8-75448d9fa6e3",
      "role": "admin",
      "active": true,
      "created_at": "2025-10-12T17:22:23.38373-03:00",
      "updated_at": "2025-10-12T17:22:23.38373-03:00"
    }
  ]
}
```

## Solução Proposta

Expandir os objetos de relação para incluir informações denormalizadas das entidades relacionadas.

**Response desejado:**
```json
{
  "organizations": [
    {
      "id": "5df17ae5-9d05-4d11-8213-374cdb5c66db",
      "user_id": "856247fc-4464-4c63-afaf-2130c4db4e72",
      "organization_id": "123e4567-e89b-12d3-a456-426614174000",
      "organization_name": "Restaurante XYZ",           // NOVO - Nome da organização
      "role": "owner",
      "active": true,
      "created_at": "2025-10-12T17:13:33.445419-03:00",
      "updated_at": "2025-10-12T17:13:33.445419-03:00"
    }
  ],
  "projects": [
    {
      "id": "fe825bb8-2082-4784-af14-e6f9c99d41df",
      "user_id": "856247fc-4464-4c63-afaf-2130c4db4e72",
      "project_id": "ff96637d-b726-4ddb-87a8-75448d9fa6e3",
      "project_name": "Projeto Principal",             // NOVO - Nome do projeto
      "organization_id": "123e4567-e89b-12d3-a456-426614174000", // NOVO - ID da org pai
      "role": "admin",
      "active": true,
      "created_at": "2025-10-12T17:22:23.38373-03:00",
      "updated_at": "2025-10-12T17:22:23.38373-03:00"
    }
  ],
  "token": "...",
  "user": { ... }
}
```

## Campos a Adicionar

### UserOrganization
- `organization_name` (string, opcional): Nome da organização obtido via JOIN com a tabela `organizations`

### UserProject
- `project_name` (string, opcional): Nome do projeto obtido via JOIN com a tabela `projects`
- `organization_id` (string, opcional): ID da organização pai do projeto (útil para filtrar projetos por organização no frontend)

## Implementação Sugerida (Go + GORM)

```go
// Estrutura de resposta expandida
type UserOrganizationResponse struct {
    ID              string    `json:"id"`
    UserID          string    `json:"user_id"`
    OrganizationID  string    `json:"organization_id"`
    OrganizationName *string  `json:"organization_name,omitempty"` // NOVO
    Role            string    `json:"role"`
    Active          bool      `json:"active"`
    CreatedAt       time.Time `json:"created_at"`
    UpdatedAt       time.Time `json:"updated_at"`
}

type UserProjectResponse struct {
    ID              string    `json:"id"`
    UserID          string    `json:"user_id"`
    ProjectID       string    `json:"project_id"`
    ProjectName     *string   `json:"project_name,omitempty"`      // NOVO
    OrganizationID  *string   `json:"organization_id,omitempty"`   // NOVO
    Role            string    `json:"role"`
    Active          bool      `json:"active"`
    CreatedAt       time.Time `json:"created_at"`
    UpdatedAt       time.Time `json:"updated_at"`
}

// Query com JOIN para obter nomes
func (s *AuthServer) Login(ctx *gin.Context) {
    // ... validação de credenciais ...

    // Buscar organizações do usuário com nomes
    var userOrgs []UserOrganizationResponse
    err := s.db.Table("user_organizations").
        Select("user_organizations.*, organizations.name as organization_name").
        Joins("LEFT JOIN organizations ON organizations.id = user_organizations.organization_id").
        Where("user_organizations.user_id = ? AND user_organizations.active = ?", user.ID, true).
        Scan(&userOrgs).Error

    // Buscar projetos do usuário com nomes e org_id
    var userProjects []UserProjectResponse
    err = s.db.Table("user_projects").
        Select("user_projects.*, projects.name as project_name, projects.organization_id").
        Joins("LEFT JOIN projects ON projects.id = user_projects.project_id").
        Where("user_projects.user_id = ? AND user_projects.active = ?", user.ID, true).
        Scan(&userProjects).Error

    // ... retornar response ...
}
```

## Benefícios

1. **Performance**: Reduz de 3+ chamadas HTTP para apenas 1 (login já traz tudo)
2. **UX**: Interface carrega mais rápido, sem delays para buscar nomes
3. **Simplicidade**: Frontend não precisa fazer JOIN manual de dados
4. **Consistência**: Dados de org/projeto sempre disponíveis no primeiro render

## Status Frontend

✅ **Frontend já está preparado** para receber esses campos:
- [src/types/auth.ts](src/types/auth.ts) - Interfaces atualizadas
- [src/components/OrganizationProjectSelector.tsx](src/components/OrganizationProjectSelector.tsx) - Usa `organization_name` e `project_name`
- [src/pages/settings/index.tsx](src/pages/settings/index.tsx) - Fallback para nomes das relações

## Compatibilidade

Os novos campos são **opcionais** (nullable), então:
- ✅ Não quebra clientes antigos
- ✅ Novos clientes mostram nomes imediatamente
- ✅ Fallback gracioso se backend não retornar os campos
