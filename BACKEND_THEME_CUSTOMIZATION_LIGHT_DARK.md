# 🎨 Backend Integration Required: Theme Customization with Light/Dark Mode

## Status: FRONTEND READY, BACKEND ENHANCEMENT NEEDED

O frontend foi completamente refatorado para suportar customização **independente de cores para modo claro e modo escuro**. O backend precisa estender os endpoints de tema para suportar os novos campos de variantes light/dark.

---

## 📋 Extensão Necessária na ThemeCustomization

### Campo Atual (Legado - Mantido por Compatibilidade)
```
primary_color
secondary_color
background_color
card_background_color
text_color
text_secondary_color
accent_color
destructive_color
success_color
warning_color
border_color
price_color
focus_ring_color
input_background_color
```

### Novos Campos Necessários (Light/Dark Variants)

Cada cor acima precisa ter duas variantes:

#### Cores Principais (7 campos × 2 = 14 novos campos)
```
primary_color_light        // Modo claro
primary_color_dark         // Modo escuro
secondary_color_light
secondary_color_dark
background_color_light
background_color_dark
card_background_color_light
card_background_color_dark
text_color_light
text_color_dark
text_secondary_color_light
text_secondary_color_dark
accent_color_light
accent_color_dark
```

#### Cores Semânticas (5 campos × 2 = 10 novos campos)
```
destructive_color_light
destructive_color_dark
success_color_light
success_color_dark
warning_color_light
warning_color_dark
border_color_light
border_color_dark
price_color_light
price_color_dark
```

#### Configurações do Sistema (2 campos × 2 = 4 novos campos)
```
focus_ring_color_light
focus_ring_color_dark
input_background_color_light
input_background_color_dark
```

---

## 🗄️ Schema do Banco de Dados (Extensão)

### Alterar Tabela: `theme_customizations`

```sql
-- Adicionar novos campos à tabela existente
ALTER TABLE theme_customizations ADD COLUMN primary_color_light VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN primary_color_dark VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN secondary_color_light VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN secondary_color_dark VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN background_color_light VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN background_color_dark VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN card_background_color_light VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN card_background_color_dark VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN text_color_light VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN text_color_dark VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN text_secondary_color_light VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN text_secondary_color_dark VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN accent_color_light VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN accent_color_dark VARCHAR(7);

-- Cores Semânticas
ALTER TABLE theme_customizations ADD COLUMN destructive_color_light VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN destructive_color_dark VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN success_color_light VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN success_color_dark VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN warning_color_light VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN warning_color_dark VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN border_color_light VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN border_color_dark VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN price_color_light VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN price_color_dark VARCHAR(7);

-- Configurações do Sistema
ALTER TABLE theme_customizations ADD COLUMN focus_ring_color_light VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN focus_ring_color_dark VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN input_background_color_light VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN input_background_color_dark VARCHAR(7);
```

---

## 📝 Tipos Go (Backend)

### Estender Struct ThemeCustomization

