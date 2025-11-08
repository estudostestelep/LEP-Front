# 🔧 Backend Integration Required: Display Settings API

## Status: FRONTEND READY, BACKEND IMPLEMENTATION PENDING

O frontend foi preparado para integrar com um sistema de configurações de exibição de produtos, mas o **backend ainda precisa implementar os endpoints**.

---

## 📋 Endpoints Necessários

### 1. GET /project/settings/display

**Descrição**: Recuperar configurações de exibição do projeto atual

**Headers Necessários**:
```
X-Lpe-Organization-Id: {org_id}
X-Lpe-Project-Id: {project_id}
Authorization: Bearer {token}
```

**Response (200 OK)**:
```json
{
  "id": "uuid",
  "project_id": "uuid",
  "organization_id": "uuid",
  "show_prep_time": true,
  "show_rating": true,
  "show_description": true,
  "created_at": "2024-11-08T10:00:00Z",
  "updated_at": "2024-11-08T10:00:00Z"
}
```

**Response (404 Not Found)**:
```json
{
  "error": "Display settings not found for this project"
}
```

---

### 2. PUT /project/settings/display

**Descrição**: Atualizar configurações de exibição do projeto

**Headers Necessários**:
```
X-Lpe-Organization-Id: {org_id}
X-Lpe-Project-Id: {project_id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "show_prep_time": boolean,
  "show_rating": boolean,
  "show_description": boolean
}
```

**Response (200 OK)**: Mesmo formato do GET

**Response (400 Bad Request)**:
```json
{
  "error": "Invalid settings format"
}
```

---

### 3. POST /project/settings/display

**Descrição**: Criar configurações de exibição pela primeira vez

**Headers Necessários**: Mesmos que PUT

**Request Body**: Mesmo que PUT

**Response (201 Created)**: Mesmo formato do GET

---

### 4. POST /project/settings/display/reset

**Descrição**: Resetar configurações para valores padrão

**Headers Necessários**: Mesmos que GET

**Request Body**:
```json
{}
```

**Response (200 OK)**: Mesmo formato do GET (com valores padrão)

---

## 🗄️ Schema do Banco de Dados

### Tabela: `display_settings`

```sql
CREATE TABLE display_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  show_prep_time BOOLEAN DEFAULT true,
  show_rating BOOLEAN DEFAULT true,
  show_description BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE(project_id, deleted_at),
  FOREIGN KEY (organization_id, project_id) REFERENCES projects(organization_id, id)
);

CREATE INDEX idx_display_settings_project ON display_settings(project_id, deleted_at);
```

---

## 📝 Tipos Go (Backend)

```go
package models

type DisplaySettings struct {
    ID             string    `json:"id" gorm:"primaryKey"`
    OrganizationID string    `json:"organization_id"`
    ProjectID      string    `json:"project_id"`
    ShowPrepTime   bool      `json:"show_prep_time" gorm:"default:true"`
    ShowRating     bool      `json:"show_rating" gorm:"default:true"`
    ShowDescription bool     `json:"show_description" gorm:"default:true"`
    CreatedAt      time.Time `json:"created_at"`
    UpdatedAt      time.Time `json:"updated_at"`
    DeletedAt      *time.Time `json:"deleted_at" gorm:"index"`
}

type UpdateDisplaySettingsDTO struct {
    ShowPrepTime    *bool `json:"show_prep_time"`
    ShowRating      *bool `json:"show_rating"`
    ShowDescription *bool `json:"show_description"`
}
```

---

## 🔐 Validações Necessárias

1. **Header Validation**: Validar que `X-Lpe-Organization-Id` e `X-Lpe-Project-Id` estão presentes
2. **Authorization**: Validar token JWT e permissões do usuário
3. **Soft Delete**: Usar `deleted_at` para soft delete, não remover registros
4. **Multi-tenant**: Garantir isolamento de dados entre organizações/projetos
5. **Atômicidade**: PUT deve ser idempotente (primeira vez cria, depois atualiza)

---

## 🧪 Teste com cURL

```bash
# GET
curl -X GET http://localhost:8080/project/settings/display \
  -H "X-Lpe-Organization-Id: {org_id}" \
  -H "X-Lpe-Project-Id: {project_id}" \
  -H "Authorization: Bearer {token}"

# PUT
curl -X PUT http://localhost:8080/project/settings/display \
  -H "X-Lpe-Organization-Id: {org_id}" \
  -H "X-Lpe-Project-Id: {project_id}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "show_prep_time": false,
    "show_rating": true,
    "show_description": true
  }'

# POST (first time)
curl -X POST http://localhost:8080/project/settings/display \
  -H "X-Lpe-Organization-Id: {org_id}" \
  -H "X-Lpe-Project-Id: {project_id}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "show_prep_time": true,
    "show_rating": true,
    "show_description": true
  }'

# Reset
curl -X POST http://localhost:8080/project/settings/display/reset \
  -H "X-Lpe-Organization-Id: {org_id}" \
  -H "X-Lpe-Project-Id: {project_id}" \
  -H "Authorization: Bearer {token}"
```

---

## 🎯 Implementação Checklist

- [ ] Criar tabela `display_settings` no banco de dados
- [ ] Criar struct `DisplaySettings` em models
- [ ] Implementar handler GET `/project/settings/display`
- [ ] Implementar handler PUT `/project/settings/display`
- [ ] Implementar handler POST `/project/settings/display`
- [ ] Implementar handler POST `/project/settings/display/reset`
- [ ] Adicionar header validation middleware
- [ ] Adicionar testes unitários
- [ ] Adicionar testes de integração
- [ ] Documentar em Swagger/OpenAPI

---

## 🔗 Observações

- O frontend trata corretamente erros 404 e usa `DEFAULT_DISPLAY_SETTINGS` como fallback
- O endpoint é multi-tenant (válida organization_id e project_id dos headers)
- As configurações são por projeto, não por usuário
- O soft delete é importante para manter histórico e recuperação

---

**Status**: ⏳ Aguardando implementação no backend
**Data**: 2024-11-08
