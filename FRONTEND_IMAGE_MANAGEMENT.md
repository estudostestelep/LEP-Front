# Frontend: Gerenciamento de Imagens com Limpeza de Órfãos

## 📋 Visão Geral

Implementação completa do frontend para o sistema de gerenciamento de imagens com:
- ✅ **Serviço API** para cleanup e estatísticas
- ✅ **Componente Visual** com UI intuitiva
- ✅ **Botão em Configurações do Sistema**
- ✅ **Feedback ao Usuário** com toasts e confirmações
- ✅ **Documentação Inline** sobre o funcionamento

---

## 📦 Arquivos Criados/Modificados

### ✅ Novos Arquivos (2)

1. **Serviço API** (`src/api/imageManagementService.ts`)
   - `cleanupOrphanedFiles(days)` - Executa cleanup
   - `getImageStats()` - Obtém estatísticas
   - Tipagem TypeScript completa

2. **Componente** (`src/components/ImageManagementSection.tsx`)
   - Seção visual com botões e informações
   - Estados de loading
   - Confirmação de ação
   - Exibição de resultados
   - Avisos e dicas

### ✏️ Arquivos Modificados (1)

1. **Página de Configurações** (`src/pages/settings/index.tsx`)
   - Importação do componente
   - Integração na página
   - Posicionamento antes das informações de usuário/org

---

## 🎨 Componente: ImageManagementSection

### Props
Nenhuma - o componente é auto-suficiente com hooks internos

### Estados Internos
```typescript
- isLoading: boolean              // Cleanup em progresso
- isLoadingStats: boolean         // Stats em progresso
- cleanupResult: CleanupResponse | null  // Último resultado
```

### Funcionalidades

#### 1. **Limpar Imagens Órfãs**
```
Fluxo:
1. Usuário clica "Limpar Imagens Órfãs"
2. Confirmação: "Tem certeza que deseja limpar?"
3. POST /admin/images/cleanup
4. Exibir resultado: "X arquivos deletados, YMB liberados"
5. Toast com feedback
```

**Comportamento:**
- Button fica desabilitado enquanto processa
- Spinner animado durante carregamento
- Confirmação preventiva antes de deletar
- Toast com resultado (sucesso ou erro)

#### 2. **Ver Estatísticas**
```
Fluxo:
1. Usuário clica "Ver Estatísticas"
2. GET /admin/images/stats
3. Toast com: "Total: X arquivos, Y únicos. Economia: ZMB"
```

### UI Components Utilizados

```
┌─────────────────────────────────────────────────┐
│  Card (azul) - Deduplicação Ativada             │
│  └─ HardDrive icon + Info sobre dedup           │
├─────────────────────────────────────────────────┤
│  Card (verde) - Resultado da Limpeza (if)       │
│  └─ ✅ Arquivos deletados, espaço liberado      │
├─────────────────────────────────────────────────┤
│  Card (âmbar) - Como Funciona                   │
│  └─ Ícone AlertCircle + 3 dicas                 │
├─────────────────────────────────────────────────┤
│  Buttons:                                       │
│  ├─ [Limpar Imagens Órfãs] (primary)            │
│  └─ [Ver Estatísticas] (outline)                │
├─────────────────────────────────────────────────┤
│  Tip: "Dica: Execute regularmente..."           │
└─────────────────────────────────────────────────┘
```

---

## 🔗 Serviço API: imageManagementService

### Tipos TypeScript

```typescript
interface CleanupResponse {
  success: boolean;
  files_deleted: number;
  disk_freed: number;        // bytes
  disk_freed_mb: number;     // convenience
  error_count: number;
  message: string;
}

interface ImageStatsResponse {
  total_files: number;
  unique_files: number;
  total_references: number;
  duplicated_references: number;
  total_disk_usage: number;         // bytes
  total_disk_usage_mb: number;      // convenience
  estimated_savings: number;        // bytes economizados
  estimated_savings_mb: number;     // convenience
}
```

### Métodos