```go
package models

type ThemeCustomization struct {
    ID                    string     `json:"id" gorm:"primaryKey"`
    OrganizationID        string     `json:"organization_id"`
    ProjectID             string     `json:"project_id"`

    // ====== LEGACY FIELDS (deprecated, maintained for backward compatibility) ======
    PrimaryColor          *string    `json:"primary_color"`
    SecondaryColor        *string    `json:"secondary_color"`
    BackgroundColor       *string    `json:"background_color"`
    CardBackgroundColor   *string    `json:"card_background_color"`
    TextColor             *string    `json:"text_color"`
    TextSecondaryColor    *string    `json:"text_secondary_color"`
    AccentColor           *string    `json:"accent_color"`
    DestructiveColor      *string    `json:"destructive_color"`
    SuccessColor          *string    `json:"success_color"`
    WarningColor          *string    `json:"warning_color"`
    BorderColor           *string    `json:"border_color"`
    PriceColor            *string    `json:"price_color"`
    FocusRingColor        *string    `json:"focus_ring_color"`
    InputBackgroundColor  *string    `json:"input_background_color"`

    // ====== NEW FIELDS (Light/Dark variants) ======
    // Primary Colors
    PrimaryColorLight           *string `json:"primary_color_light"`
    PrimaryColorDark            *string `json:"primary_color_dark"`
    SecondaryColorLight         *string `json:"secondary_color_light"`
    SecondaryColorDark          *string `json:"secondary_color_dark"`
    BackgroundColorLight        *string `json:"background_color_light"`
    BackgroundColorDark         *string `json:"background_color_dark"`
    CardBackgroundColorLight    *string `json:"card_background_color_light"`
    CardBackgroundColorDark     *string `json:"card_background_color_dark"`
    TextColorLight              *string `json:"text_color_light"`
    TextColorDark               *string `json:"text_color_dark"`
    TextSecondaryColorLight     *string `json:"text_secondary_color_light"`
    TextSecondaryColorDark      *string `json:"text_secondary_color_dark"`
    AccentColorLight            *string `json:"accent_color_light"`
    AccentColorDark             *string `json:"accent_color_dark"`

    // Semantic Colors
    DestructiveColorLight       *string `json:"destructive_color_light"`
    DestructiveColorDark        *string `json:"destructive_color_dark"`
    SuccessColorLight           *string `json:"success_color_light"`
    SuccessColorDark            *string `json:"success_color_dark"`
    WarningColorLight           *string `json:"warning_color_light"`
    WarningColorDark            *string `json:"warning_color_dark"`
    BorderColorLight            *string `json:"border_color_light"`
    BorderColorDark             *string `json:"border_color_dark"`
    PriceColorLight             *string `json:"price_color_light"`
    PriceColorDark              *string `json:"price_color_dark"`

    // System Settings
    FocusRingColorLight         *string `json:"focus_ring_color_light"`
    FocusRingColorDark          *string `json:"focus_ring_color_dark"`
    InputBackgroundColorLight   *string `json:"input_background_color_light"`
    InputBackgroundColorDark    *string `json:"input_background_color_dark"`

    // Metadata
    IsActive                    bool      `json:"is_active" gorm:"default:false"`
    CreatedAt                   time.Time `json:"created_at"`
    UpdatedAt                   time.Time `json:"updated_at"`
    DeletedAt                   *time.Time `json:"deleted_at" gorm:"index"`
}

// UpdateThemeCustomizationDTO - Allows partial updates
type UpdateThemeCustomizationDTO struct {
    // Legacy fields (optional)
    PrimaryColor            *string `json:"primary_color"`
    SecondaryColor          *string `json:"secondary_color"`
    BackgroundColor         *string `json:"background_color"`
    CardBackgroundColor     *string `json:"card_background_color"`
    TextColor               *string `json:"text_color"`
    TextSecondaryColor      *string `json:"text_secondary_color"`
    AccentColor             *string `json:"accent_color"`
    DestructiveColor        *string `json:"destructive_color"`
    SuccessColor            *string `json:"success_color"`
    WarningColor            *string `json:"warning_color"`
    BorderColor             *string `json:"border_color"`
    PriceColor              *string `json:"price_color"`
    FocusRingColor          *string `json:"focus_ring_color"`
    InputBackgroundColor    *string `json:"input_background_color"`

    // New light/dark variants (optional)
    PrimaryColorLight           *string `json:"primary_color_light"`
    PrimaryColorDark            *string `json:"primary_color_dark"`
    SecondaryColorLight         *string `json:"secondary_color_light"`
    SecondaryColorDark          *string `json:"secondary_color_dark"`
    BackgroundColorLight        *string `json:"background_color_light"`
    BackgroundColorDark         *string `json:"background_color_dark"`
    CardBackgroundColorLight    *string `json:"card_background_color_light"`
    CardBackgroundColorDark     *string `json:"card_background_color_dark"`
    TextColorLight              *string `json:"text_color_light"`
    TextColorDark               *string `json:"text_color_dark"`
    TextSecondaryColorLight     *string `json:"text_secondary_color_light"`
    TextSecondaryColorDark      *string `json:"text_secondary_color_dark"`
    AccentColorLight            *string `json:"accent_color_light"`
    AccentColorDark             *string `json:"accent_color_dark"`

    DestructiveColorLight       *string `json:"destructive_color_light"`
    DestructiveColorDark        *string `json:"destructive_color_dark"`
    SuccessColorLight           *string `json:"success_color_light"`
    SuccessColorDark            *string `json:"success_color_dark"`
    WarningColorLight           *string `json:"warning_color_light"`
    WarningColorDark            *string `json:"warning_color_dark"`
    BorderColorLight            *string `json:"border_color_light"`
    BorderColorDark             *string `json:"border_color_dark"`
    PriceColorLight             *string `json:"price_color_light"`
    PriceColorDark              *string `json:"price_color_dark"`

    FocusRingColorLight         *string `json:"focus_ring_color_light"`
    FocusRingColorDark          *string `json:"focus_ring_color_dark"`
    InputBackgroundColorLight   *string `json:"input_background_color_light"`
    InputBackgroundColorDark    *string `json:"input_background_color_dark"`
}
```

