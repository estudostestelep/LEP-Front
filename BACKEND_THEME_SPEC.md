# 🎨 Backend Theme Customization Extension Specification

## Overview

This document specifies the backend changes needed to support the extended theme customization system in LEP-Front. The frontend has been updated to handle 15 color/system configuration fields (previously 7), organized into 3 semantic categories.

## Database Schema Changes

### Current ThemeCustomization Structure (7 fields)
```sql
theme_customizations:
  - primary_color VARCHAR(7)
  - secondary_color VARCHAR(7)
  - background_color VARCHAR(7)
  - card_background_color VARCHAR(7)
  - text_color VARCHAR(7)
  - text_secondary_color VARCHAR(7)
  - accent_color VARCHAR(7)
```

### New ThemeCustomization Structure (+8 fields = 15 total)

#### Add these columns to `theme_customizations` table:

```sql
-- Semantic Colors (4 new fields)
ALTER TABLE theme_customizations
ADD COLUMN destructive_color VARCHAR(7) DEFAULT '#EF4444',
ADD COLUMN success_color VARCHAR(7) DEFAULT '#10B981',
ADD COLUMN warning_color VARCHAR(7) DEFAULT '#F59E0B',
ADD COLUMN border_color VARCHAR(7) DEFAULT '#E5E7EB';

-- System Configuration (4 new fields)
ALTER TABLE theme_customizations
ADD COLUMN disabled_opacity DECIMAL(3,2) DEFAULT 0.50,
ADD COLUMN focus_ring_color VARCHAR(7) DEFAULT '#3B82F6',
ADD COLUMN input_background_color VARCHAR(7) DEFAULT '#FFFFFF',
ADD COLUMN shadow_intensity DECIMAL(3,2) DEFAULT 1.00;
```