```typescript
// Cleanup de órfãos
cleanupOrphanedFiles(days: number = 0)
  → POST /admin/images/cleanup?days=0
  → Promise<AxiosResponse<CleanupResponse>>

// Estatísticas
getImageStats()
  → GET /admin/images/stats
  → Promise<AxiosResponse<ImageStatsResponse>>
```

---

## 🎯 Fluxo de Usuário

### Cenário 1: Admin Faz Cleanup

```
1. Admin acessa Configurações do Sistema
   ↓
2. Vê seção "Gerenciamento de Imagens"
   ├─ Card azul explicando deduplicação
   ├─ Card âmbar com instruções
   └─ Dois botões: [Limpar] e [Ver Stats]
   ↓
3. Clica "Limpar Imagens Órfãs"
   ↓
4. Popup: "Tem certeza que deseja limpar?"
   ├─ Cancelar → nada acontece
   └─ Confirmar → processa
     ↓
5. Button fica desabilitado com spinner
   ↓
6. Resposta do servidor:
   ├─ Sucesso → Toast verde: "5 arquivos deletados, 50MB liberados"
   └─ Erro → Toast vermelho: "Erro ao limpar imagens órfãs"
   ↓
7. Se sucesso, resultado exibido em card verde:
   ├─ 📁 Arquivos deletados: 5
   ├─ 💾 Espaço liberado: 50.12MB
   └─ (opcional) ⚠️ Erros durante limpeza: 0
```

### Cenário 2: Admin Verifica Estatísticas

```
1. Admin clica "Ver Estatísticas"
   ↓
2. Button fica desabilitado com spinner
   ↓
3. GET /admin/images/stats
   ↓
4. Toast com resultado:
   "📊 Total: 150 arquivos, 100 únicos.
    Economia estimada: 250.50MB"
```

---

## 💅 Estilos e Temas

### Cores Utilizadas

- **Azul** - Informação sobre deduplicação
  - `bg-blue-50 / dark:bg-blue-950/30`
  - `border-blue-200 / dark:border-blue-800`
  - `text-blue-900 / dark:text-blue-100`

- **Verde** - Resultado de sucesso
  - `bg-green-50 / dark:bg-green-950/30`
  - `border-green-200 / dark:border-green-800`
  - `text-green-900 / dark:text-green-100`

- **Âmbar** - Avisos e instrções
  - `bg-amber-50 / dark:bg-amber-950/30`
  - `border-amber-200 / dark:border-amber-800`
  - `text-amber-900 / dark:text-amber-100`

### Responsividade

```
Mobile:
├─ Botões empilhados verticalmente (flex-col)
└─ Sem quebra de cards

Desktop (sm+):
├─ Botões lado a lado (flex-row)
└─ Cards mantêm largura natural
```

---

## 🔐 Segurança e Validações

### Frontend

1. **Confirmação de Ação**
   - `window.confirm()` antes de deletar
   - Previne deleções acidentais

2. **Feedback Visual**
   - Loading states claros
   - Buttons desabilitados durante operação
   - Spinners animados

3. **Error Handling**
   - Try-catch ao redor de chamadas API
   - Toast com mensagem de erro
   - Log em console para debug

### Backend

1. **Autenticação**
   - Requer token JWT válido
   - Headers org/proj obrigatórios

