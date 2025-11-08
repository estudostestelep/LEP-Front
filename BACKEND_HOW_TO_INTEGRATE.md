# 📚 Backend Integration Guide - Step by Step

## Introduction

This guide explains **exactly** how to implement the two feature sets in your Go backend:
1. **Display Settings** - Control what's shown in the menu
2. **Theme Light/Dark Mode** - Support independent light and dark colors

---

## Part 1: Display Settings Integration

### Step 1.1: Create Database Table

Go to your database and run:

```sql
CREATE TABLE display_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  project_id UUID NOT NULL,
  show_prep_time BOOLEAN DEFAULT true,
  show_rating BOOLEAN DEFAULT true,
  show_description BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE(project_id, deleted_at),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE INDEX idx_display_settings_project ON display_settings(project_id, deleted_at);
```

### Step 1.2: Create Go Model

File: `internal/models/display_settings.go`

```go
package models

import "time"

type DisplaySettings struct {
    ID             string     `json:"id" gorm:"primaryKey"`
    OrganizationID string     `json:"organization_id"`
    ProjectID      string     `json:"project_id"`
    ShowPrepTime   bool       `json:"show_prep_time" gorm:"default:true"`
    ShowRating     bool       `json:"show_rating" gorm:"default:true"`
    ShowDescription bool      `json:"show_description" gorm:"default:true"`
    CreatedAt      time.Time  `json:"created_at"`
    UpdatedAt      time.Time  `json:"updated_at"`
    DeletedAt      *time.Time `json:"deleted_at" gorm:"index"`
}

type UpdateDisplaySettingsDTO struct {
    ShowPrepTime    *bool `json:"show_prep_time"`
    ShowRating      *bool `json:"show_rating"`
    ShowDescription *bool `json:"show_description"`
}
```

### Step 1.3: Create Repository

File: `internal/repository/display_settings.go`

```go
package repository

import (
    "context"
    "errors"
    "lep-system/internal/models"
    "gorm.io/gorm"
)

type DisplaySettingsRepository struct {
    db *gorm.DB
}

func NewDisplaySettingsRepository(db *gorm.DB) *DisplaySettingsRepository {
    return &DisplaySettingsRepository{db: db}
}

// Get current settings for project
func (r *DisplaySettingsRepository) GetByProjectID(ctx context.Context, orgID, projectID string) (*models.DisplaySettings, error) {
    var settings models.DisplaySettings
    result := r.db.WithContext(ctx).
        Where("organization_id = ? AND project_id = ? AND deleted_at IS NULL", orgID, projectID).
        First(&settings)

    if errors.Is(result.Error, gorm.ErrRecordNotFound) {
        return nil, nil // Not found is OK, return nil
    }
    return &settings, result.Error
}

// Create new settings
func (r *DisplaySettingsRepository) Create(ctx context.Context, settings *models.DisplaySettings) error {
    return r.db.WithContext(ctx).Create(settings).Error
}

// Update existing settings (PUT)
func (r *DisplaySettingsRepository) Update(ctx context.Context, orgID, projectID string, updates *models.UpdateDisplaySettingsDTO) (*models.DisplaySettings, error) {
    var settings models.DisplaySettings

    // First, try to get existing settings
    result := r.db.WithContext(ctx).
        Where("organization_id = ? AND project_id = ? AND deleted_at IS NULL", orgID, projectID).
        First(&settings)

    if errors.Is(result.Error, gorm.ErrRecordNotFound) {
        // Create new if not exists
        settings = models.DisplaySettings{
            OrganizationID: orgID,
            ProjectID:      projectID,
        }
    } else if result.Error != nil {
        return nil, result.Error
    }

    // Apply updates
    if updates.ShowPrepTime != nil {
        settings.ShowPrepTime = *updates.ShowPrepTime
    }
    if updates.ShowRating != nil {
        settings.ShowRating = *updates.ShowRating
    }
    if updates.ShowDescription != nil {
        settings.ShowDescription = *updates.ShowDescription
    }

    // Save
    return &settings, r.db.WithContext(ctx).Save(&settings).Error
}

// Reset to defaults
func (r *DisplaySettingsRepository) Reset(ctx context.Context, orgID, projectID string) (*models.DisplaySettings, error) {
    settings := &models.DisplaySettings{
        OrganizationID:  orgID,
        ProjectID:       projectID,
        ShowPrepTime:    true,
        ShowRating:      true,
        ShowDescription: true,
    }
    return settings, r.db.WithContext(ctx).Save(settings).Error
}
```

