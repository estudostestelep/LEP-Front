# LEP System — Frontend

> Sistema SaaS completo para gestão de restaurantes: Reservas, Fila de Espera, Cardápio Digital e Notificações

---

## 🏗️ Arquitetura do Sistema

### Visão Geral

**LEP System** é um sistema SaaS de gestão completa para restaurantes, construído com **React 19 + Vite + TypeScript**. O sistema oferece funcionalidades de reservas, fila de espera, cardápio digital e sistema de notificações, com arquitetura **multi-tenant** para suportar múltiplos restaurantes.

### Tecnologias Principais

- **Frontend**: React 19.1.1 + TypeScript
- **Build Tool**: Vite 7.1.2
- **Estilização**: Tailwind CSS + shadcn/ui + magicui
- **Roteamento**: React Router DOM 7.9.1
- **HTTP Client**: Axios com interceptors
- **Animações**: Framer Motion
- **Ícones**: Lucide React

---

## 🚀 Configuração e Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend LEP-Back rodando na porta 8080

### Instalação

```bash
# Clonar o repositório
git clone <repository-url>
cd LEP-Front

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

### Variáveis de Ambiente

```env
# .env
VITE_API_BASE_URL=https://lep-system-516622888070.us-central1.run.app

VITE_ENABLE_MOCKS=false
```

---

## 🗺️ Estrutura de Rotas

### Rotas Públicas (sem autenticação)

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | Home | Página inicial pública/dashboard |
| `/menu` | Menu | Cardápio digital público |
| `/login` | Login | Página de autenticação |

### Rotas Privadas (requer autenticação)

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/users` | Users List | Gerenciamento de usuários |
| `/customers` | Customers List | Gerenciamento de clientes |
| `/tables` | Tables List | Gerenciamento de mesas |
| `/products` | Products List | Gerenciamento de produtos |
| `/reservations` | Reservations List | Gerenciamento de reservas |
| `/waitlist` | Waitlist List | Gerenciamento de fila de espera |
| `/orders` | Orders List | Gerenciamento de pedidos |

---

## 🔐 Sistema de Autenticação

### Fluxo de Autenticação

1. **Login**: `POST /login` com email/senha
2. **Validação**: Token JWT armazenado no localStorage
3. **Headers Automáticos**: Interceptors adicionam headers multi-tenant
4. **Logout**: Limpeza do token e redirecionamento

### Headers Multi-Tenant

Todas as requisições incluem automaticamente:

```http
Authorization: Bearer <jwt-token>
X-Lpe-Organization-Id: <organization-uuid>
X-Lpe-Project-Id: <project-uuid>
Content-Type: application/json
```