2. **Autorização**
   - Apenas admins podem acessar /admin/images/*

3. **Validações**
   - Soft delete (não apaga se há referências)
   - Erro handling graceful

---

## 📝 Localizações

### Português-BR

- ✅ "Gerenciamento de Imagens"
- ✅ "Limpar imagens órfãs e gerenciar armazenamento"
- ✅ "Deduplicação de Imagens Ativada"
- ✅ "Limpar Imagens Órfãs"
- ✅ "Ver Estatísticas"
- ✅ Mensagens de toast em português

### Plurais e Formatação

- `1 arquivo` vs `X arquivos`
- `50.12MB` (com 2 decimais)
- Data em formato DD/MM/YYYY

---

## 🧪 Testes Recomendados (Manual)

### Caso 1: Cleanup com Sucesso
```
1. Ter arquivos órfãos no BD
2. Clicar "Limpar Imagens Órfãs"
3. Confirmar na popup
4. ✓ Toast sucesso
5. ✓ Card verde com resultado
6. ✓ Números corretos exibidos
```

### Caso 2: Cleanup sem Órfãos
```
1. Sem arquivos órfãos
2. Clicar "Limpar Imagens Órfãs"
3. ✓ Mensagem: "Nenhum arquivo órfão encontrado"
4. ✓ Card verde com 0 deletados
```

### Caso 3: Estatísticas
```
1. Clicar "Ver Estatísticas"
2. ✓ Toast com informações
3. ✓ Números fazem sentido
4. ✓ Economia > 0 (se há duplicatas)
```

### Caso 4: Erro na API
```
1. Servidor retorna erro 500
2. ✓ Toast vermelho: "Erro ao limpar"
3. ✓ Button volta ao estado normal
4. ✓ Sem travamento da UI
```

### Caso 5: Sem Permissão
```
1. Usuário não-admin tenta acessar
2. ✓ Erro 403 ou 401
3. ✓ Toast: "Não autorizado"
```

---

## 🚀 Deploy

### Build
```bash
npm run build
```

### Dev
```bash
npm run dev
```

### Ambiente Variables
Nenhuma variável adicional necessária - usa `VITE_API_BASE_URL` existente

---

## 📚 Estrutura do Código

### imageManagementService.ts
```
└─ Tipos (Interfaces)
   ├─ CleanupResponse
   └─ ImageStatsResponse
└─ Export
   └─ imageManagementService
      ├─ cleanupOrphanedFiles()
      └─ getImageStats()
```

### ImageManagementSection.tsx
```
└─ useState hooks
   ├─ isLoading
   ├─ isLoadingStats
   └─ cleanupResult
└─ Handlers
   ├─ handleCleanupOrphanedFiles()
   └─ handleGetStats()
└─ Helpers
   └─ formatBytes()
└─ JSX
   ├─ Card Deduplicação (info)
   ├─ Card Resultado (conditional)
   ├─ Card Avisos (help)
   ├─ Buttons (actions)
   └─ Tip (footer)
```

---

## 🔮 Melhorias Futuras (Opcional)

1. **Histórico de Limpezas**
   - Armazenar quando foi feita última limpeza
   - Mostrar trending de economia

2. **Gráficos de Estatísticas**
   - Chart.js ou Recharts para visualizar uso
   - Comparativo antes/depois

3. **Agendamento de Cleanup**
   - Agendar limpeza automática
   - Horário pré-configurado

4. **Notificações**
   - Webhook quando cleanup completa
   - Email com resumo

5. **Filtros de Cleanup**
   - Limpar por categoria
   - Limpar por data (older than X days)

---

## ✅ Checklist

- [x] Serviço API criado
- [x] Componente visual criado
- [x] Integrado em Configurações
- [x] Tipagem TypeScript completa
- [x] Feedback visual (loading, toasts)
- [x] Confirmação de ação
- [x] Tratamento de erros
- [x] Responsivo (mobile + desktop)
- [x] Dark mode suportado
- [x] Build compila sem erros
- [x] Documentação inline

---

**Status:** ✅ **PRONTO PARA PRODUÇÃO**

O componente está completo, testável e pronto para ser usado pelos admins.

---

## 📞 Integração com Backend

### Rotas Necessárias

```
POST /admin/images/cleanup?days=0
  ↓ requer autenticação + headers org/proj
  ↓ resposta: CleanupResponse

GET /admin/images/stats
  ↓ requer autenticação + headers org/proj
  ↓ resposta: ImageStatsResponse
```

✅ Ambas as rotas já foram implementadas no backend

---

**Versão:** 1.0
**Criado:** 25 de Outubro de 2025
**Status:** Completo e funcional