### Step 1.4: Create Service Layer

File: `internal/services/display_settings.go`

```go
package services

import (
    "context"
    "lep-system/internal/models"
    "lep-system/internal/repository"
)

type DisplaySettingsService struct {
    repo *repository.DisplaySettingsRepository
}

func NewDisplaySettingsService(repo *repository.DisplaySettingsRepository) *DisplaySettingsService {
    return &DisplaySettingsService{repo: repo}
}

func (s *DisplaySettingsService) GetSettings(ctx context.Context, orgID, projectID string) (*models.DisplaySettings, error) {
    settings, err := s.repo.GetByProjectID(ctx, orgID, projectID)
    if err != nil {
        return nil, err
    }

    // If not found, return defaults
    if settings == nil {
        return &models.DisplaySettings{
            OrganizationID:  orgID,
            ProjectID:       projectID,
            ShowPrepTime:    true,
            ShowRating:      true,
            ShowDescription: true,
        }, nil
    }

    return settings, nil
}

func (s *DisplaySettingsService) UpdateSettings(ctx context.Context, orgID, projectID string, updates *models.UpdateDisplaySettingsDTO) (*models.DisplaySettings, error) {
    return s.repo.Update(ctx, orgID, projectID, updates)
}

func (s *DisplaySettingsService) ResetSettings(ctx context.Context, orgID, projectID string) (*models.DisplaySettings, error) {
    return s.repo.Reset(ctx, orgID, projectID)
}
```

### Step 1.5: Create Handlers

File: `internal/handlers/display_settings.go`

```go
package handlers

import (
    "net/http"
    "lep-system/internal/models"
    "lep-system/internal/services"
    "github.com/gin-gonic/gin"
)

type DisplaySettingsHandler struct {
    service *services.DisplaySettingsService
}

func NewDisplaySettingsHandler(service *services.DisplaySettingsService) *DisplaySettingsHandler {
    return &DisplaySettingsHandler{service: service}
}

// GET /project/settings/display
func (h *DisplaySettingsHandler) GetSettings(c *gin.Context) {
    orgID := c.GetString("X-Lpe-Organization-Id")
    projectID := c.GetString("X-Lpe-Project-Id")

    settings, err := h.service.GetSettings(c.Request.Context(), orgID, projectID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, settings)
}

// PUT /project/settings/display
func (h *DisplaySettingsHandler) UpdateSettings(c *gin.Context) {
    orgID := c.GetString("X-Lpe-Organization-Id")
    projectID := c.GetString("X-Lpe-Project-Id")

    var dto models.UpdateDisplaySettingsDTO
    if err := c.ShouldBindJSON(&dto); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
        return
    }

    settings, err := h.service.UpdateSettings(c.Request.Context(), orgID, projectID, &dto)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, settings)
}

// POST /project/settings/display
func (h *DisplaySettingsHandler) CreateSettings(c *gin.Context) {
    // Same as PUT (idempotent)
    h.UpdateSettings(c)
}

// POST /project/settings/display/reset
func (h *DisplaySettingsHandler) ResetSettings(c *gin.Context) {
    orgID := c.GetString("X-Lpe-Organization-Id")
    projectID := c.GetString("X-Lpe-Project-Id")

    settings, err := h.service.ResetSettings(c.Request.Context(), orgID, projectID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, settings)
}
```

### Step 1.6: Register Routes

In your main router file (e.g., `internal/routes/routes.go`):

```go
// After creating instances of handler
settingsHandler := handlers.NewDisplaySettingsHandler(settingsService)

// Add routes
settings := r.Group("/project/settings")
settings.Use(middleware.AuthMiddleware()) // Your auth middleware
settings.Use(middleware.HeaderValidationMiddleware()) // Your header validation
{
    settings.GET("/display", settingsHandler.GetSettings)
    settings.PUT("/display", settingsHandler.UpdateSettings)
    settings.POST("/display", settingsHandler.CreateSettings)
    settings.POST("/display/reset", settingsHandler.ResetSettings)
}
```