### Estrutura do AuthContext

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  setOrgAndProject: (organization_id: string, project_id: string) => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  organization_id?: string;
  project_id?: string;
}
```

---

## 📁 Estrutura de Arquivos

```
src/
├── api/                    # Serviços da API
│   ├── api.ts             # Instância Axios + interceptors
│   ├── authService.ts     # Autenticação (login, logout, checkToken)
│   ├── userService.ts     # CRUD de usuários
│   ├── customerService.ts # CRUD de clientes
│   ├── tableService.ts    # CRUD de mesas
│   ├── productService.ts  # CRUD de produtos
│   ├── bookingService.ts  # CRUD de reservas (alias: reservationService)
│   ├── waitingLineService.ts # CRUD de fila de espera (alias: waitlistService)
│   ├── ordersService.ts   # CRUD de pedidos + fila da cozinha
│   ├── notificationService.ts # Sistema de notificações
│   ├── reportsService.ts  # Relatórios e exports
│   ├── projectService.ts  # Gerenciamento de projetos
│   ├── settingsService.ts # Configurações do sistema
│   └── environmentService.ts # Ambientes e credenciais
├── components/
│   ├── ui/                # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── badge.tsx
│   ├── magicui/          # Componentes animados customizados
│   │   ├── animated-gradient-text.tsx
│   │   ├── shimmer-button.tsx
│   │   └── number-ticker.tsx
│   ├── navbar.tsx        # Navegação principal
│   ├── formModal.tsx     # Modal de formulário reutilizável
│   └── confirmModal.tsx  # Modal de confirmação
├── context/
│   └── authContext.tsx   # Contexto de autenticação multi-tenant
├── pages/
│   ├── home/            # Dashboard principal
│   ├── login/           # Página de login
│   ├── menu/            # Cardápio público
│   ├── users/           # Gerenciamento de usuários
│   ├── customers/       # Gerenciamento de clientes
│   ├── tables/          # Gerenciamento de mesas
│   ├── products/        # Gerenciamento de produtos
│   ├── reservations/    # Gerenciamento de reservas
│   ├── waitlist/        # Gerenciamento de fila de espera
│   └── orders/          # Gerenciamento de pedidos
├── lib/
│   ├── utils.ts         # Utilitários (Tailwind merge, etc.)
│   └── mock-data.ts     # Dados mock para desenvolvimento
├── App.tsx              # Configuração de rotas
├── main.tsx             # Entry point
└── index.css            # Estilos globais Tailwind
```

---

## 🛠️ Serviços da API

### Padrão dos Services

Todos os services seguem o padrão:

```typescript
export const serviceNameService = {
  getAll: () => api.get<Entity[]>("/endpoint"),
  getById: (id: string) => api.get<Entity>(`/endpoint/${id}`),
  create: (data: CreateRequest) => api.post<Entity>("/endpoint", data),
  update: (id: string, data: Partial<Entity>) => api.put<Entity>(`/endpoint/${id}`, data),
  remove: (id: string) => api.delete(`/endpoint/${id}`)
};
```

### Services Disponíveis

#### Core Services (CRUD Completo)
- **userService**: Gerenciamento de usuários do sistema
- **customerService**: Gerenciamento de clientes do restaurante
- **tableService**: Gerenciamento de mesas
- **productService**: Gerenciamento de produtos do cardápio
- **reservationService**: Gerenciamento de reservas (alias: bookingService)
- **waitlistService**: Gerenciamento de fila de espera (alias: waitingLineService)
- **orderService**: Gerenciamento de pedidos + fila da cozinha

#### Advanced Services
- **authService**: Login, logout, validação de token
- **notificationService**: Configurações, templates e logs de notificações
- **reportsService**: Relatórios de ocupação, reservas e exports CSV
- **projectService**: Gerenciamento de projetos multi-tenant
- **settingsService**: Configurações do projeto
- **environmentService**: Ambientes e credenciais (Twilio, SMTP)

---

## 📊 Funcionalidades Implementadas

### 🏠 Dashboard Principal
- **Estatísticas em tempo real**: clientes, pedidos ativos, reservas, fila de espera
- **Faturamento do dia**: cálculo automático baseado em pedidos
- **Ações rápidas**: links diretos para principais funcionalidades
- **Estado de loading e error handling** completo

### 👥 Gerenciamento de Usuários
- **CRUD completo** com roles e permissions
- **UI moderna** com cards e filtros
- **Busca** por nome ou email
- **Filtros por role**: admin, waiter, chef, etc.

### 🏪 Gerenciamento de Clientes
- **CRUD completo** com dados de contato
- **Campos**: nome, email, telefone, data de nascimento
- **UI padronizada** com cards e estados de loading

### 🪑 Gerenciamento de Mesas
- **CRUD completo** com status em tempo real
- **Status**: livre, ocupada, reservada
- **Informações**: número, capacidade, localização
- **Filtros** por status e busca por número/localização

### 🍕 Gerenciamento de Produtos
- **CRUD completo** do cardápio
- **Campos**: nome, descrição, preço, disponibilidade, tempo de preparo
- **Status visual** de disponibilidade

### 🔐 Sistema de Autenticação Completo
- **Login real** com JWT tokens
- **Multi-tenant** com headers automáticos
- **Proteção de rotas** privadas
- **Logout** com limpeza completa

---

## 🎨 Padrões de UI/UX

### Design System
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes base
- **magicui** para animações especiais
- **Lucide React** para ícones consistentes

### Padrões de Componentes

#### Loading States
```tsx
{loading && (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">Carregando...</p>
    </div>
  </div>
)}
```

#### Error Handling
```tsx
{error && (
  <Card className="mb-6 border-destructive">
    <CardContent className="p-4">
      <div className="flex items-center space-x-2 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <span>{error}</span>
        <Button variant="outline" size="sm" onClick={retry}>
          Tentar Novamente
        </Button>
      </div>
    </CardContent>
  </Card>
)}
```

#### Empty States
```tsx
{data.length === 0 && (
  <Card className="text-center py-12">
    <CardContent>
      <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">Nenhum item encontrado</h3>
      <p className="text-muted-foreground mb-4">Descrição do estado vazio</p>
      <Button onClick={action}>Ação Principal</Button>
    </CardContent>
  </Card>
)}
```

---

## 🔗 Integração com Backend

### Base URL
```typescript
// src/api/api.ts
const api = axios.create({
  baseURL: "https://lep-system-516622888070.us-central1.run.app"
});
```

### Endpoints Backend Mapeados

| Frontend Service | Backend Endpoint | Método | Descrição |
|------------------|------------------|--------|-----------|
| `authService.login()` | `POST /login` | POST | Autenticação |
| `userService.getAll()` | `GET /user` | GET | Listar usuários |
| `customerService.getAll()` | `GET /customer` | GET | Listar clientes |
| `tableService.getAll()` | `GET /table` | GET | Listar mesas |
| `productService.getAll()` | `GET /product` | GET | Listar produtos |
| `reservationService.getAll()` | `GET /reservation` | GET | Listar reservas |
| `waitlistService.getAll()` | `GET /waitlist` | GET | Listar fila de espera |
| `orderService.getAll()` | `GET /order` | GET | Listar pedidos |
| `orderService.getKitchenQueue()` | `GET /kitchen/queue` | GET | Fila da cozinha |

### Exemplos de Payloads

#### Criar Usuário
```json
{
  "organization_id": "uuid",
  "project_id": "uuid",
  "name": "João Silva",
  "email": "joao@restaurant.com",
  "password": "senha123",
  "role": "waiter",
  "permissions": ["view_orders", "create_reservation"]
}
```

#### Criar Mesa
```json
{
  "organization_id": "uuid",
  "project_id": "uuid",
  "number": 12,
  "capacity": 4,
  "location": "Salão Principal",
  "status": "livre"
}
```

#### Criar Reserva
```json
{
  "organization_id": "uuid",
  "project_id": "uuid",
  "customer_id": "uuid",
  "table_id": "uuid",
  "datetime": "2024-03-15T19:30:00Z",
  "party_size": 4,
  "note": "Aniversário"
}
```

---

## 🧪 Desenvolvimento e Testing

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento (porta 5173)
npm run build        # Build para produção
npm run preview      # Preview da build de produção
npm run lint         # Linting com ESLint

# Outros comandos úteis
npm run dev -- --port 3000    # Executar em porta específica
npm run build -- --mode prod  # Build com modo específico
```

