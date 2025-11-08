# 🎨 Theme System Migration - Pages Pending Update

## Overview
After implementing the extended theme customization system, several pages still use hardcoded colors instead of theme CSS variables. This document tracks the migration to ensure visual consistency across the application.

## Status: IN PROGRESS ✅

**Completed:** 1/9 pages migrated

### Completed Pages
- ✅ [src/pages/admin-menu/categories.tsx](src/pages/admin-menu/categories.tsx) - **Done**
  - Replaced green/gray colors with Button component using theme
  - Updated text colors to use `text-muted-foreground` and `text-foreground`
  - Updated error alert to use `destructive` semantic color

---

## Pages Pending Migration

### 1. [src/pages/admin-menu/index.tsx](src/pages/admin-menu/index.tsx)
**Priority:** HIGH - Main menu admin page
**Hardcoded Colors:**
```tsx
// Status buttons - bg-green-100, text-green-700, bg-gray-100, text-gray-500
// Error alert - bg-red-50, border-red-200, text-red-700
// Checkbox label - text-gray-700
// Loader - text-gray-400
```
**Fix Strategy:**
- Replace status button colors with Button component variants
- Replace error alert with destructive semantic colors
- Update text-gray-* to text-muted-foreground / text-foreground

---

### 2. [src/pages/admin-menu/category-products.tsx](src/pages/admin-menu/category-products.tsx)
**Priority:** HIGH - Product management
**Hardcoded Colors:**
```tsx
// Status buttons - bg-green-100, text-green-700, bg-gray-100, text-gray-500
// Product description - text-gray-600
// Empty state - text-gray-500
// Price badge - bg-green-600 text-white
// Product extras - text-gray-500
// Loader - text-gray-400
```
**Fix Strategy:**
- Apply same fixes as categories.tsx
- For price badge: use `success_color` or create Badge component variant

---

### 3. [src/pages/orders/list.tsx](src/pages/orders/list.tsx)
**Priority:** HIGH - Order status colors (semantic)
**Hardcoded Colors:**
```tsx
case "pending": "bg-yellow-100 text-yellow-800"     // warning color
case "preparing": "bg-blue-100 text-blue-800"      // info color
case "ready": "bg-green-100 text-green-800"        // success color
case "delivered": "bg-gray-100 text-gray-800"      // default/muted
case "cancelled": "bg-red-100 text-red-800"        // destructive color
```
**Fix Strategy:**
- Create semantic color mapping to theme colors
- Use CSS variables for status badge backgrounds
- Consider creating OrderStatusBadge component

---

### 4. [src/pages/reservations/calendar.tsx](src/pages/reservations/calendar.tsx)
**Priority:** HIGH - Reservation status colors
**Hardcoded Colors:**
```tsx
case "confirmed": "bg-green-100 text-green-800"
case "cancelled": "bg-red-100 text-red-800"
case "completed": "bg-blue-100 text-blue-800"
```
**Fix Strategy:**
- Map to semantic colors (success, destructive, primary)
- Create ReservationStatusBadge component if needed

---

### 5. [src/pages/customers/form.tsx](src/pages/customers/form.tsx)
**Priority:** MEDIUM - Form buttons
**Hardcoded Colors:**
```tsx
// Save button - bg-blue-500 hover:bg-blue-600
// Cancel button - bg-gray-400 hover:bg-gray-500
```
**Fix Strategy:**
- Replace with Button component (variant="default" and variant="outline")

---

### 6. [src/pages/general-stats/general-stats.tsx](src/pages/general-stats/general-stats.tsx)
**Priority:** MEDIUM - Stats card backgrounds
**Hardcoded Colors:**
```tsx
// Blue icon background - bg-blue-500/10
// Green icon background - bg-green-500/10
```
**Fix Strategy:**
- Use primary and success theme colors with opacity
- Consider creating StatCard component variant

---

### 7. [src/pages/login/login.tsx](src/pages/login/login.tsx)
**Priority:** MEDIUM - Success message
**Hardcoded Colors:**
```tsx
// Success box - bg-green-50 border-green-200
```
**Fix Strategy:**
- Use success_color with opacity: `bg-success/10 border-success/20`
- Update text color to match success semantic

---

### 8. [src/pages/organizations/create.tsx](src/pages/organizations/create.tsx)
**Priority:** LOW - Info boxes
**Hardcoded Colors:**
```tsx
// Info box 1 - bg-green-50 border-green-200
// Info box 2 - bg-blue-50 border-blue-200
```
**Fix Strategy:**
- Use semantic colors (success, primary) with opacity
- Create InfoBox component if reused elsewhere

---

### 9. [src/components/...] (Various components)
**Priority:** LOW - Component library
**Potential locations:**
- src/components/ui/* - shadcn components (skip - external)
- src/components/ColorPalette.tsx - Already uses theme ✅
- src/components/ComponentShowcase.tsx - Already uses theme ✅
- src/components/ThemeCustomizationTab.tsx - Already uses theme ✅
- src/components/ThemeCustomizationModal.tsx - Already uses theme ✅

---

## Migration Template

When updating a page, follow this pattern:

```tsx
// BEFORE - Hardcoded colors
<button className="bg-green-100 text-green-700 hover:bg-green-200">
  Active
</button>

// AFTER - Theme colors
<Button variant="default">Active</Button>
// or
<button className="bg-success/10 text-success hover:bg-success/20">
  Active
</button>
```

### Color Mapping Reference

| Intent | Hardcoded | Theme Variable | Semantic |
|--------|-----------|-----------------|----------|
| Success | bg-green-100 | bg-success/10 | success_color |
| Warning | bg-yellow-100 | bg-warning/10 | warning_color |
| Error | bg-red-100 | bg-destructive/10 | destructive_color |
| Info | bg-blue-100 | bg-primary/10 | primary_color |
| Muted | bg-gray-100 | bg-muted | muted |
| Text (Primary) | text-gray-800 | text-foreground | foreground |
| Text (Secondary) | text-gray-600 | text-muted-foreground | muted-foreground |

---

## Implementation Priority

### Phase 1 (NEXT - Critical User Experience)
1. ✅ categories.tsx - DONE
2. admin-menu/index.tsx - Main menu
3. category-products.tsx - Product management
4. orders/list.tsx - Order status

### Phase 2 (Important - User-facing)
5. reservations/calendar.tsx - Reservation status
6. customers/form.tsx - Customer forms
7. general-stats/general-stats.tsx - Dashboard

### Phase 3 (Nice-to-have)
8. login/login.tsx - Login page
9. organizations/create.tsx - Setup pages

---

## Testing Checklist

After each migration:
- [ ] Build succeeds without errors: `npm run build`
- [ ] Dev server runs: `npm run dev`
- [ ] Light mode colors render correctly
- [ ] Dark mode colors render correctly
- [ ] Page-specific theme changes apply (if any)
- [ ] No visual regressions
- [ ] Button/text contrast ratios remain accessible

---

## Notes

- All theme colors are CSS variables defined in `src/index.css`
- Semantic colors are available as `--destructive`, `--success`, `--warning`, etc.
- Use Tailwind's arbitrary value support: `bg-[var(--success)/10]`
- For opacity: `bg-color/10` = 10% opacity, `bg-color/20` = 20% opacity
- Prefer Shadcn Button component for interactive elements
- File last updated: 2025-11-08
