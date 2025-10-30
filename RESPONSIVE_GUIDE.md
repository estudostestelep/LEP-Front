# Guia de Responsividade - LEP System

## 📐 Breakpoints e Comportamentos

Este guia visual mostra como o layout se adapta em diferentes tamanhos de tela.

---

## 📱 Mobile (<640px)

### Layout do Header:
```
┌─────────────────────────────────────┐
│ [☰] [LEP Logo] ... [🌙] [🏢] [👤] │
└─────────────────────────────────────┘
```

**Elementos:**
- `[☰]` - Hamburger menu (abre sidebar)
- `[LEP Logo]` - Logo completo "LEP System"
- `[🌙]` - Theme toggle (ícone apenas)
- `[🏢]` - Botão org/project (abre drawer)
- `[👤]` - Avatar compacto (abre UserMenu)

### Sidebar:
```
┌──────────────────┐
│                  │
│  [X] LEP System │
│  ────────────── │
│                  │
│  🏠 Home         │
│  📖 Menu         │
│  🛒 Pedidos      │
│  📅 Reservas     │
│  👥 Clientes     │
│  🪑 Mesas        │
│  📦 Produtos     │
│  🏷️  Tags         │
│  👤 Usuários     │
│  ⚙️  Config      │
│                  │
│  ────────────── │
│  LEP System v1.0│
│  Logado: Pablo  │
└──────────────────┘
```
- Overlay escuro por trás
- Fecha ao clicar em qualquer link
- Animação slide-in da esquerda

### OrgProjectDrawer (quando aberto):
```
┌──────────────────────────────────────┐
│ [←] 🏢 Selecionar Organização        │
│ Escolha uma organização              │
│ ──────────────────────────────────── │
│                                      │
│ 🔍 Buscar organização...             │
│                                      │
│ ┌────────────────────────────────┐  │
│ │ 🏢  Fattoria          [✓]      │  │
│ │     admin                      │  │
│ └────────────────────────────────┘  │
│                                      │
│ ┌────────────────────────────────┐  │
│ │ 🏢  Restaurante XYZ            │  │
│ │     manager                    │  │
│ └────────────────────────────────┘  │
│                                      │
│ ──────────────────────────────────── │
│ Contexto Atual:                      │
│ 🏢 Fattoria                          │
│ 📁 Projeto Principal                 │
└──────────────────────────────────────┘
```

### UserMenu Dropdown:
```
┌─────────────────────────────┐
│  👤 Pablo Silva             │
│     ✉️ pablo@email.com      │
│  ───────────────────────── │
│  🏢 Organização             │
│     Fattoria                │
│                             │
│  📁 Projeto                 │
│     Projeto Principal       │
│                             │
│  👤 Função                  │
│     Admin                   │
│  ───────────────────────── │
│  🚪 Sair                    │
└─────────────────────────────┘
```

---

## 📲 Tablet (640px - 1023px)

### Layout do Header:
```
┌──────────────────────────────────────────────────────┐
│ [☰] [LEP Logo] ... [🏢 Fattoria ▼] [🌙] [👤 Pablo ▼] │
└──────────────────────────────────────────────────────┘
```

**Mudanças em relação ao mobile:**
- Seletor org/project pode aparecer inline (opcional)
- UserMenu mostra nome do usuário
- Logo ainda visível (sidebar overlay)

### OrgProjectSelector (versão compacta):
```
┌───────────────────────────────────────┐
│ 🏢 Fattoria ▼ │ 📁 Projeto Prin... ▼ │
└───────────────────────────────────────┘
```
- Texto truncado com `max-w-[150px]`
- Tooltip ao hover mostra nome completo

---

## 💻 Desktop (≥1024px)

### Layout Completo:
```
┌────────────────┬──────────────────────────────────────────────────────────────┐
│                │  [🏢 Fattoria ▼] [📁 Projeto Principal ▼] [🌙] [👤 Pablo ▼] │
│  LEP System    │                                                              │
│  ─────────────│──────────────────────────────────────────────────────────────│
│                │                                                              │
│  🏠 Home       │                    CONTEÚDO PRINCIPAL                        │
│  📖 Menu       │                                                              │
│  🛒 Pedidos    │                                                              │
│  📅 Reservas   │                                                              │
│  ...           │                                                              │
│                │                                                              │
│  ─────────────│                                                              │
│  LEP v1.0      │                                                              │
│  Logado: Pablo │                                                              │
└────────────────┴──────────────────────────────────────────────────────────────┘
```

### Sidebar:
- Persistente (sempre visível)
- Toggleable via state
- Largura fixa: 256px (w-64)
- Sem overlay

### OrgProjectSelector Completo:
```
┌────────────────────────────────────────────────────┐
│ 🏢 Fattoria ▼  │  📁 Projeto Principal ▼          │
└────────────────────────────────────────────────────┘
```
- Largura adaptativa: `max-w-[180px] lg:max-w-[220px]`
- Tooltip com descrição completa
- Dropdown com role do usuário

### Dropdown do Select:
```
┌─────────────────────────────┐
│  Fattoria             [✓]  │
│  admin                      │
│  ─────────────────────────  │
│  Restaurante XYZ            │
│  manager                    │
└─────────────────────────────┘
```

---

## 🎨 Estados Visuais

