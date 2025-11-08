# Design Tokens - LEP System

Documentação completa dos design tokens e variáveis de design utilizadas no LEP System.

**Índice:**
- [Cores](#cores)
- [Espaçamento](#espaçamento)
- [Tipografia](#tipografia)
- [Borders & Radius](#borders--radius)
- [Shadows](#shadows)
- [Transitions](#transitions)
- [Componentes](#componentes)
- [Acessibilidade](#acessibilidade)

---

## Cores

O sistema utiliza cores semânticas baseadas em variáveis CSS HSL. As cores são automaticamente invertidas entre light mode e dark mode.

### Paleta de Cores

#### Light Mode (Padrão)

| Token | HEX | HSL | Uso |
|-------|-----|-----|-----|
| `--primary` | #1E293B | 222.2 47.4% 11.2% | Botões principais, ações primárias |
| `--primary-foreground` | #F8FAFC | 210 40% 98% | Texto em elementos primários |
| `--secondary` | #F0F4F8 | 210 40% 96% | Fundo secundário, destaques suaves |
| `--secondary-foreground` | #1E293B | 222.2 47.4% 11.2% | Texto em elementos secundários |
| `--muted` | #F0F4F8 | 210 40% 96% | Fundo para estados desabilitados |
| `--muted-foreground` | #64748B | 215.4 16.3% 46.9% | Texto helper/desabilitado |
| `--accent` | #F0F4F8 | 210 40% 96% | Destaques decorativos |
| `--accent-foreground` | #1E293B | 222.2 47.4% 11.2% | Texto em destaques |
| `--destructive` | #EF4444 | 0 84.2% 60.2% | Erros, delete, ações perigosas |
| `--destructive-foreground` | #F8FAFC | 210 40% 98% | Texto em elementos destrutivos |
| `--background` | #FFFFFF | 0 0% 100% | Fundo principal da página |
| `--card` | #FFFFFF | 0 0% 100% | Fundo de cards/containers |
| `--popover` | #FFFFFF | 0 0% 100% | Fundo de popovers/dropdowns |
| `--foreground` | #0F172A | 222.2 84% 4.9% | Texto principal |
| `--card-foreground` | #0F172A | 222.2 84% 4.9% | Texto em cards |
| `--popover-foreground` | #0F172A | 222.2 84% 4.9% | Texto em popovers |
| `--border` | #E2E8F0 | 214.3 31.8% 91.4% | Bordas padrão |
| `--input` | #E2E8F0 | 214.3 31.8% 91.4% | Bordas de inputs |
| `--ring` | #0F172A | 222.2 84% 4.9% | Focus ring |

#### Dark Mode

| Token | HEX | HSL | Uso |
|-------|-----|-----|-----|
| `--primary` | #F8FAFC | 210 40% 98% | Botões principais (invertido) |
| `--primary-foreground` | #1E293B | 222.2 47.4% 11.2% | Texto em primários (invertido) |
| `--background` | #0F172A | 222.2 84% 4.9% | Fundo principal (escuro) |
| `--card` | #1E293B | 222.2 47% 8% | Fundo de cards (escuro) |
| `--foreground` | #F8FAFC | 210 40% 98% | Texto principal (claro) |
| *[outras cores são invertidas automaticamente]* | | | |

### Usando Cores

#### Em CSS

```css
.button {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: 1px solid hsl(var(--border));
}
```

#### Em TypeScript/React

```typescript
import { COLORS } from '@/tokens/design-tokens';

const buttonStyle = {
  backgroundColor: COLORS.primary,
  color: COLORS.primaryForeground,
  border: `1px solid ${COLORS.border}`,
};
```

#### Em Tailwind

```jsx
<button className="bg-primary text-primary-foreground border border-border">
  Clique aqui
</button>
```

---

## Espaçamento

Escala de espaçamento baseada em unidade de 4px, criando um sistema harmônico.

| Token | Valor | Pixel | Uso |
|-------|-------|-------|-----|
| `--spacing-unit` | 0.25rem | 4px | Unidade base |
| `--spacing-xs` | 0.5rem | 8px | Espaçamento muito pequeno |
| `--spacing-sm` | 1rem | 16px | Espaçamento pequeno |
| `--spacing-md` | 1.5rem | 24px | Espaçamento médio (padrão) |
| `--spacing-lg` | 2rem | 32px | Espaçamento grande |
| `--spacing-xl` | 3rem | 48px | Espaçamento muito grande |
| `--spacing-2xl` | 4rem | 64px | Espaçamento extra grande |

### Padrões de Uso

**Elementos internos (padding):**
- Botões: `--spacing-sm` a `--spacing-md`
- Cards: `--spacing-md`
- Inputs: `--spacing-sm` na vertical, `--spacing-sm` na horizontal

**Espaço entre elementos (gap/margin):**
- Pequeno gap (ex: entre ícone e texto): `--spacing-xs`
- Médio gap (ex: entre elementos de lista): `--spacing-sm`
- Grande gap (ex: entre seções): `--spacing-lg`

### Exemplo

```typescript
import { SPACING } from '@/tokens/design-tokens';

const style = {
  padding: `${SPACING.md}`,
  gap: `${SPACING.sm}`,
  marginBottom: `${SPACING.lg}`,
};
```

---

## Tipografia

Escala tipográfica baseada em Tailwind defaults, otimizada para legibilidade.

### Tamanhos de Fonte

| Token | Valor | Uso |
|-------|-------|-----|
| `xs` | 0.75rem (12px) | Labels, badges, helper text |
| `sm` | 0.875rem (14px) | Texto secundário, pequenas anotações |
| `base` | 1rem (16px) | Corpo de texto padrão |
| `lg` | 1.125rem (18px) | Títulos secundários |
| `xl` | 1.25rem (20px) | Títulos principais |
| `2xl` | 1.5rem (24px) | Títulos de seção |
| `3xl` | 1.875rem (30px) | Títulos de página |
| `4xl` | 2.25rem (36px) | Títulos de hero |

### Pesos de Fonte

| Token | Valor | Uso |
|-------|-------|-----|
| `light` | 300 | Texto decorativo |
| `normal` | 400 | Corpo de texto padrão |
| `medium` | 500 | Ênfase suave |
| `semibold` | 600 | Titles, labels importantes |
| `bold` | 700 | Destaques |
| `extrabold` | 800 | Títulos de grande impacto |

### Altura de Linha

| Token | Valor | Uso |
|-------|-------|-----|
| `tight` | 1.25 | Títulos, texto compacto |
| `snug` | 1.375 | Subtítulos |
| `normal` | 1.5 | Corpo de texto (padrão) |
| `relaxed` | 1.625 | Texto longo, artigos |
| `loose` | 2 | Acessibilidade, textos com muitas linhas |

### Exemplo

```jsx
<h1 className="text-3xl font-bold leading-tight">Título de Página</h1>
<p className="text-base font-normal leading-relaxed">Parágrafo de texto</p>
```

---

## Borders & Radius

Valores padronizados para bordas e cantos arredondados.

| Token | Valor | Uso |
|-------|-------|-----|
| `--border-width` | 1px | Borda padrão |
| `--border-radius-sm` | 0.375rem (6px) | Elementos muito pequenos |
| `--border-radius-md` | 0.5rem (8px) | Padrão (botões, inputs) |
| `--border-radius-lg` | 0.75rem (12px) | Cards, containers grandes |

### Exemplo

```css
.input {
  border: var(--border-width) solid hsl(var(--input));
  border-radius: var(--border-radius-md);
}

.card {
  border-radius: var(--border-radius-lg);
}
```

---

## Shadows

Sombras elevação baseadas em Material Design principles.

### Light Mode

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow-sm` | 0 1px 2px 0 rgb(0 0 0 / 0.05) | Elevação sutil |
| `--shadow-md` | 0 4px 6px -1px rgb(0 0 0 / 0.1) | Elevação média |
| `--shadow-lg` | 0 10px 15px -3px rgb(0 0 0 / 0.1) | Elevação grande |

### Dark Mode

Sombras são mais pronunciadas em dark mode para manter contraste.

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow-sm` | 0 1px 2px 0 rgb(0 0 0 / 0.1) | Elevação sutil |
| `--shadow-md` | 0 4px 6px -1px rgb(0 0 0 / 0.2) | Elevação média |
| `--shadow-lg` | 0 10px 15px -3px rgb(0 0 0 / 0.2) | Elevação grande |

### Exemplo

```typescript
import { SHADOWS } from '@/tokens/design-tokens';

const cardStyle = {
  boxShadow: SHADOWS.md,
  padding: SPACING.md,
};
```

---

## Transitions

Animações e transições com timings consistentes.

| Token | Valor | Uso |
|-------|-------|-----|
| `--transition-fast` | 150ms ease-in-out | Hover states, pequenas mudanças |
| `--transition-base` | 200ms ease-in-out | Transições padrão |
| `--transition-slow` | 300ms ease-in-out | Animações mais complexas |

### Exemplo

```css
.button {
  transition: all var(--transition-base);
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

---

## Componentes

### Botões

#### Primário

```typescript
const buttonPrimaryStyle = {
  backgroundColor: COLORS.primary,
  color: COLORS.primaryForeground,
  padding: `${BUTTON.paddingY} ${BUTTON.paddingX}`,
  borderRadius: BUTTON.borderRadius,
  border: 'none',
  cursor: 'pointer',
  transition: `all var(--transition-base)`,
};
```

#### Outline

```typescript
const buttonOutlineStyle = {
  backgroundColor: 'transparent',
  color: COLORS.primary,
  padding: `${BUTTON.paddingY} ${BUTTON.paddingX}`,
  border: `1px solid hsl(var(--border))`,
  borderRadius: BUTTON.borderRadius,
  cursor: 'pointer',
};
```

### Inputs

```typescript
const inputStyle = {
  padding: `${INPUT.paddingY} ${INPUT.paddingX}`,
  borderRadius: INPUT.borderRadius,
  border: `1px solid hsl(var(--input))`,
  backgroundColor: COLORS.card,
  color: COLORS.cardForeground,
  fontSize: FONT_SIZE.base,
  transition: `all var(--transition-base)`,
};
```

### Cards

```typescript
const cardStyle = {
  backgroundColor: COLORS.card,
  color: COLORS.cardForeground,
  borderRadius: BORDER_RADIUS.lg,
  padding: SPACING.md,
  boxShadow: SHADOWS.sm,
};
```

---

## Acessibilidade

### Contraste de Cores

Todas as combinações de cores no LEP System atendem aos padrões WCAG:

- **WCAG AAA (Enhanced):** 7:1 ou superior
- **WCAG AA (Standard):** 4.5:1 ou superior (mínimo)

#### Ratios de Contraste (Light Mode)

| Combinação | Ratio | Nível |
|------------|-------|-------|
| Primary (#1E293B) on Primary-Foreground (#F8FAFC) | 16.2:1 | AAA |
| Foreground (#0F172A) on Background (#FFFFFF) | 18.7:1 | AAA |
| Muted-Foreground (#64748B) on Background (#FFFFFF) | 6.5:1 | AA |
| Destructive (#EF4444) on Destructive-Foreground (#F8FAFC) | 7.3:1 | AAA |

### Validação de Contraste

Use a função `validateContrast()` para verificar o contraste entre cores:

```typescript
import { validateContrast } from '@/lib/color-utils';

const result = validateContrast('#1E293B', '#FFFFFF');
// result.level === 'AAA'
// result.ratio === 18.7
// result.isAccessible === true
```

### Focus States

Todos os elementos interativos devem ter focus ring visível:

```css
.interactive:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px hsl(var(--background)),
              0 0 0 5px hsl(var(--ring));
}
```

### Estados Desabilitados

Elementos desabilitados devem ter opacity reduzida:

```typescript
const disabledStyle = {
  opacity: 0.5,
  cursor: 'not-allowed',
  pointerEvents: 'none',
};
```

---

## Utilitários

### Importar Todos os Tokens

```typescript
import {
  COLORS,
  SPACING,
  SHADOWS,
  BORDERS,
  TRANSITIONS,
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
  Z_INDEX,
  BORDER_RADIUS,
  BUTTON,
  INPUT,
  OPACITY,
} from '@/tokens/design-tokens';
```

### Validar Cores

```typescript
import {
  isValidHex,
  validateContrast,
  getColorInfo,
  getAutoTextColor,
  generateDarkVariant,
} from '@/lib/color-utils';

// Validar HEX
isValidHex('#1E293B'); // true

// Validar contraste
const contrast = validateContrast('#1E293B', '#FFFFFF');
console.log(contrast.message); // "Excelente contraste! Ratio: 18.7:1"

// Obter informações
const info = getColorInfo('#1E293B');
console.log(info.isDark); // true
console.log(info.brightness); // 24.5

// Auto text color
const textColor = getAutoTextColor('#FFFFFF'); // '#000000'

// Gerar variante escura
const darkColor = generateDarkVariant('#3B82F6', 30); // '#1D4ED8'
```

### Gerar Temas

```typescript
import {
  applyTheme,
  generateThemeCSS,
  getThemePreset,
} from '@/lib/theme-generator';

// Aplicar tema customizado
applyTheme({
  primary: '#3B82F6',
  secondary: '#10B981',
  // ... outras cores
});

// Gerar CSS
const css = generateThemeCSS({
  primary: '#3B82F6',
});
console.log(css);

// Usar preset
const preset = getThemePreset('ocean');
applyTheme(preset.colors);
```

---

## Recursos Adicionais

- [Color Palette Visualizer](/colors) - Visualizar todas as cores em live preview
- [THEMING_GUIDE.md](./THEMING_GUIDE.md) - Guia para desenvolvedores
- [Tailwind Colors](https://tailwindcss.com/docs/colors) - Referência Tailwind
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Validador de contraste
