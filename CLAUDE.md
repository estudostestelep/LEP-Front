# CLAUDE.md

Este arquivo fornece orientação ao Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Visão Geral do Projeto

O LEP System é uma aplicação SaaS de gestão de restaurantes em React + TypeScript focada em funcionalidades de Reservas, Lista de Espera, Cardápio Digital e Notificações. Construído com Vite, o projeto segue uma arquitetura modular com serviços de API, gerenciamento de contexto e rotas públicas e privadas.

## Comandos de Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar linting
npm run lint

# Visualizar build de produção
npm run preview
```

## Arquitetura do Projeto

### Stack Tecnológica
- **Frontend**: React 19.1.1 com TypeScript
- **Ferramenta de Build**: Vite 7.1.2
- **Estilização**: Tailwind CSS com componentes shadcn/ui
- **Cliente HTTP**: Axios com interceptors
- **Roteamento**: React Router DOM 7.9.1
- **Animações**: Framer Motion
- **Ícones**: Lucide React

### Estrutura de Diretórios
```
src/
├── api/                    # Camada de serviços da API
│   ├── api.ts             # Instância Axios com interceptors
│   ├── userService.ts     # Gestão de usuários
│   ├── customerService.ts # Gestão de clientes
│   ├── tableService.ts    # Gestão de mesas
│   ├── productService.ts  # Gestão de produtos
│   ├── bookingService.ts  # Reservas
│   ├── waitingLineService.ts # Lista de espera
│   ├── ordersService.ts   # Pedidos
│   ├── projectService.ts  # Projetos (NOVO)
│   ├── settingsService.ts # Configurações (NOVO)
│   ├── environmentService.ts # Ambientes (NOVO)
│   └── notificationService.ts # Notificações (NOVO)
├── components/
│   ├── ui/                # Componentes shadcn/ui
│   ├── magicui/          # Componentes animados customizados
│   ├── navbar.tsx        # Navegação principal
│   ├── confirmModal.tsx  # Modal de confirmação
│   └── formModal.tsx     # Modal de formulário
├── context/
│   └── authContext.tsx    # Autenticação e contexto do tenant
├── pages/
│   ├── home/             # Página inicial
│   ├── menu/             # Cardápio digital público
│   ├── login/            # Login
│   ├── users/            # Área administrativa privada
│   ├── products/         # Área administrativa privada
│   └── customers/        # Área administrativa privada
└── lib/
    ├── utils.ts          # Utilitários Tailwind merge
    └── mock-data.ts      # Dados mock para desenvolvimento
```

### Autenticação e Contexto

A aplicação usa `AuthContext` para gerenciar sessões de usuário com a seguinte estrutura:
```typescript
interface User {
  id: string;
  name: string;
  email?: string;
  role?: string;
  organization_id: string;      # ID da organização multi-tenant
  project_id: string;  # ID do projeto multi-tenant
}
```

**Importante**: Todas as chamadas da API incluem automaticamente headers `X-Lpe-Organization-Id` e `X-Lpe-Project-Id` via interceptors axios para suporte multi-tenant.

### Configuração da API

- URL Base: `http://localhost:8080` (configurada em `src/api/api.ts`)
- Injeção automática de headers: `X-Lpe-Organization-Id` e `X-Lpe-Project-Id` do localStorage
- Tratamento centralizado de erros através de interceptors axios

### Estratégia de Roteamento

- **Rotas Públicas**: `/`, `/menu` (sem autenticação necessária)
- **Rotas Privadas**: `/users`, `/products`, `/customers` (requerem autenticação via componente `PrivateRoute`)
- Navegação gerenciada por `src/components/navbar.tsx`

### Lógica de Negócio Principal

1. **Arquitetura Multi-tenant**: Cada requisição inclui organization_id/project_id para isolamento de tenant
2. **Cardápio Digital Público**: Clientes podem visualizar o menu sem autenticação
3. **Interface Administrativa**: Operações CRUD protegidas para gestão do restaurante
4. **Persistência de Sessão**: Dados do usuário armazenados no localStorage com hidratação automática do contexto
5. **Sistema de Notificações**: Configuração e gerenciamento de notificações SMS/WhatsApp/Email

### Variáveis de Ambiente

Variáveis de ambiente esperadas:
- `VITE_API_BASE_URL`: URL base da API do backend
- `VITE_ENABLE_MOCKS`: Habilitar/desabilitar dados mock (opcional)

### Notas Importantes de Implementação

- Aliasing de caminho configurado: `@/` mapeia para `src/`
- Tailwind CSS com biblioteca de componentes customizada (shadcn/ui + magicui)
- Modo strict do TypeScript habilitado
- Configuração ESLint para qualidade de código
- Design responsivo com abordagem mobile-first

### Padrão de Serviços da API

Todos os serviços da API seguem um padrão consistente:
```typescript
// Exemplo do userService.ts (ATUALIZADO)
export const userService = {
  getAll: () => api.get<User[]>("/user"),        // Alinhado com backend
  getById: (id: string) => api.get<User>(`/user/${id}`),
  create: (data: User) => api.post<User>("/user", data),
  update: (id: string, data: User) => api.put<User>(`/user/${id}`, data),
  remove: (id: string) => api.delete(`/user/${id}`)
};
```

### Serviços Disponíveis

#### Serviços Principais (Alinhados com Backend)
- `userService`: CRUD de usuários
- `customerService`: CRUD de clientes
- `productService`: CRUD de produtos
- `tableService`: CRUD de mesas
- `orderService`: CRUD de pedidos
- `bookingService`: CRUD de reservas (mapeado para `/reservation`)
- `waitingLineService`: CRUD de lista de espera (mapeado para `/waitlist`)

#### Novos Serviços (Funcionalidades Expandidas)
- `projectService`: Gerenciamento de projetos
- `settingsService`: Configurações do projeto
- `environmentService`: Ambientes e credenciais
- `notificationService`: Sistema de notificações

Os serviços incluem automaticamente headers de tenant através do interceptor da API em `src/api/api.ts`.

### Integração com Sistema de Notificações

O frontend está preparado para gerenciar:
- Configuração de eventos de notificação
- Templates de mensagem dinâmicos
- Logs de entrega e status
- Configurações de projeto para notificações
- Ambientes com credenciais Twilio/SMTP