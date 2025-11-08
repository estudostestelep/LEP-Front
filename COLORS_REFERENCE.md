# 🎨 Guia de Cores Tailwind LEP System

## Visualizador Online
Você pode copiar qualquer valor HEX e colar em: https://www.color-hex.com/

---

## 📱 Light Mode (Padrão)

### Backgrounds
| Classe | Cor | Hex | Uso |
|--------|-----|-----|-----|
| `bg-background` | Branco puro | `#FFFFFF` | Fundo principal da página |
| `bg-card` | Branco puro | `#FFFFFF` | Fundo de cards/containers |
| `bg-popover` | Branco puro | `#FFFFFF` | Fundo de popovers/dropdowns |
| `bg-muted` | Cinza muito claro | `#F0F4F8` | Fundo para elementos desabilitados |
| `bg-accent` | Cinza muito claro | `#F0F4F8` | Fundo para destaques suaves |

### Text / Foreground
| Classe | Cor | Hex | Uso |
|--------|-----|-----|-----|
| `text-foreground` | Azul muito escuro | `#0F172A` | Texto principal |
| `text-card-foreground` | Azul muito escuro | `#0F172A` | Texto em cards |
| `text-muted-foreground` | Cinza médio | `#64748B` | Texto secundário/helper |

### Primary
| Classe | Cor | Hex | Uso |
|--------|-----|-----|-----|
| `bg-primary` | Azul escuro | `#1E293B` | Botões principais, tabs ativos |
| `text-primary-foreground` | Branco quase puro | `#F8FAFC` | Texto em botões primários |

### Borders & Input
| Classe | Cor | Hex | Uso |
|--------|-----|-----|-----|
| `border-border` | Cinza claro | `#E2E8F0` | Bordas de elementos |
| `border-input` | Cinza claro | `#E2E8F0` | Bordas de inputs |
| `ring` | Azul muito escuro | `#0F172A` | Focus ring |

### Status
| Classe | Cor | Hex | Uso |
|--------|-----|-----|-----|
| `bg-destructive` | Vermelho | `#EF4444` | Erros, delete |
| `text-destructive` | Vermelho | `#EF4444` | Texto de erro |

---

## 🌙 Dark Mode

### Backgrounds
| Classe | Cor | Hex | Uso |
|--------|-----|-----|-----|
| `bg-background` | Azul muito escuro | `#0F172A` | Fundo principal da página |
| `bg-card` | Azul escuro | `#1E293B` | Fundo de cards/containers |
| `bg-muted` | Cinza azulado escuro | `#334155` | Fundo para elementos desabilitados |
| `bg-accent` | Cinza azulado | `#475569` | Fundo para destaques |

### Text / Foreground
| Classe | Cor | Hex | Uso |
|--------|-----|-----|-----|
| `text-foreground` | Branco quase puro | `#F8FAFC` | Texto principal |
| `text-card-foreground` | Branco quase puro | `#F8FAFC` | Texto em cards |
| `text-muted-foreground` | Cinza azulado médio | `#94A3B8` | Texto secundário |

### Primary
| Classe | Cor | Hex | Uso |
|--------|-----|-----|-----|
| `bg-primary` | Branco quase puro | `#F8FAFC` | Botões principais |
| `text-primary-foreground` | Azul escuro | `#1E293B` | Texto em botões |

---

## 🎯 Exemplos de Combinações

### ✅ Contraste Alto (Recomendado)
```jsx
// Botão primário
className="bg-primary text-primary-foreground"
// Light: Azul escuro com branco
// Dark: Branco com azul escuro

// Texto normal
className="text-foreground"
// Light: Azul muito escuro
// Dark: Branco quase puro

// Texto secondary
className="text-muted-foreground"
// Light: Cinza médio (aceitável)
// Dark: Cinza azulado médio (bom contraste)
```

### ❌ Evitar (Baixo Contraste)
```jsx
// ❌ Não faça isto:
className="bg-background text-foreground"
// Light: Branco com azul escuro (OK, mas branco em branco é problema)
// Solução: Use bg-card ou bg-primary

className="bg-muted text-muted-foreground"
// Light: Cinza claro com cinza médio (baixo contraste)
// Solução: Use text-foreground em vez de muted-foreground
```

---

## 🔍 Como Usar Esta Referência

### No VSCode com Color Highlight
1. Instale: `naumovs.color-highlight`
2. Abra qualquer arquivo CSS/TSX
3. Veja as bolinhas coloridas ao lado das cores

### No VSCode com Tailwind CSS IntelliSense
1. Instale: `bradlc.vscode-tailwindcss`
2. Passe o mouse sobre classes como `bg-primary`
3. Veja o preview da cor

### Verificar Contraste
- Cole qualquer HEX em: https://www.color-hex.com/
- Ou use: https://webaim.org/resources/contrastchecker/

---

## 📝 Notas Importantes

### Quando usar cada cor:

| Situação | Use |
|----------|-----|
| Fundo principal da página | `bg-background` |
| Fundo de cards | `bg-card` com `text-card-foreground` |
| Botões ativos/destaque | `bg-primary` com `text-primary-foreground` |
| Texto principal | `text-foreground` |
| Texto helper/secundário | `text-muted-foreground` (com cuidado) |
| Bordas | `border-border` |
| Inputs | `bg-card` com `border-input` e `text-card-foreground` |
| Erros | `bg-destructive` com `text-destructive-foreground` |

---

## 🚀 Checklist de Contraste

Antes de commitar código, verifique:

- [ ] Texto visível no light mode (contraste ≥ 4.5:1)
- [ ] Texto visível no dark mode (contraste ≥ 4.5:1)
- [ ] Inputs têm `text-card-foreground` (não `text-foreground`)
- [ ] Botões ativos usam `bg-primary` (não `bg-background`)
- [ ] Muted text apenas para helper/placeholder (não para conteúdo importante)