---

## 📊 Endpoints Existentes (Comportamento Esperado)

### GET /project/settings/theme

**Status**: Funcional, mas precisa retornar novos campos

**Response esperada (200 OK)**:
```json
{
  "id": "uuid",
  "project_id": "uuid",
  "organization_id": "uuid",

  "primary_color": "#1E293B",
  "secondary_color": "#8B5CF6",
  "background_color": "#FFFFFF",
  "card_background_color": "#FFFFFF",
  "text_color": "#0F172A",
  "text_secondary_color": "#64748B",
  "accent_color": "#EC4899",
  "destructive_color": "#EF4444",
  "success_color": "#10B981",
  "warning_color": "#F59E0B",
  "border_color": "#E5E7EB",
  "price_color": "#10B981",
  "focus_ring_color": "#3B82F6",
  "input_background_color": "#F3F4F6",

  "primary_color_light": "#1E293B",
  "primary_color_dark": "#F8FAFC",
  "secondary_color_light": "#8B5CF6",
  "secondary_color_dark": "#A78BFA",
  "background_color_light": "#FFFFFF",
  "background_color_dark": "#0F172A",
  "card_background_color_light": "#FFFFFF",
  "card_background_color_dark": "#1E293B",
  "text_color_light": "#0F172A",
  "text_color_dark": "#F8FAFC",
  "text_secondary_color_light": "#64748B",
  "text_secondary_color_dark": "#94A3B8",
  "accent_color_light": "#EC4899",
  "accent_color_dark": "#F472B6",

  "destructive_color_light": "#EF4444",
  "destructive_color_dark": "#DC2626",
  "success_color_light": "#10B981",
  "success_color_dark": "#34D399",
  "warning_color_light": "#F59E0B",
  "warning_color_dark": "#FBBF24",
  "border_color_light": "#E5E7EB",
  "border_color_dark": "#475569",
  "price_color_light": "#10B981",
  "price_color_dark": "#34D399",

  "focus_ring_color_light": "#3B82F6",
  "focus_ring_color_dark": "#93C5FD",
  "input_background_color_light": "#F3F4F6",
  "input_background_color_dark": "#1F2937",

  "is_active": true,
  "created_at": "2024-11-08T10:00:00Z",
  "updated_at": "2024-11-08T10:00:00Z"
}
```

### PUT /project/settings/theme

**Status**: Funcional, mas precisa aceitar novos campos

**Request Body** (exemplo atualizando apenas cor primária dark):
```json
{
  "primary_color_dark": "#E2E8F0"
}
```