---

## Part 2: Theme Light/Dark Mode Integration

### Step 2.1: Extend Database Table

```sql
-- Add 28 new columns to existing theme_customizations table
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

-- Semantic colors
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

-- System colors
ALTER TABLE theme_customizations ADD COLUMN focus_ring_color_light VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN focus_ring_color_dark VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN input_background_color_light VARCHAR(7);
ALTER TABLE theme_customizations ADD COLUMN input_background_color_dark VARCHAR(7);
```

### Step 2.2: Update Go Model

Update your existing `ThemeCustomization` struct in `internal/models/theme.go`:

```go
type ThemeCustomization struct {
    ID                  string     `json:"id" gorm:"primaryKey"`
    OrganizationID      string     `json:"organization_id"`
    ProjectID           string     `json:"project_id"`

    // Legacy fields (backward compatibility)
    PrimaryColor        *string    `json:"primary_color"`
    SecondaryColor      *string    `json:"secondary_color"`
    BackgroundColor     *string    `json:"background_color"`
    CardBackgroundColor *string    `json:"card_background_color"`
    TextColor           *string    `json:"text_color"`
    TextSecondaryColor  *string    `json:"text_secondary_color"`
    AccentColor         *string    `json:"accent_color"`
    DestructiveColor    *string    `json:"destructive_color"`
    SuccessColor        *string    `json:"success_color"`
    WarningColor        *string    `json:"warning_color"`
    BorderColor         *string    `json:"border_color"`
    PriceColor          *string    `json:"price_color"`
    FocusRingColor      *string    `json:"focus_ring_color"`
    InputBackgroundColor *string   `json:"input_background_color"`

    // New light/dark variants
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

    // Semantic colors
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

    // System colors
    FocusRingColorLight         *string `json:"focus_ring_color_light"`
    FocusRingColorDark          *string `json:"focus_ring_color_dark"`
    InputBackgroundColorLight   *string `json:"input_background_color_light"`
    InputBackgroundColorDark    *string `json:"input_background_color_dark"`

    IsActive  bool       `json:"is_active" gorm:"default:false"`
    CreatedAt time.Time  `json:"created_at"`
    UpdatedAt time.Time  `json:"updated_at"`
    DeletedAt *time.Time `json:"deleted_at" gorm:"index"`
}

type UpdateThemeCustomizationDTO struct {
    // Legacy
    PrimaryColor            *string `json:"primary_color"`
    // ... all legacy fields

    // New
    PrimaryColorLight           *string `json:"primary_color_light"`
    PrimaryColorDark            *string `json:"primary_color_dark"`
    // ... all 28 new fields
}
```

### Step 2.3: Add Color Validation

Add to `internal/services/validation.go` (or create it):

```go
package services

import (
    "fmt"
    "regexp"
)

var hexColorRegex = regexp.MustCompile(`^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$`)

// ValidateHexColor validates a HEX color format (#RRGGBB or #RRGGBBAA)
func ValidateHexColor(color *string) error {
    if color == nil {
        return nil // Optional field
    }

    if !hexColorRegex.MatchString(*color) {
        return fmt.Errorf("invalid HEX color format: %s", *color)
    }

    return nil
}

// ValidateThemeColors validates all color fields
func ValidateThemeColors(dto *models.UpdateThemeCustomizationDTO) error {
    colorFields := []*string{
        // Legacy
        dto.PrimaryColor,
        dto.SecondaryColor,
        dto.BackgroundColor,
        // ... all legacy fields

        // New
        dto.PrimaryColorLight,
        dto.PrimaryColorDark,
        dto.SecondaryColorLight,
        // ... all 28 new fields
    }

    for i, color := range colorFields {
        if err := ValidateHexColor(color); err != nil {
            return fmt.Errorf("field %d: %w", i, err)
        }
    }

    return nil
}
```

### Step 2.4: Update Existing Theme Handlers

Just update your existing `/project/settings/theme` handlers to:

