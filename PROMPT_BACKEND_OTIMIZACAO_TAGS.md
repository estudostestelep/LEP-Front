# PROMPT: Otimização de Carregamento de Produtos com Tags

## 📋 Contexto do Problema

Atualmente, o frontend faz **50+ requisições** ao carregador uma página de cardápio:
1. 1x GET `/product` (lista de produtos)
2. 1x GET `/tag/active` (lista de tags)
3. 50x GET `/product/{id}/tags` (uma requisição por cada produto) ⚠️ **PROBLEMA**

**Impacto:** Com 50 produtos = ~5 segundos de carregamento

---

## ✅ Solução Proposta

Criar um novo endpoint que retorna **produtos com tags pré-carregadas** em uma única requisição.

---

## 🔧 Especificação Técnica da Rota

### Endpoint
```
GET /product
```

### Query Parameters (todos opcionais)

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `includeTags` | `boolean` | Se true, incluir tags de cada produto (NOVO) | `?includeTags=true` |
| `active` | `boolean` | Retornar apenas produtos ativos | `?active=true` |
| `entity_type` | `string` | Filtrar por tipo de entidade | `?entity_type=product` |
| `menu_id` | `string` | Filtrar por ID do menu | `?menu_id=menu-001` |
| `limit` | `int` | Limite de resultados (paginação) | `?limit=50` |
| `offset` | `int` | Offset para paginação | `?offset=0` |

### Exemplo de Requisição
```bash
GET /product?includeTags=true&active=true&limit=100
```

---

## 📤 Resposta Esperada

### HTTP 200 OK