### Estrutura de Testing (Recomendada)

```bash
# Instalar dependências de teste
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Comandos de teste
npm run test         # Executar testes
npm run test:watch   # Executar testes em modo watch
npm run test:ui      # Interface visual dos testes
npm run coverage     # Relatório de cobertura
```

---

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de CORS
```bash
# No backend, certificar que CORS está configurado para:
Origin: http://localhost:5173
```

#### 2. Token Expirado
- O sistema automaticamente limpa tokens inválidos
- Usuário é redirecionado para `/login`
- Verificar se backend está enviando tokens válidos

#### 3. Headers Multi-tenant Ausentes
```typescript
// Verificar se user tem organization_id e project_id
console.log(user.organization_id, user.project_id);

// Headers devem aparecer como:
// X-Lpe-Organization-Id: uuid
// X-Lpe-Project-Id: uuid
```

#### 4. Problemas de Build
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar versões
node --version  # >= 18
npm --version   # >= 8
```

---

## 🚀 Deploy e Produção

### Build de Produção

```bash
# Gerar build otimizada
npm run build

# Arquivos gerados em: dist/
# Servir com qualquer servidor estático (nginx, apache, etc.)
```

### Variáveis de Produção

```env
# .env.production
VITE_API_BASE_URL=https://api.lep-system.com
VITE_ENABLE_MOCKS=false
```

### Exemplo Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

---

## 🛣️ Roadmap

### ✅ Implementado
- [x] Sistema de autenticação JWT
- [x] CRUD completo: Users, Customers, Tables, Products
- [x] Dashboard com estatísticas em tempo real
- [x] UI/UX padronizada e responsiva
- [x] Multi-tenant com headers automáticos
- [x] Error handling e loading states

### 🔄 Em Desenvolvimento
- [ ] CRUD de Reservations
- [ ] CRUD de Waitlist
- [ ] CRUD de Orders + Kitchen Queue
- [ ] Sistema de Notificações (SMS/WhatsApp/Email)
- [ ] Relatórios e exports CSV
- [ ] Configurações de Projeto

### 📋 Próximos Passos
- [ ] Testes automatizados (Jest + Testing Library)
- [ ] PWA (Progressive Web App)
- [ ] WebSocket para updates em tempo real
- [ ] Sistema de cache inteligente
- [ ] Internacionalização (i18n)
- [ ] Modo offline básico

---

## 👥 Contribuição

### Padrões de Código

1. **TypeScript**: Sempre tipado, evitar `any`
2. **Componentes**: Funcionais com hooks
3. **Styling**: Tailwind CSS + shadcn/ui
4. **Imports**: Absolutos com `@/` alias
5. **Commit**: Conventional Commits (feat, fix, chore)

### Workflow

```bash
# Fork do repositório
git clone <your-fork>
cd LEP-Front

# Criar branch para feature
git checkout -b feature/nome-da-feature

# Desenvolver e testar
npm run dev
npm run lint

# Commit e push
git add .
git commit -m "feat: adicionar nova funcionalidade"
git push origin feature/nome-da-feature

# Criar Pull Request
```

---

## 📞 Suporte

### Documentação Adicional
- **API Integration**: Consultar `API_INTEGRATION.md`
- **Claude Development**: Consultar `CLAUDE.md`
- **Backend**: Repositório LEP-Back

### Contato
- **Issues**: [GitHub Issues](link)
- **Discussions**: [GitHub Discussions](link)
- **Wiki**: [Documentação Completa](link)

---

**LEP System Frontend** - Sistema completo de gestão para restaurantes 🍽️