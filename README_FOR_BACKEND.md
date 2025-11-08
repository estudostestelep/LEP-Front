# 👋 Backend Team - Read This First!

## What's New in the Frontend

The frontend team has completed two major feature implementations that **require backend changes**:

1. **🎨 Theme Customization with Light/Dark Mode**
   - Independent light and dark color customization
   - 28 new color fields (7 primary × 2, 5 semantic × 2, 2 system × 2)
   - Toggle UI for switching between light/dark editing

2. **📺 Display Settings API**
   - Control what's shown in the menu (prep time, stars, description)
   - 3 boolean flags per project
   - Simple GET/PUT/POST/RESET endpoints

---

## Where to Start

### ⚡ Quick Start (5 minutes)

Read this file in order:
1. **`BACKEND_IMPLEMENTATION_SUMMARY.md`** ← START HERE
   - 2-minute overview
   - Checklist of what needs doing
   - Time estimates (6 hours total)

### 📚 Detailed Specifications

Then read the detailed specs:

2. **`BACKEND_HOW_TO_INTEGRATE.md`** (for implementation)
   - Step-by-step code examples
   - Ready-to-use Go code
   - Copy-paste friendly

3. **`BACKEND_DISPLAY_SETTINGS_REQUIRED.md`** (for Display Settings)
   - API specification
   - SQL schema
   - Full handler examples

4. **`BACKEND_THEME_CUSTOMIZATION_LIGHT_DARK.md`** (for Theme Colors)
   - Detailed schema
   - Struct definitions
   - Field mapping

---

## The Ask

### Display Settings (2 hours)
```
Create 4 new endpoints:
✅ GET    /project/settings/display
✅ PUT    /project/settings/display
✅ POST   /project/settings/display
✅ POST   /project/settings/display/reset

Database: 1 new table (display_settings)
Fields: 3 booleans (show_prep_time, show_rating, show_description)
```

### Theme Light/Dark Mode (4 hours)
```
Extend existing theme endpoints:
✅ GET    /project/settings/theme
✅ PUT    /project/settings/theme
✅ POST   /project/settings/theme
✅ POST   /project/settings/theme/reset

Database: 28 new columns in theme_customizations table
Fields: All optional HEX color values
Legacy: Keep old fields for backward compatibility
```

---

## What's Already Done (Frontend)

✅ **UI Components**
- Light/dark mode toggle in Modal
- Light/dark mode toggle in Tab preview
- Dynamic field selection
- Real-time preview

✅ **Type Definitions**
- All 28 new color fields in TypeScript
- Backward compatible with legacy fields
- Proper optional field types

✅ **Service Functions**
- Validation for all colors
- Converter function for CSS variables
- Fallback logic for legacy fields

✅ **Testing**
- Build successful (0 TypeScript errors)
- Dev server running
- Ready to receive new fields from backend

---

## Timeline

| Task | Time | Start | End |
|------|------|-------|-----|
| Database changes | 1 hour | Day 1 | Day 1 |
| Display Settings | 2 hours | Day 1 | Day 1 |
| Theme Light/Dark | 3 hours | Day 1-2 | Day 2 |
| Testing | 1 hour | Day 2 | Day 2 |
| **Total** | **~6 hours** | | |

---

## Frontend Status

**Frontend Commit**: `d3d6101`
**Branch**: `dev`
**Status**: 🟢 READY

Frontend is **fully ready** and will automatically work once backend returns the new fields!

---

## Questions Before You Start?

### "What about backward compatibility?"
✅ Legacy fields (primary_color, secondary_color, etc) stay
✅ Old themes keep working
✅ New light/dark fields are optional
✅ If not set, fallback to legacy field value

### "Do I need to migrate existing themes?"
❌ No migration needed
✅ Existing data works as-is
✅ New fields default to NULL (treated as legacy)