```json
{
  "data": [
    {
      "id": "prod-550e8400-e29b-41d4-a716-446655440000",
      "name": "Hamburger Especial",
      "description": "Hambúrguer 200g com queijo cheddar, bacon e alface fresca",
      "sku": "HAM-SPEC-001",
      "price": 45.90,
      "cost": 15.50,
      "active": true,
      "image_url": "https://cdn.example.com/hamburger.jpg",
      "preparation_time": 15,
      "entity_type": "product",
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-20T14:30:00Z",
      "tags": [
        {
          "id": "tag-001",
          "name": "Quente",
          "description": "Servido quente",
          "color": "#ff6b6b",
          "entity_type": "product",
          "active": true,
          "created_at": "2025-01-10T09:00:00Z"
        },
        {
          "id": "tag-002",
          "name": "Recomendado",
          "description": "Item mais vendido",
          "color": "#4ecdc4",
          "entity_type": "product",
          "active": true,
          "created_at": "2025-01-10T09:15:00Z"
        }
      ]
    },
    {
      "id": "prod-660e8400-e29b-41d4-a716-446655440001",
      "name": "Salada Caesar",
      "description": "Salada fresca com molho Caesar caseiro e croutons",
      "sku": "SAL-CAES-001",
      "price": 32.50,
      "cost": 8.00,
      "active": true,
      "image_url": "https://cdn.example.com/salada.jpg",
      "preparation_time": 5,
      "entity_type": "product",
      "created_at": "2025-01-16T11:00:00Z",
      "updated_at": "2025-01-20T14:30:00Z",
      "tags": [
        {
          "id": "tag-003",
          "name": "Vegetariano",
          "description": "Sem proteína animal",
          "color": "#95e1d3",
          "entity_type": "product",
          "active": true,
          "created_at": "2025-01-10T09:30:00Z"
        },
        {
          "id": "tag-004",
          "name": "Saudável",
          "description": "Baixas calorias",
          "color": "#f38181",
          "entity_type": "product",
          "active": true,
          "created_at": "2025-01-10T09:45:00Z"
        }
      ]
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

### Resposta quando `includeTags=false` ou não informado

```json
{
  "data": [
    {
      "id": "prod-550e8400-e29b-41d4-a716-446655440000",
      "name": "Hamburger Especial",
      "description": "Hambúrguer 200g com queijo cheddar, bacon e alface fresca",
      "sku": "HAM-SPEC-001",
      "price": 45.90,
      "cost": 15.50,
      "active": true,
      "image_url": "https://cdn.example.com/hamburger.jpg",
      "preparation_time": 15,
      "entity_type": "product",
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-20T14:30:00Z"
      // tags NÃO incluído
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

---

## 🗄️ Query SQL Esperada (GORM)

### Query Base (sem tags)
```go
// Já implementado, apenas adicionar validação do includeTags
query := db.WithContext(ctx).
    Where("deleted_at IS NULL").
    Where("organization_id = ?", organizationId).
    Where("project_id = ?", projectId)

// Filtros opcionais
if active {
    query = query.Where("active = ?", true)
}
if menuId != "" {
    query = query.Where("menu_id = ?", menuId)
}
```

### Query Otimizada (com tags - usando Preload)
```go
// USAR PRELOAD DO GORM PARA EAGER LOADING
query := db.WithContext(ctx).
    Preload("Tags", func(db *gorm.DB) *gorm.DB {
        return db.Where("active = ?", true).
               Where("entity_type = ?", "product")
    }).
    Where("deleted_at IS NULL").
    Where("organization_id = ?", organizationId).
    Where("project_id = ?", projectId)

if active {
    query = query.Where("active = ?", true)
}
if menuId != "" {
    query = query.Where("menu_id = ?", menuId)
}

var products []Product
if err := query.Limit(limit).Offset(offset).Find(&products).Error; err != nil {
    return nil, err
}
```

**Nota:** O GORM `Preload()` faz um LEFT JOIN automaticamente, resolvendo o problema de N+1 queries

---

## 🏗️ Estrutura de Código Esperada (Go)

### Handler em `handler/product_handler.go`

```go
// ListProducts retorna lista de produtos com opcional de incluir tags
func (h *ProductHandler) ListProducts(c *gin.Context) {
    ctx := c.Request.Context()

    // Extrair headers multi-tenant
    organizationId := c.GetHeader("X-Lpe-Organization-Id")
    projectId := c.GetHeader("X-Lpe-Project-Id")

    // Extrair query parameters
    includeTags := c.Query("includeTags") == "true"
    active := c.Query("active") == "true"
    menuId := c.Query("menu_id")
    limit := 50
    offset := 0

    if l := c.Query("limit"); l != "" {
        if parsed, err := strconv.Atoi(l); err == nil {
            limit = parsed
        }
    }
    if o := c.Query("offset"); o != "" {
        if parsed, err := strconv.Atoi(o); err == nil {
            offset = parsed
        }
    }

    // Chamar serviço
    products, total, err := h.productService.ListProducts(ctx, &dto.ListProductsRequest{
        IncludeTags:    includeTags,
        Active:         active,
        MenuId:         menuId,
        OrganizationId: organizationId,
        ProjectId:      projectId,
        Limit:          limit,
        Offset:         offset,
    })

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "data":   products,
        "total":  total,
        "limit":  limit,
        "offset": offset,
    })
}
```

### DTO em `dto/product_dto.go`

```go
type ListProductsRequest struct {
    IncludeTags    bool
    Active         bool
    MenuId         string
    OrganizationId string
    ProjectId      string
    Limit          int
    Offset         int
}

type ProductResponse struct {
    ID              string      `json:"id"`
    Name            string      `json:"name"`
    Description     string      `json:"description"`
    SKU             string      `json:"sku"`
    Price           float64     `json:"price"`
    Cost            float64     `json:"cost"`
    Active          bool        `json:"active"`
    ImageUrl        string      `json:"image_url"`
    PreparationTime int         `json:"preparation_time"`
    EntityType      string      `json:"entity_type"`
    CreatedAt       time.Time   `json:"created_at"`
    UpdatedAt       time.Time   `json:"updated_at"`
    Tags            []TagResponse `json:"tags,omitempty"` // Apenas incluído se IncludeTags=true
}

type TagResponse struct {
    ID          string    `json:"id"`
    Name        string    `json:"name"`
    Description string    `json:"description"`
    Color       string    `json:"color"`
    EntityType  string    `json:"entity_type"`
    Active      bool      `json:"active"`
    CreatedAt   time.Time `json:"created_at"`
}
```

### Serviço em `server/product_server.go`

```go
func (s *ProductServer) ListProducts(
    ctx context.Context,
    req *dto.ListProductsRequest,
) ([]dto.ProductResponse, int64, error) {

    query := s.db.WithContext(ctx).
        Where("deleted_at IS NULL").
        Where("organization_id = ?", req.OrganizationId).
        Where("project_id = ?", req.ProjectId)

    // Eager load tags se solicitado
    if req.IncludeTags {
        query = query.Preload("Tags", func(db *gorm.DB) *gorm.DB {
            return db.Where("active = ?", true).
                   Where("entity_type = ?", "product")
        })
    }

    // Filtros opcionais
    if req.Active {
        query = query.Where("active = ?", true)
    }
    if req.MenuId != "" {
        query = query.Where("menu_id = ?", req.MenuId)
    }

    // Contar total
    var total int64
    if err := query.Model(&model.Product{}).Count(&total).Error; err != nil {
        return nil, 0, err
    }

    // Buscar produtos
    var products []model.Product
    if err := query.
        Limit(req.Limit).
        Offset(req.Offset).
        Find(&products).Error; err != nil {
        return nil, 0, err
    }

    // Converter para DTO
    responses := make([]dto.ProductResponse, len(products))
    for i, p := range products {
        responses[i] = dto.ProductResponse{
            ID:              p.ID,
            Name:            p.Name,
            Description:     p.Description,
            SKU:             p.SKU,
            Price:           p.Price,
            Cost:            p.Cost,
            Active:          p.Active,
            ImageUrl:        p.ImageUrl,
            PreparationTime: p.PreparationTime,
            EntityType:      p.EntityType,
            CreatedAt:       p.CreatedAt,
            UpdatedAt:       p.UpdatedAt,
        }

        // Incluir tags apenas se foram carregadas
        if req.IncludeTags && len(p.Tags) > 0 {
            responses[i].Tags = make([]dto.TagResponse, len(p.Tags))
            for j, t := range p.Tags {
                responses[i].Tags[j] = dto.TagResponse{
                    ID:          t.ID,
                    Name:        t.Name,
                    Description: t.Description,
                    Color:       t.Color,
                    EntityType:  t.EntityType,
                    Active:      t.Active,
                    CreatedAt:   t.CreatedAt,
                }
            }
        }
    }

    return responses, total, nil
}
```

---

## 🚀 Ganho de Performance

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Requisições | 50+ | 2 | -96% |
| Tempo de Carregamento (50 produtos) | ~5s | ~200ms | 25x mais rápido |
| Latência de Network | Serial | Paralelo | Instantâneo |
| Carga no Backend | Alta | Baixa | -50% |

---

## 📝 Checklist de Implementação

- [ ] Adicionar parâmetro `includeTags` ao handler `ListProducts`
- [ ] Implementar lógica de `Preload` no GORM para eager loading
- [ ] Atualizar DTO para incluir tags opcionalmente
- [ ] Testar SQL gerada (verificar se há JOIN correto)
- [ ] Testar com cURL/Postman:
  - [ ] `GET /product` (sem tags)
  - [ ] `GET /product?includeTags=true` (com tags)
  - [ ] `GET /product?includeTags=true&active=true` (com filtros)
- [ ] Validar multi-tenant (headers X-Lpe-*)
- [ ] Testar performance com 100+ produtos
- [ ] Documentar na API (Swagger/OpenAPI se existente)

---

## 📞 Próximos Passos no Frontend

Após implementar no backend:

1. Atualizar `src/api/productService.ts`:
   ```typescript
   getAll: (params?: { includeTags?: boolean; active?: boolean }) =>
     api.get<ProductResponse[]>("/product", { params })
   ```

2. Refatorar `src/pages/menu/menu.tsx`:
   ```typescript
   const productsRes = await productService.getAll({ includeTags: true });
   // Remover o loop de carregamento de tags
   ```

3. Fazer o mesmo em `src/pages/public/menu.tsx` e `src/pages/products/list.tsx`

---

## 🔗 Referências

- **GORM Preload:** https://gorm.io/docs/preload.html
- **GORM Eager Loading:** https://gorm.io/docs/associations.html
- **N+1 Query Problem:** https://stackoverflow.com/questions/97197/what-is-the-n1-selects-problem