**Notes:**
- All new fields are optional (NULL allowed) for backward compatibility
- Default values represent industry-standard accessible colors
- `disabled_opacity` and `shadow_intensity` are numeric (0.0 to 1.0)
- Color fields use VARCHAR(7) for HEX format (#RRGGBB)

### Migration Strategy

Create a database migration that:
1. Adds the 8 new columns with DEFAULT values
2. Sets all existing records' new fields to the DEFAULT values
3. Maintains referential integrity with `project_id` and `organization_id`

**Example Migration (Go with GORM):**
```go
// Up: Add new theme fields
db.Migrator().AddColumn(&ThemeCustomization{}, "destructive_color")
db.Migrator().AddColumn(&ThemeCustomization{}, "success_color")
db.Migrator().AddColumn(&ThemeCustomization{}, "warning_color")
db.Migrator().AddColumn(&ThemeCustomization{}, "border_color")
db.Migrator().AddColumn(&ThemeCustomization{}, "disabled_opacity")
db.Migrator().AddColumn(&ThemeCustomization{}, "focus_ring_color")
db.Migrator().AddColumn(&ThemeCustomization{}, "input_background_color")
db.Migrator().AddColumn(&ThemeCustomization{}, "shadow_intensity")

// Set defaults for existing records
db.Model(&ThemeCustomization{}).
  Where("destructive_color IS NULL").
  Updates(map[string]interface{}{
    "destructive_color": "#EF4444",
    "success_color": "#10B981",
    "warning_color": "#F59E0B",
    "border_color": "#E5E7EB",
    "disabled_opacity": 0.50,
    "focus_ring_color": "#3B82F6",
    "input_background_color": "#FFFFFF",
    "shadow_intensity": 1.00,
  })
```

## Domain Model Updates

### Go Struct Changes

Update the `ThemeCustomization` struct in your domain model:

```go
type ThemeCustomization struct {
    ID                      string `gorm:"primaryKey"`
    ProjectID              string `gorm:"index"`
    OrganizationID         string `gorm:"index"`

    // Cores Principais (7 original fields)
    PrimaryColor           string `validate:"required,hexcolor"` // #3b82f6
    SecondaryColor         string `validate:"required,hexcolor"` // #8b5cf6
    BackgroundColor        string `validate:"required,hexcolor"` // #09090b
    CardBackgroundColor    string `validate:"required,hexcolor"` // #18181b
    TextColor              string `validate:"required,hexcolor"` // #fafafa
    TextSecondaryColor     string `validate:"required,hexcolor"` // #a1a1aa
    AccentColor            string `validate:"required,hexcolor"` // #ec4899

    // Cores Semânticas (4 new fields)
    DestructiveColor       *string `validate:"omitempty,hexcolor" gorm:"default:#EF4444"` // Errors
    SuccessColor           *string `validate:"omitempty,hexcolor" gorm:"default:#10B981"` // Success
    WarningColor           *string `validate:"omitempty,hexcolor" gorm:"default:#F59E0B"` // Warnings
    BorderColor            *string `validate:"omitempty,hexcolor" gorm:"default:#E5E7EB"` // Borders

    // Sistema (4 new fields)
    DisabledOpacity        *float64 `validate:"omitempty,min=0,max=1" gorm:"default:0.5"` // 0.0-1.0
    FocusRingColor         *string `validate:"omitempty,hexcolor" gorm:"default:#3B82F6"`
    InputBackgroundColor   *string `validate:"omitempty,hexcolor" gorm:"default:#FFFFFF"`
    ShadowIntensity        *float64 `validate:"omitempty,min=0,max=2" gorm:"default:1.0"` // 0.0-2.0

    IsActive               bool
    CreatedAt              time.Time
    UpdatedAt              time.Time
    DeletedAt              gorm.DeletedAt `gorm:"index"`
}
```

**Validation Rules:**
- Color fields use `hexcolor` validator (must be valid HEX: #RRGGBB)
- Opacity fields (0.0 to 1.0) with `min=0, max=1`
- ShadowIntensity (0.0 to 2.0) with `min=0, max=2`
- New fields are pointers (*string, *float64) to allow NULL for backward compatibility

## API Request/Response Contract

### GET /project/{projectId}/settings/theme

**Response (200 OK):**
```json
{
  "id": "uuid",
  "project_id": "uuid",
  "organization_id": "uuid",

  // Cores Principais
  "primary_color": "#3B82F6",
  "secondary_color": "#8B5CF6",
  "background_color": "#09090B",
  "card_background_color": "#18181B",
  "text_color": "#FAFAFA",
  "text_secondary_color": "#A1A1AA",
  "accent_color": "#EC4899",

  // Cores Semânticas (new)
  "destructive_color": "#EF4444",
  "success_color": "#10B981",
  "warning_color": "#F59E0B",
  "border_color": "#E5E7EB",

  // Sistema (new)
  "disabled_opacity": 0.5,
  "focus_ring_color": "#3B82F6",
  "input_background_color": "#FFFFFF",
  "shadow_intensity": 1.0,

  "is_active": true,
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

### PUT /project/{projectId}/settings/theme

**Request Body (all fields optional for partial updates):**
```json
{
  // Can update any subset of fields
  "primary_color": "#3B82F6",
  "success_color": "#10B981",
  "shadow_intensity": 1.2,
  // ... other fields as needed
}
```

**Response:** Same as GET (returns updated full theme)

### POST /project/{projectId}/settings/theme

**Request Body (create new theme):**
```json
{
  // All 15 fields - required fields have no default
  "primary_color": "#3B82F6",
  "secondary_color": "#8B5CF6",
  "background_color": "#09090B",
  "card_background_color": "#18181B",
  "text_color": "#FAFAFA",
  "text_secondary_color": "#A1A1AA",
  "accent_color": "#EC4899",

  // Optional fields (will use defaults if omitted)
  "destructive_color": "#EF4444",
  "success_color": "#10B981",
  "warning_color": "#F59E0B",
  "border_color": "#E5E7EB",
  "disabled_opacity": 0.5,
  "focus_ring_color": "#3B82F6",
  "input_background_color": "#FFFFFF",
  "shadow_intensity": 1.0
}
```

## Validation Rules

### Backend Validation Checklist

Implement these validations in your service/handler layer:

1. **HEX Color Validation**
   - Pattern: `^#[A-Fa-f0-9]{6}$`
   - All color fields must be valid HEX format
   - Case-insensitive but normalize to uppercase

2. **Contrast Validation** (Optional but Recommended)
   - Validate primary_color vs background_color ratio >= 4.5:1 (AA)
   - Validate text_color vs background_color ratio >= 4.5:1 (AA)
   - Validate destructive_color vs background_color ratio >= 4.5:1 (AA)
   - Warning if ratio < 7:1 (encourage AAA)
   - Include contrast ratio in response for frontend to display

3. **Numeric Validation**
   - `disabled_opacity`: 0.0 <= value <= 1.0
   - `shadow_intensity`: 0.0 <= value <= 2.0

4. **Required Fields Validation**
   - Original 7 fields are required (non-null)
   - New 8 fields are optional (can be null)
   - When null, frontend will use default values

### Error Responses

**400 Bad Request** - Invalid format:
```json
{
  "error": "Validation failed",
  "details": [
    "primary_color: invalid hex color format",
    "disabled_opacity: must be between 0.0 and 1.0"
  ]
}
```

**422 Unprocessable Entity** - Accessibility warning:
```json
{
  "error": "Accessibility validation failed",
  "warnings": [
    "primary_color vs background_color contrast ratio 3.2:1 is below minimum 4.5:1 (AA)",
    "success_color vs background_color contrast ratio 2.8:1 is below minimum 4.5:1 (AA)"
  ],
  "can_save": false
}
```

## Implementation Priority

### Phase 1 (Required)
- [ ] Add 8 new columns to theme_customizations table
- [ ] Create migration with default values
- [ ] Update Go struct with new fields
- [ ] Update GET endpoint to return new fields
- [ ] Update PUT endpoint to handle new fields
- [ ] Update POST endpoint to accept new fields
- [ ] Add basic HEX validation

### Phase 2 (Recommended)
- [ ] Add contrast validation service
- [ ] Return contrast warnings in API response
- [ ] Document API response contracts
- [ ] Add test cases for new validation rules

### Phase 3 (Nice to Have)
- [ ] Generate light/dark variants automatically
- [ ] Color history/audit trail
- [ ] Theme versioning
- [ ] API endpoint for theme presets

## Testing Checklist

### Unit Tests
- [ ] Hexcolor validation accepts valid colors
- [ ] Hexcolor validation rejects invalid colors
- [ ] Opacity validation (0-1 range)
- [ ] Shadow intensity validation (0-2 range)
- [ ] Contrast ratio calculation

### Integration Tests
- [ ] Create theme with all 15 fields
- [ ] Create theme with only 7 required fields (8 use defaults)
- [ ] Update theme with partial fields
- [ ] Get theme returns all fields with defaults
- [ ] Null fields get populated with defaults on retrieval

### API Tests
- [ ] POST /project/{id}/settings/theme with valid data → 201 Created
- [ ] GET /project/{id}/settings/theme → 200 with all fields
- [ ] PUT /project/{id}/settings/theme → 200 with updated data
- [ ] Invalid hex color → 400 Bad Request
- [ ] Missing required field → 400 Bad Request
- [ ] Contrast warning → 422 with warnings array

## Backward Compatibility

**Important:** Maintain backward compatibility with existing themes:
- Old themes with only 7 fields should work without modification
- New fields will be NULL and populated with defaults on retrieval
- API endpoints should handle both old and new response formats
- Frontend will handle missing fields and use defaults

## Frontend-Backend Contract

### What Frontend Expects
1. GET endpoint returns all 15 fields (with NULL/defaults filled)
2. PUT endpoint accepts partial updates (only fields being changed)
3. POST endpoint accepts all 15 fields (8 optional with defaults)
4. All color fields returned as HEX strings (#RRGGBB)
5. Numeric fields returned as numbers (not strings)

### What Backend Expects
1. Color values are valid HEX (#RRGGBB)
2. Opacity values are 0.0-1.0 range
3. Shadow intensity values are 0.0-2.0 range
4. Headers include X-Lpe-Organization-Id and X-Lpe-Project-Id
5. User has permission to modify project theme

## Documentation

Update your backend API documentation to include:
1. New field descriptions and purposes
2. Default values for new fields
3. Validation rules and constraints
4. Example requests and responses
5. Error codes and messages
6. Migration instructions for existing deployments

## Reference: Frontend Field Organization

### Cores Principais (7 fields - Original)
- `primary_color` - Cor principal do sistema
- `secondary_color` - Cor secundária para destaques
- `background_color` - Cor de fundo principal
- `card_background_color` - Fundo dos cards e modais
- `text_color` - Cor do texto principal
- `text_secondary_color` - Cor do texto secundário
- `accent_color` - Cor para elementos de destaque

### Cores Semânticas (4 fields - New)
- `destructive_color` - Cor para erros e ações destrutivas
- `success_color` - Cor para ações bem-sucedidas
- `warning_color` - Cor para avisos e atenção
- `border_color` - Cor padrão para bordas e divisores

### Configurações do Sistema (4 fields - New)
- `disabled_opacity` - Opacidade para estados desabilitados
- `focus_ring_color` - Cor para outline de foco
- `input_background_color` - Fundo específico para campos de entrada
- `shadow_intensity` - Intensidade de shadows

---

**Frontend Changes Completed:** ✅
- Type definitions updated
- UI components extended
- Validation enhanced
- 8 new fields ready to receive from backend

**Backend Awaiting:** ⏳
- Database schema migration
- Domain model updates
- API endpoint implementation
- Validation logic
- Integration testing