### "How do I validate colors?"
📝 See `ValidateHexColor()` in `BACKEND_HOW_TO_INTEGRATE.md`
📝 Must be: `#RRGGBB` or `#RRGGBBAA`
📝 Examples: `#1E293B`, `#F8FAFC00` (with alpha)

### "What about multi-tenant validation?"
✅ All endpoints must validate:
   - `X-Lpe-Organization-Id` header
   - `X-Lpe-Project-Id` header
   - JWT token
✅ Examples in handler implementations

---

## How to Use These Docs

### If you're **implementing from scratch**:
1. Read `BACKEND_IMPLEMENTATION_SUMMARY.md` (overview)
2. Follow `BACKEND_HOW_TO_INTEGRATE.md` (step-by-step)
3. Use provided Go code examples
4. Test with provided cURL commands

### If you're **enhancing existing code**:
1. Read the relevant detailed spec
2. Check database schema changes
3. Update models with new fields
4. Update handlers to accept/return new fields
5. Add color validation

### If you have **specific questions**:
1. Check the relevant spec file
2. Look for "Validations" or "Examples" section
3. See cURL testing examples at bottom

---

## File Map

```
BACKEND_* files organized by topic:

├─ README_FOR_BACKEND.md (this file)
│  └─ Start here! Overview and nav guide
│
├─ BACKEND_IMPLEMENTATION_SUMMARY.md
│  └─ Quick reference, checklists, time estimates
│
├─ BACKEND_HOW_TO_INTEGRATE.md
│  └─ Step-by-step implementation with code examples
│
├─ BACKEND_DISPLAY_SETTINGS_REQUIRED.md
│  └─ Display settings API specification
│
└─ BACKEND_THEME_CUSTOMIZATION_LIGHT_DARK.md
   └─ Theme light/dark mode specification
```

---

## Key Changes Summary

### Display Settings
| Aspect | Detail |
|--------|--------|
| Database | New table: `display_settings` |
| Table | 3 BOOLEAN columns (show_prep_time, show_rating, show_description) |
| Endpoints | 4 (GET, PUT, POST, POST /reset) |
| Model | New struct: `DisplaySettings` |
| Time | ~2 hours |

### Theme Light/Dark Mode
| Aspect | Detail |
|--------|--------|
| Database | 28 new columns in existing `theme_customizations` table |
| Columns | VARCHAR(7) for HEX colors |
| Fields | 14 primary, 10 semantic, 4 system (all light + dark) |
| Endpoints | Update existing 4 endpoints (GET, PUT, POST, POST /reset) |
| Model | Add 28 *string fields to existing struct |
| Time | ~4 hours |

---

## Success Criteria

When done, these should work:

```bash
# Display Settings
curl http://localhost:8080/project/settings/display
curl http://localhost:8080/project/settings/display -X PUT -d '{"show_prep_time": false}'

# Theme Colors
curl http://localhost:8080/project/settings/theme
curl http://localhost:8080/project/settings/theme -X PUT -d '{"primary_color_light": "#1E293B"}'
```

And the frontend will automatically:
- Show/hide stars and prep time based on display settings
- Apply light mode colors when user selects light mode
- Apply dark mode colors when user selects dark mode
- Save all color changes to backend

---

## Next Steps

1. **Today**: Read `BACKEND_IMPLEMENTATION_SUMMARY.md`
2. **Today**: Skim `BACKEND_HOW_TO_INTEGRATE.md` (understand scope)
3. **Tomorrow**: Start with database changes
4. **Tomorrow**: Implement Display Settings (simpler, 2 hours)
5. **Tomorrow/Day2**: Extend Theme endpoints (4 hours)
6. **Day2**: Test and integrate

---

## Need Help?

All docs have:
- ✅ SQL schema examples
- ✅ Go code examples
- ✅ cURL testing commands
- ✅ Validation logic
- ✅ Error handling examples

Pick a section and start implementing! 🚀

---

**Created**: 2024-11-08
**Frontend Ready Since**: 2024-11-08
**Backend Awaiting**: Implementation