### Hover States:

#### Botões:
```css
/* Normal */
background: transparent

/* Hover */
background: hsl(var(--accent))
transform: scale(1.05)  /* Theme toggle */
```

#### Links Sidebar:
```css
/* Normal */
color: hsl(var(--muted-foreground))

/* Hover */
color: hsl(var(--foreground))
background: hsl(var(--accent))
transform: translateX(4px)
```

#### OrgProjectSelector:
```css
/* Normal */
background: hsl(var(--muted) / 0.4)

/* Hover */
background: hsl(var(--muted) / 0.6)
```

### Focus States:
```css
/* Todos os elementos interativos */
outline: none
ring: 2px solid hsl(var(--ring))
ring-offset: 2px
```

### Active States:

#### Link Ativo (Sidebar):
```css
background: hsl(var(--primary))
color: hsl(var(--primary-foreground))
box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)
```

---

## 🎭 Animações e Transições

### Sidebar (Mobile):
```typescript
// Framer Motion
animate: {
  x: 0,                    // Aberto
  x: "-100%"               // Fechado
}
transition: {
  type: "spring",
  stiffness: 300,
  damping: 30
}
```

### Overlay:
```typescript
animate: {
  opacity: 1,              // Visível
  opacity: 0               // Invisível
}
```

### Drawer:
```typescript
// Sheet (Radix UI)
side: "right"
className: "w-full sm:max-w-md"
// Animação slide-in automática
```

### Dropdown Menu:
```typescript
// DropdownMenu (Radix UI)
align: "end"
sideOffset: 8
// Animação fade + slide automática
```

### Transições CSS:
```css
/* Padrão */
transition: all 200ms ease-in-out

/* Hover específico */
transition: transform 150ms ease-in-out, box-shadow 150ms ease-in-out
```

---

## 📏 Medidas Importantes

### Alturas:
- Header: `h-16` (64px) - fixo
- Sidebar: `h-full` (100vh)
- Buttons: `h-9` (36px) - padrão
- Avatar: `h-8 w-8` (32px) no header

### Larguras:
- Sidebar: `w-64` (256px)
- OrgProjectSelector (mobile): `max-w-[150px]`
- OrgProjectSelector (tablet): `max-w-[180px]`
- OrgProjectSelector (desktop): `max-w-[220px]`
- Drawer: `w-full sm:max-w-md` (100% mobile, 448px tablet+)

### Espaçamentos:
- Header padding: `px-4 lg:px-6` (16px/24px)
- Gap entre elementos: `gap-3` (12px) padrão
- Sidebar padding: `px-3` (12px)
- Card padding: `p-4` (16px)

### Touch Targets (Mobile):
- Mínimo recomendado: 44px x 44px
- Botões: `h-9 w-9` (36px) + padding visual
- Cards drawer: `p-4` = ~52px altura total ✅

---

## 🔍 Testando Responsividade

### Chrome DevTools:
1. Abrir DevTools (F12)
2. Clicar no ícone de device toggle (Ctrl+Shift+M)
3. Testar nos seguintes tamanhos:

#### Presets Recomendados:
- **iPhone SE**: 375 x 667 (mobile pequeno)
- **iPhone 12 Pro**: 390 x 844 (mobile moderno)
- **iPad Air**: 820 x 1180 (tablet)
- **iPad Pro**: 1024 x 1366 (tablet grande)
- **Laptop**: 1280 x 720 (desktop pequeno)
- **Desktop**: 1920 x 1080 (desktop padrão)

### Checklist de Testes:
- [ ] Header responsivo em todos os breakpoints
- [ ] Sidebar abre/fecha corretamente
- [ ] Drawer mobile funciona (<768px)
- [ ] Selector desktop aparece (≥768px)
- [ ] UserMenu compacto/completo
- [ ] Theme toggle funciona
- [ ] Navegação por Tab (keyboard)
- [ ] Touch targets adequados (mobile)
- [ ] Texto não quebra layout
- [ ] Scrollbar customizada funciona
- [ ] Animações suaves
- [ ] Sem overflow horizontal

---

## 🎯 Hierarquia de Informações

### Mobile (Prioridade):
1. 🥇 Navegação (hamburger)
2. 🥈 Logo/Branding
3. 🥉 Theme toggle
4. 4️⃣ Org/Project (drawer)
5. 5️⃣ User (avatar apenas)

### Desktop (Prioridade):
1. 🥇 Logo (sidebar)
2. 🥈 Org/Project selector
3. 🥉 User info completa
4. 4️⃣ Theme toggle
5. 5️⃣ Navegação (sidebar sempre visível)

---

## 💡 Dicas de Uso

### Para Desenvolvedores:
- Use classes Tailwind responsivas: `sm:`, `md:`, `lg:`
- Prefira `gap-` ao invés de `space-x-` para flexbox
- Use `min-w-0` para prevenir overflow de flex items
- Teste em resoluções reais, não apenas simuladas

### Para Designers:
- Touch targets mobile: mínimo 44x44px
- Contraste mínimo: 4.5:1 (WCAG AA)
- Tooltips devem ter delay de 300ms+
- Animações: 200-300ms (não muito rápidas)

---

**Última atualização:** 28/10/2025
**Versão do Sistema:** LEP System v1.0
