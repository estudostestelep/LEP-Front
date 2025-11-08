# 💰 Customização de Cor do Preço

## 📍 Localização

A cor do preço no Menu Público agora usa a cor **"success"** (sucesso) do sistema de tema.

**Localização do código:**
- `src/pages/public/menu.tsx` - Linhas 455 e 543

```tsx
<span className="text-success font-bold">
  R$ {product.price_normal.toFixed(2)}
</span>
```

## 🎨 Como Mudar a Cor do Preço

### Opção 1: Através das Configurações de Tema (Recomendado)

1. **Acesse as Configurações**
   - Vá para Configurações > Tema e Cores

2. **Localize "Cor de Sucesso"**
   - Procure pelo campo "Cor de Sucesso" na seção "Cores Semânticas"
   - Esta é a cor usada para o preço dos produtos

3. **Edite a Cor**
   - Clique em "Editar Cores" para abrir o modal
   - Encontre "Cor de Sucesso" e mude o valor HEX
   - Exemplo: `#10B981` (verde) → `#FF6B35` (laranja)

4. **Salve e Veja a Mudança**
   - Clique em Salvar
   - A cor do preço no menu será atualizada automaticamente

### Opção 2: Cores Semânticas Disponíveis

Você pode usar qualquer cor semântica para o preço. Para mudar, edite `src/pages/public/menu.tsx`:

| Semântica | Classe Tailwind | Cor Padrão | Quando Usar |
|-----------|-----------------|-----------|-----------|
| **Success** | `text-success` | #10B981 (verde) | Preços, valores positivos |
| **Warning** | `text-warning` | #F59E0B (amarelo) | Preços em promoção |
| **Primary** | `text-primary` | #1E293B (azul) | Preços destacados |
| **Destructive** | `text-destructive` | #EF4444 (vermelho) | Preços premium |

**Para mudar, edite as linhas:**
```tsx
// Linha 455 - Listagem de produtos
<span className="text-warning font-bold">

// Linha 543 - Modal de detalhes
<div className="text-3xl font-bold text-warning">
```

### Opção 3: Cor Customizada Direta

Se quiser uma cor específica não configurável no tema:

```tsx
// Opção 1: Cor HEX direta
<span className="font-bold" style={{ color: '#FF6B35' }}>

// Opção 2: Cor RGB
<span className="font-bold" style={{ color: 'rgb(255, 107, 53)' }}>

// Opção 3: Cor nomeada CSS
<span className="font-bold" style={{ color: 'orangered' }}>
```

## 🔄 Propagação de Mudanças

Quando você muda a cor de "Sucesso" nas configurações:

1. **Componentes que usam `text-success`:**
   - Preço do produto (Menu Público)
   - Badge de sucesso em confirmações
   - Ícones de status positivo

2. **Componentes que usam `bg-success/10`:**
   - Fundo de caixas de sucesso
   - Alertas positivos
   - Confirmações

**Benefício:** Mudando uma cor, você atualiza toda a aplicação automaticamente!

## 📊 Configuração de Tema Atual

### Cores Semânticas Atuais

```json
{
  "success_color": "#10B981",      // Verde - Preços
  "warning_color": "#F59E0B",      // Amarelo - Avisos
  "destructive_color": "#EF4444",  // Vermelho - Erros
  "border_color": "#E5E7EB"        // Cinza - Bordas
}
```

### Dicas de Cores

- **Verde (#10B981)**: Bom para preços normais (padrão)
- **Amarelo (#F59E0B)**: Bom para promoções/descontos
- **Azul (#3B82F6)**: Bom para preços premium
- **Laranja (#FF6B35)**: Bom para promoções quentes
- **Rosa (#EC4899)**: Bom para ofertas especiais

## 🎯 Próximos Passos

Para garantir consistência visual:

1. ✅ Preço agora usa `text-success` (feito!)
2. ✅ Estrelas usam `fill-warning` (feito!)
3. ✅ Prep time usa `text-muted-foreground` (feito!)

Se desejar cores diferentes para cada elemento:
- Preço: mude para `text-primary`, `text-warning`, etc
- Estrelas: mude para `fill-success`, `fill-primary`, etc
- Prep time: mude para `text-foreground`, `text-success`, etc

## 📝 Código Atual

**Arquivo:** `src/pages/public/menu.tsx`

```tsx
// Listagem (linha 455)
<span className="text-success font-bold text-sm sm:text-base flex-shrink-0 whitespace-nowrap">
  R$ {product.price_normal.toFixed(2)}
</span>

// Modal (linha 543)
<div className="text-3xl font-bold text-success">
  R$ {selectedProduct.price_normal.toFixed(2)}
</div>

// Estrelas (linha 555)
<Star className="h-5 w-5 fill-warning text-warning" />

// Prep time (linha 562)
<Clock className="h-5 w-5" />
<span>Tempo de preparo: {selectedProduct.prep_time_minutes} minutos</span>
```

## 🔗 Relacionados

- [Configurações de Tema](src/pages/settings/index.tsx)
- [Cores Semânticas](src/components/ThemeCustomizationTab.tsx)
- [Tipos de Tema](src/types/theme.ts)

---

**Última atualização:** 2025-11-08
**Commit:** 41cb888