1. **Accept the 28 new fields** in UpdateThemeCustomizationDTO
2. **Return the 28 new fields** in responses
3. **Validate all color fields** using the validation function
4. **Update the reset endpoint** to set default light/dark values

Example for GET (minimal change):

```go
func (h *ThemeHandler) GetTheme(c *gin.Context) {
    orgID := c.GetString("X-Lpe-Organization-Id")
    projectID := c.GetString("X-Lpe-Project-Id")

    theme, err := h.service.GetTheme(c.Request.Context(), orgID, projectID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, theme) // Now includes all 28 new fields
}
```

Example for PUT (with validation):

```go
func (h *ThemeHandler) UpdateTheme(c *gin.Context) {
    orgID := c.GetString("X-Lpe-Organization-Id")
    projectID := c.GetString("X-Lpe-Project-Id")

    var dto models.UpdateThemeCustomizationDTO
    if err := c.ShouldBindJSON(&dto); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
        return
    }

    // Validate all colors (legacy + new)
    if err := services.ValidateThemeColors(&dto); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    theme, err := h.service.UpdateTheme(c.Request.Context(), orgID, projectID, &dto)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, theme) // Now includes all 28 new fields
}
```

Example for Reset:

```go
func (h *ThemeHandler) ResetTheme(c *gin.Context) {
    orgID := c.GetString("X-Lpe-Organization-Id")
    projectID := c.GetString("X-Lpe-Project-Id")

    defaultTheme := &models.UpdateThemeCustomizationDTO{
        // Light mode defaults
        PrimaryColorLight: ptrString("#1E293B"),
        BackgroundColorLight: ptrString("#FFFFFF"),
        TextColorLight: ptrString("#0F172A"),
        // ... all light defaults

        // Dark mode defaults
        PrimaryColorDark: ptrString("#F8FAFC"),
        BackgroundColorDark: ptrString("#0F172A"),
        TextColorDark: ptrString("#F8FAFC"),
        // ... all dark defaults
    }

    theme, err := h.service.UpdateTheme(c.Request.Context(), orgID, projectID, defaultTheme)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, theme)
}

// Helper function
func ptrString(s string) *string {
    return &s
}
```

---

## Checklist for Implementation

### Display Settings
- [ ] Create `display_settings` table
- [ ] Create `DisplaySettings` model
- [ ] Create `DisplaySettingsRepository`
- [ ] Create `DisplaySettingsService`
- [ ] Create `DisplaySettingsHandler`
- [ ] Register 4 routes
- [ ] Test with cURL

### Theme Light/Dark
- [ ] Run ALTER TABLE (28 ADD COLUMN commands)
- [ ] Update `ThemeCustomization` model (add 28 fields)
- [ ] Update `UpdateThemeCustomizationDTO` (add 28 fields)
- [ ] Add `ValidateHexColor()` function
- [ ] Update GET handler (no logic change, auto returns new fields)
- [ ] Update PUT handler (add color validation)
- [ ] Update POST handler (add color validation)
- [ ] Update RESET handler (set light/dark defaults)
- [ ] Test with cURL

---

## Testing Commands

### Display Settings

```bash
# Create
curl -X POST http://localhost:8080/project/settings/display \
  -H "X-Lpe-Organization-Id: test-org" \
  -H "X-Lpe-Project-Id: test-proj" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"show_prep_time": true, "show_rating": false}'

# Get
curl -X GET http://localhost:8080/project/settings/display \
  -H "X-Lpe-Organization-Id: test-org" \
  -H "X-Lpe-Project-Id: test-proj" \
  -H "Authorization: Bearer TOKEN"
```

### Theme Light/Dark

```bash
# Update only dark colors
curl -X PUT http://localhost:8080/project/settings/theme \
  -H "X-Lpe-Organization-Id: test-org" \
  -H "X-Lpe-Project-Id: test-proj" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "primary_color_dark": "#E2E8F0",
    "background_color_dark": "#0F172A"
  }'
```

---

## Done! 🎉

Once you complete these steps, the frontend will automatically work with your new endpoints and save all light/dark mode customizations!

Questions? Check the detailed docs:
- `BACKEND_DISPLAY_SETTINGS_REQUIRED.md`
- `BACKEND_THEME_CUSTOMIZATION_LIGHT_DARK.md`