**Comportamento esperado**:
- Aceitar qualquer combinação de campos legados e novos
- Atualizar parcialmente (não sobrescrever campos não enviados)
- Retornar objeto completo com todos os campos (antigos + novos)
- Validar que cores sejam em formato HEX válido (#RRGGBB ou #RRGGBBAA)

### POST /project/settings/theme

**Status**: Funcional, mas precisa aceitar novos campos

Mesmo comportamento que PUT, mas criar novo registro se não existir.

### POST /project/settings/theme/reset

**Status**: Precisa ser atualizado

**Comportamento esperado**:
```json
{
  // Resetar para valores padrão profissionais (DEFAULT_THEME_LIGHT e DEFAULT_THEME_DARK)
  "primary_color_light": "#1E293B",
  "primary_color_dark": "#F8FAFC",
  "secondary_color_light": "#8B5CF6",
  "secondary_color_dark": "#A78BFA",
  // ... todos os outros campos com valores padrão
}
```

---

## 🔐 Validações Necessárias

### 1. Formato HEX
```
✅ #RRGGBB (6 dígitos)
✅ #RRGGBBAA (8 dígitos)
❌ rgb(255,0,0)
❌ red
❌ #RGB (3 dígitos)
```

### 2. Multi-tenant
- Validar que organization_id e project_id do request headers correspondem ao usuário
- Não permitir acesso a temas de outros projetos/organizações

### 3. Soft Delete
- Usar `deleted_at` para soft delete
- Filtrar registros deletados em SELECTs
- Permitir recuperação de temas deletados

### 4. Validação de Campos
```go
func ValidateThemeColor(color *string) error {
    if color == nil {
        return nil // Campo opcional
    }
    if !isValidHexColor(*color) {
        return fmt.Errorf("invalid HEX color format: %s", *color)
    }
    return nil
}

func isValidHexColor(color string) bool {
    // Aceitar #RRGGBB (6 dígitos) ou #RRGGBBAA (8 dígitos)
    if len(color) != 7 && len(color) != 9 {
        return false
    }
    if color[0] != '#' {
        return false
    }
    for i := 1; i < len(color); i++ {
        c := color[i]
        if !((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F')) {
            return false
        }
    }
    return true
}
```

---

## 🧪 Exemplos de Teste com cURL

### GET Tema Atual
```bash
curl -X GET http://localhost:8080/project/settings/theme \
  -H "X-Lpe-Organization-Id: {org_id}" \
  -H "X-Lpe-Project-Id: {project_id}" \
  -H "Authorization: Bearer {token}"
```

### Atualizar Apenas Cores Dark
```bash
curl -X PUT http://localhost:8080/project/settings/theme \
  -H "X-Lpe-Organization-Id: {org_id}" \
  -H "X-Lpe-Project-Id: {project_id}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "primary_color_dark": "#E2E8F0",
    "secondary_color_dark": "#C084FC",
    "background_color_dark": "#0F172A"
  }'
```

### Atualizar Apenas Cores Light
```bash
curl -X PUT http://localhost:8080/project/settings/theme \
  -H "X-Lpe-Organization-Id: {org_id}" \
  -H "X-Lpe-Project-Id: {project_id}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "primary_color_light": "#1E293B",
    "background_color_light": "#FFFFFF"
  }'
```

### Reset para Padrão
```bash
curl -X POST http://localhost:8080/project/settings/theme/reset \
  -H "X-Lpe-Organization-Id: {org_id}" \
  -H "X-Lpe-Project-Id: {project_id}" \
  -H "Authorization: Bearer {token}"
```

---

## ✅ Implementação Checklist

### Fase 1: Database
- [ ] Criar migration para adicionar 28 novos campos
- [ ] Adicionar índices se necessário
- [ ] Backup dos dados existentes

### Fase 2: Backend
- [ ] Atualizar struct `ThemeCustomization` com 28 novos campos
- [ ] Criar/atualizar `UpdateThemeCustomizationDTO`
- [ ] Adicionar validação de cores HEX para novos campos
- [ ] Testar serialização/desserialização JSON

### Fase 3: Handlers
- [ ] Atualizar handler GET para retornar novos campos
- [ ] Atualizar handler PUT para aceitar novos campos
- [ ] Atualizar handler POST para aceitar novos campos
- [ ] Atualizar handler RESET para usar valores padrão light/dark

### Fase 4: Testing
- [ ] Testes unitários para validação de cores
- [ ] Testes de integração para CRUD completo
- [ ] Testes de multi-tenant (isolamento de dados)
- [ ] Testes de soft delete
- [ ] Testes de partial updates

### Fase 5: Documentation
- [ ] Atualizar Swagger/OpenAPI
- [ ] Documentar novos campos
- [ ] Exemplos de uso (cURL, SDK, etc)

---

## 🔗 Frontend Implementation Status

### ✅ Já Implementado
- [x] Suporte para light/dark variants em ThemeCustomization interface
- [x] Toggle Light/Dark no Modal de customização
- [x] Toggle Light/Dark na Tab de preview
- [x] Função themeToCSSVariables() com fallback para campos legados
- [x] Validação de cores HEX estendida para 15 cores
- [x] UI dinâmica mostrando campo correto baseado no toggle
- [x] Suporte a partial updates (PUT + POST)

### ⏳ Aguardando Backend
- [ ] Endpoints retornarem novos campos light/dark
- [ ] Persistência dos valores light/dark no banco

---

## 🎯 Prioridade

| Ordem | Tarefa | Prioridade |
|-------|--------|-----------|
| 1 | Database migration | **CRÍTICO** |
| 2 | Atualizar models Go | **CRÍTICO** |
| 3 | Implementar handlers | **CRÍTICO** |
| 4 | Validação de cores | **ALTA** |
| 5 | Testes | **MÉDIA** |
| 6 | Documentação | **BAIXA** |

---

## 📞 Observações Importantes

1. **Backward Compatibility**: Os campos legados (primary_color, secondary_color, etc) devem continuar funcionando
2. **Fallback Logic**: Se light/dark variants não forem preenchidas, usar valores dos campos legados
3. **Frontend Ready**: O frontend já está pronto para usar novos campos assim que backend retornar
4. **Soft Delete**: Importante para manter histórico de temas deletados

---

**Status**: ⏳ Aguardando implementação no backend
**Frontend Commit**: `d3d6101` - feat: implement light/dark mode color customization with toggle UI
**Data**: 2024-11-08
