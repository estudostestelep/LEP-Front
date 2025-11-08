# Theming Guide - LEP System

Guia prático para desenvolvedores trabalharem com o sistema de temas do LEP System.

**Índice:**
- [Início Rápido](#início-rápido)
- [Arquitetura](#arquitetura)
- [Usando Cores](#usando-cores)
- [Usando Design Tokens](#usando-design-tokens)
- [Criar Novos Tokens](#criar-novos-tokens)
- [Customizar Temas](#customizar-temas)
- [Validação de Cores](#validação-de-cores)
- [Boas Práticas](#boas-práticas)

---

## Início Rápido

### 1. Usar Cores Padrão (Tailwind)

A forma mais simples é usar as classes do Tailwind que já estão conectadas ao sistema de tema:

```jsx
// Botão primário
<button className="bg-primary text-primary-foreground hover:opacity-90 transition-all">
  Clique aqui
</button>

// Card
<div className="bg-card text-card-foreground rounded-lg shadow-md p-6">
  Conteúdo
</div>

// Input
<input className="bg-card text-card-foreground border border-input rounded px-3 py-2" />
```

### 2. Usar Design Tokens em TypeScript

Para casos que precisam de valores CSS customizados:

```typescript
import { COLORS, SPACING, SHADOWS } from '@/tokens/design-tokens';

const style = {
  backgroundColor: COLORS.primary,
  padding: SPACING.md,
  boxShadow: SHADOWS.lg,
};

return <div style={style}>Conteúdo</div>;
```

### 3. Aplicar Temas Customizados

Se o backend retorna um tema customizado:

```typescript
import { useTheme } from '@/context/themeContext';

export function MyComponent() {
  const { currentTheme } = useTheme();

  return (
    <div style={{
      backgroundColor: currentTheme?.colors?.primary,
      color: currentTheme?.colors?.primaryForeground,
    }}>
      Conteúdo
    </div>
  );
}
```

---

## Arquitetura

O sistema de tema é composto por 3 camadas:

```
┌─────────────────────────────────────────┐
│  React Components (Tailwind classes)    │ ← Desenvolvedores usam aqui
├─────────────────────────────────────────┤
│  CSS Variables (HSL format)             │ ← Gerenciado por src/index.css
│  theme-provider, themeContext           │   e context/themeContext.tsx
├─────────────────────────────────────────┤
│  Browser DOM                            │ ← Aplicado automaticamente
└─────────────────────────────────────────┘
```

### Fluxo de Aplicação de Tema

```
App inicia
    ↓
themeContext carrega tema (API ou localStorage)
    ↓
generateThemeVariables() converte HEX → HSL
    ↓
applyThemeVariables() injeta no DOM
    ↓
CSS variables estão disponíveis
    ↓
Tailwind classes resolvem para variáveis
    ↓
Componentes renderizam com tema correto
```

---

## Usando Cores

### Opção 1: Tailwind Classes (Recomendado)

**Vantagens:**
- ✅ Mais simples
- ✅ Hot reload automático
- ✅ Autocomplete do IDE
- ✅ Funciona com dark mode automático

```jsx
// ✅ BOM - Use assim
<button className="bg-primary text-primary-foreground">
  Botão Primário
</button>

<div className="bg-card text-card-foreground border border-border">
  Card
</div>

<p className="text-muted-foreground">Texto secundário</p>
```

### Opção 2: Design Tokens (Para CSS-in-JS)

**Quando usar:**
- Precisa de valores em TypeScript
- Usando styled-components ou similar
- Precisa combinar múltiplos tokens

```typescript
import { COLORS, SPACING, SHADOWS } from '@/tokens/design-tokens';

const buttonStyle = {
  backgroundColor: COLORS.primary,
  color: COLORS.primaryForeground,
  padding: `${SPACING.sm} ${SPACING.md}`,
  borderRadius: '0.5rem',
  border: 'none',
  cursor: 'pointer',
  transition: 'all var(--transition-base)',
  boxShadow: SHADOWS.sm,
};
```

### Opção 3: CSS Variables Diretamente

**Quando usar:**
- Em CSS puro
- Em arquivos CSS/SCSS
- Precisa da string da variável CSS

```css
.button {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.button:hover {
  box-shadow: var(--shadow-lg);
}
```

### Opção 4: Tema Customizado (Do Backend)

**Quando usar:**
- Tema customizado por projeto
- Precisa aplicar brand colors dinâmicas

```typescript
import { useTheme } from '@/context/themeContext';

export function BrandedComponent() {
  const { currentTheme } = useTheme();

  return (
    <div style={{
      backgroundColor: currentTheme?.colors?.primary || COLORS.primary,
      color: currentTheme?.colors?.primaryForeground || COLORS.primaryForeground,
    }}>
      Conteúdo com branding dinâmico
    </div>
  );
}
```

---

## Usando Design Tokens

### Cores

```typescript
import { COLORS } from '@/tokens/design-tokens';

// Acessar cores
COLORS.primary;              // hsl(var(--primary))
COLORS.primaryForeground;    // hsl(var(--primary-foreground))
COLORS.background;           // hsl(var(--background))
COLORS.destructive;          // hsl(var(--destructive))
```

### Espaçamento

```typescript
import { SPACING } from '@/tokens/design-tokens';

// Espaçamento em forma de variável CSS
const style1 = {
  padding: SPACING.md,     // "var(--spacing-md)"
  gap: SPACING.sm,         // "var(--spacing-sm)"
};

// Espaçamento em forma de valor direto
import { SPACING_VALUES } from '@/tokens/design-tokens';
const style2 = {
  padding: SPACING_VALUES.md,  // "1.5rem"
  gap: SPACING_VALUES.sm,      // "1rem"
};
```

### Shadows

```typescript
import { SHADOWS } from '@/tokens/design-tokens';

const style = {
  boxShadow: SHADOWS.md,  // "0 4px 6px -1px rgb(0 0 0 / 0.1)..."
};
```

### Transitions

```typescript
import { TRANSITIONS } from '@/tokens/design-tokens';

const style = {
  transition: TRANSITIONS.base,  // "200ms ease-in-out"
};
```

### Tipografia

```typescript
import { FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT } from '@/tokens/design-tokens';

const style = {
  fontSize: FONT_SIZE.lg,        // "1.125rem"
  fontWeight: FONT_WEIGHT.bold,  // 700
  lineHeight: LINE_HEIGHT.snug,  // 1.375
};
```

---

## Criar Novos Tokens

Se precisar adicionar novos tokens (ex: nova cor, novo spacing), siga este processo:

### 1. Adicionar CSS Variable

Edite `src/index.css`:

```css
:root {
  /* ... cores existentes ... */
  --new-color: 220 60% 50%;  /* Adicionar aqui */
}

.dark {
  /* ... cores existentes ... */
  --new-color: 220 60% 60%;  /* Ou dark variant */
}
```

### 2. Adicionar ao Design Tokens

Edite `src/tokens/design-tokens.ts`:

```typescript
export const COLORS = {
  // ... cores existentes ...
  newColor: 'hsl(var(--new-color))',
} as const;
```

### 3. Usar em Componentes

```typescript
import { COLORS } from '@/tokens/design-tokens';

<div style={{ color: COLORS.newColor }}>
  Texto com nova cor
</div>
```

### 4. Documentar

Atualize `DESIGN_TOKENS.md` com a nova entrada na tabela.

---

## Customizar Temas

### Opção 1: Via UI Settings (Recomendado)

Os usuários podem customizar temas via `/settings`:

1. Ir em Settings → Tema e Cores
2. Clicar em "Personalizar"
3. Ajustar cores no color picker
4. Salvar

O sistema automaticamente:
- ✅ Valida contraste das cores
- ✅ Salva no banco de dados
- ✅ Persiste no localStorage
- ✅ Aplica ao DOM em tempo real

### Opção 2: Programaticamente

```typescript
import { applyTheme } from '@/lib/theme-generator';

// Aplicar tema customizado
applyTheme({
  primary: '#3B82F6',
  secondary: '#10B981',
  background: '#FFFFFF',
  card: '#F9FAFB',
  foreground: '#1F2937',
  // ... outras cores
});

// Salvar para persistência
import { saveThemeToStorage } from '@/lib/theme-generator';
saveThemeToStorage({
  primary: '#3B82F6',
  // ...
});
```

### Opção 3: Usar Presets

```typescript
import { getThemePreset, applyTheme } from '@/lib/theme-generator';

// Ocean theme
const oceanTheme = getThemePreset('ocean');
applyTheme(oceanTheme);

// Available presets:
// - 'professional'
// - 'ocean'
// - 'sunset'
// - 'forest'
// - 'midnight'
```

---

## Validação de Cores

### Verificar Contraste WCAG

```typescript
import { validateContrast } from '@/lib/color-utils';

const result = validateContrast('#1E293B', '#FFFFFF');
// {
//   level: 'AAA',
//   ratio: 18.7,
//   isAccessible: true,
//   message: "Excelente contraste! Ratio: 18.7:1 (WCAG AAA)"
// }

// Validar nível específico
const aaResult = validateContrast('#1E293B', '#FFFFFF', 'AA');
const aaaResult = validateContrast('#1E293B', '#FFFFFF', 'AAA');
```

### Validar HEX

```typescript
import { isValidHex, normalizeHex } from '@/lib/color-utils';

isValidHex('#1E293B');  // true
isValidHex('1E293B');   // true (sem #)
isValidHex('#FFF');     // true (formato curto)
isValidHex('invalid');  // false

normalizeHex('#FFF');        // '#FFFFFF'
normalizeHex('1E293B');      // '#1E293B'
normalizeHex('#1e293b');     // '#1E293B' (normalizado)
```

### Obter Informações de Cor

```typescript
import { getColorInfo } from '@/lib/color-utils';

const info = getColorInfo('#1E293B');
// {
//   hex: '#1E293B',
//   rgb: { r: 30, g: 41, b: 59 },
//   luminance: 0.0756,
//   brightness: 24.5,
//   isDark: true,
//   isLight: false
// }

// Usar para decisões automáticas
if (info.isDark) {
  setTextColor('white');
} else {
  setTextColor('black');
}
```

### Auto Text Color

```typescript
import { getAutoTextColor } from '@/lib/color-utils';

getAutoTextColor('#FFFFFF');  // '#000000' (preto em branco)
getAutoTextColor('#1E293B');  // '#FFFFFF' (branco em azul escuro)

// Usar em componentes
<div style={{
  backgroundColor: customColor,
  color: getAutoTextColor(customColor),
}}>
  Texto com cor automática
</div>
```

---

## Boas Práticas

### ✅ DO's (Faça)

1. **Use Tailwind classes quando possível**
   ```jsx
   // ✅ Bom
   <button className="bg-primary text-primary-foreground">
   ```

2. **Use design tokens para CSS-in-JS**
   ```typescript
   // ✅ Bom
   const style = { color: COLORS.primary };
   ```

3. **Valide cores customizadas**
   ```typescript
   // ✅ Bom
   const result = validateContrast(fg, bg);
   if (!result.isAccessible) {
     showWarning('Contraste insuficiente');
   }
   ```

4. **Use dark mode CSS variables**
   ```css
   /* ✅ Bom - funciona em ambos os modos */
   background-color: hsl(var(--primary));
   ```

5. **Respeite espaçamento scale**
   ```jsx
   // ✅ Bom
   <div style={{ padding: SPACING.md, gap: SPACING.sm }}>
   ```

### ❌ DON'Ts (Não Faça)

1. **NÃO use hardcoded colors**
   ```jsx
   // ❌ Ruim
   <button style={{ backgroundColor: '#1E293B' }}>
   ```

2. **NÃO misture sistemas de cores**
   ```jsx
   // ❌ Ruim - não funciona em dark mode
   <div className="bg-primary" style={{ color: '#000000' }}>
   ```

3. **NÃO ignore validação de contraste**
   ```typescript
   // ❌ Ruim - pode ser inacessível
   applyTheme({ primary: '#FFFFFF', primaryForeground: '#EEEEEE' });
   ```

4. **NÃO ignore espaçamento scale**
   ```jsx
   // ❌ Ruim - quebra consistência
   <div style={{ padding: '13px' }}>
   ```

5. **NÃO crie novos valores de cor globalmente**
   ```css
   /* ❌ Ruim - cria duplicação */
   :root {
     --custom-button-color: #3B82F6;
   }
   /* Use primary em vez disso */
   ```

### 📋 Checklist para Componentes Novos

- [ ] Usar apenas `bg-*`, `text-*`, `border-*` classes do Tailwind
- [ ] Verificar que funciona em light AND dark mode
- [ ] Validar contraste se usar cores customizadas
- [ ] Usar tokens para espaçamento (não valores aleatórios)
- [ ] Usar tokens para shadows (não values inline)
- [ ] Testar focus states e acessibilidade
- [ ] Documentar no DESIGN_TOKENS.md se adicionar novos tokens

---

## Troubleshooting

### Cores não aparecem em dark mode

**Problema:** Componente tem boa aparência em light mode, mas fica invisível em dark mode.

**Causa:** Usando valores hardcoded em vez de CSS variables.

**Solução:**
```jsx
// ❌ Errado
<button style={{ backgroundColor: '#1E293B', color: '#FFFFFF' }}>

// ✅ Correto
<button className="bg-primary text-primary-foreground">

// Ou
<button style={{
  backgroundColor: COLORS.primary,
  color: COLORS.primaryForeground,
}}>
```

### Tema customizado não persiste

**Problema:** Tema é aplicado, mas desaparece ao recarregar a página.

**Solução:** Garantir que `saveThemeToStorage()` foi chamado:

```typescript
import { applyTheme, saveThemeToStorage } from '@/lib/theme-generator';

applyTheme(newTheme);
saveThemeToStorage(newTheme);  // Adicione esta linha
```

### Contraste aviso em color picker

**Problema:** Color picker avisa que contraste é insuficiente.

**Solução:** Usar a função `generateDarkVariant()` para gerar par automaticamente:

```typescript
import { generateDarkVariant } from '@/lib/color-utils';

const lightColor = '#3B82F6';
const darkColor = generateDarkVariant(lightColor, 30);
// darkColor será uma versão mais escura com melhor contraste
```

---

## Recursos

- [Design Tokens Reference](./DESIGN_TOKENS.md)
- [Color Utilities API](/colors)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [WCAG Color Contrast](https://webaim.org/resources/contrastchecker/)
- [CSS HSL Format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl)
