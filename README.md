# LEP System — README

> MVP: Reservations, Waitlist e Digital Menu

---

## Visão geral

Este repositório contém a base front-end de um sistema SaaS para gestão de restaurantes (LEP System), construído com **React + Vite + TypeScript**. O MVP foca em **Reservas**, **Fila de Espera** e **Cardápio Digital (público)** — com os CRUDs necessários para suportar essas funcionalidades: Users, Customers, Tables, Products, Reservations, Waitlist e Orders.

O projeto já inclui um **Context** global para armazenar informações de sessão/tenant: `userId`, `orgId` e `projectId` (essas três chaves devem estar disponíveis para todas as páginas/serviços).

---

## Objetivo e escopo do MVP

* Permitir que clientes (acesso **público**) vejam o cardápio digital e façam pedidos informando o número/ID da mesa (sem login).
* Permitir que funcionários/administradores (acesso **privado**, via login) gerenciem usuários, clientes, mesas, produtos, reservas, fila de espera e pedidos.
* Fornecer serviços front-end (`src/api/*`) que encapsulam as chamadas ao backend (REST).

---

## Funcionalidades principais

### Acesso público (sem login)

* `/menu` — Listagem pública de produtos disponíveis (cardápio digital).
* `/order` — Fluxo para criar um pedido público, informando mesa e itens.

### Acesso privado (com login)

* CRUD de **Users** (funcionários/admins)
* CRUD de **Customers** (clientes do restaurante)
* CRUD de **Tables** (mesas do estabelecimento)
* CRUD de **Products** (itens do cardápio)
* CRUD de **Reservations** (reservas de mesas)
* CRUD de **Waitlist** (fila de espera)
* Gestão de **Orders** (pedidos internos / acompanhamento)

### Regras de negócio principais (resumo)

* Ao criar uma reserva: validação de disponibilidade da mesa no horário.
* Ao criar um pedido (interno ou público): cálculo de total, e baixa de estoque (quando aplicável).
* Cancelamento de pedidos e reservas deve reverter efeitos (ex.: liberar mesa, restituir estoque).
* Deleção lógica (soft delete) para preservar histórico quando aplicável.
* Logs/auditoria para criação/atualização/cancelamento (usados em relatórios).

---

## Estrutura de pastas (resumo)

```
src/
├─ api/                    # Services que conversam com a API (axios)
│  ├─ api.ts               # instância axios + interceptors
│  ├─ userService.ts
│  ├─ customerService.ts
│  ├─ tableService.ts
│  ├─ productService.ts
│  ├─ reservationService.ts
│  ├─ waitlistService.ts
│  └─ orderService.ts
├─ components/
│  ├─ Navbar.tsx
│  ├─ Table.tsx
│  ├─ Modal.tsx
│  └─ FormInput.tsx
├─ context/
│  └─ UserContext.tsx      # userId, orgId, projectId
├─ pages/
│  ├─ Users/               # List.tsx, Form.tsx
│  ├─ Customers/
│  ├─ Tables/
│  ├─ Products/
│  ├─ Reservations/
│  ├─ Waitlist/
│  └─ Orders/              # PublicMenu.tsx, MyOrders.tsx
├─ App.tsx
└─ main.tsx
```

---

## Rotas (frontend) — resumo

### Públicas

* `GET /menu` → PublicMenu (lista produtos)
* `POST /orders/public` → Criar pedido público (mesa + itens)

### Privadas (requer login)

* `GET /users`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`
* `GET /customers`, `POST /customers`, `PUT /customers/:id`, `DELETE /customers/:id`
* `GET /tables`, `POST /tables`, `PUT /tables/:id`, `DELETE /tables/:id`
* `GET /products`, `POST /products`, `PUT /products/:id`, `DELETE /products/:id`
* `GET /reservations`, `POST /reservations`, `PUT /reservations/:id`, `DELETE /reservations/:id`
* `GET /waitlist`, `POST /waitlist`, `PUT /waitlist/:id`, `DELETE /waitlist/:id`
* `GET /orders`, `POST /orders`, `PUT /orders/:id`, `DELETE /orders/:id`

> Note: os endpoints acima são o *padrão* esperado pelo front-end. Ajuste `api.baseURL` conforme seu backend.

---

## API (front) — interceptors e headers esperados

* A instância `api.ts` adiciona automaticamente os headers `x-org-id` e `x-proj-id` (extraídos do `UserContext` / `localStorage`) às requisições.
* Recomenda-se também enviar `Authorization: Bearer <token>` para rotas privadas.

Exemplo de `api.ts` (resumo):

```ts
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });
// interceptor -> adiciona x-org-id e x-proj-id
```

---

## Exemplos de payloads (JSON)

### User (create)

```json
{
  "name": "Maria Oliveira",
  "email": "maria@restaurant.com",
  "password": "secret_password",
  "role": "waiter",
  "permissions": ["view_orders","create_reservation"]
}
```

### Customer (create)

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "+55 11 99999-9999",
  "birthDate": "1990-05-12"
}
```

### Table (create)

```json
{
  "number": 12,
  "capacity": 4,
  "location": "Main Hall"
}
```

### Product (create)

```json
{
  "name": "Pizza Margherita",
  "description": "Thin crust, tomato sauce, basil",
  "price": 45.9,
  "available": true
}
```

### Reservation (create)

```json
{
  "customerId": "uuid-customer",
  "tableId": "uuid-table",
  "datetime": "2025-09-12T19:00:00Z",
  "partySize": 4,
  "note": "Birthday"
}
```

### Waitlist (create)

```json
{
  "customerId": "uuid-customer",
  "people": 2
}
```

### Order (public create)

```json
{
  "tableNumber": "12",
  "items": [
    { "productId": "uuid-prod-1", "quantity": 2 },
    { "productId": "uuid-prod-2", "quantity": 1 }
  ],
  "note": "No onions"
}
```

---

## Regras importantes e validações (detalhado)

### Reservas

* Verificar se `tableId` está disponível no intervalo solicitado (p.ex. +/- 1h dependendo do tempo médio de ocupação).
* Reservas confirmadas bloqueiam a mesa no intervalo.
* Permitir alteração de horário/mesa com revalidação.
* Cancelamento libera mesa e gera log.

### Fila de espera

* Adição rápida com `customerId` e `people`.
* Notificação manual ou automática quando a mesa fica disponível.
* Ordem FIFO (ou priorização por VIP/cliente frequente, se implementado).

### Pedidos (public)

* Cliente informa `tableNumber`. Backend converte para `tableId` (se existir) e verifica disponibilidade.
* Pedidos públicos devem gravar `source: public` e `tableNumber` para rastreabilidade.

### Estoque (se presente)

* Ao finalizar pedido: decrementar ingredientes/produtos associados.
* Se item em falta, impedir inclusão no pedido (ou sinalizar como "pre-order").

---

## Contexto global

O `UserContext` expõe pelo menos:

```ts
{
  user: { id, name, orgId, projectId, roles[] } | null,
  login(...),
  logout()
}
```

* `orgId` e `projectId` são obrigatórios para todas as chamadas à API multi-tenant.
* Em desenvolvimento, os valores podem vir do `localStorage` para facilitar testes.

---

## Como rodar (local)

```
# criar projeto (se ainda não criado)
npm create vite@latest my-app -- --template react-ts

# entrar na pasta
cd my-app

# instalar dependências
npm install
# (se usar axios, react-router-dom, tailwind)
npm install axios react-router-dom

# rodar em dev
npm run dev

# build
npm run build
```

### Variáveis de ambiente

* `VITE_API_BASE_URL` — URL base do backend (ex: `http://localhost:3000/api`).
* `VITE_ENABLE_MOCKS` — `true`/`false` (opcional) para ativar mocks locais.

---

## UI / Estilo

* Estilização mínima com **Tailwind CSS** (padrão: Navbar com fundo escuro, links com hover azul).
* Componentes reutilizáveis: `Table`, `Modal`, `FormInput`.

---

## Logging / Auditoria

* Criar logs para: criação/edição/cancelamento de reservas, pedidos, movimentações de estoque e estornos.
* Esses logs alimentam relatórios (vendas, produtos mais pedidos, reservas por horário).

---

## Boas práticas e observações técnicas

* Preferir soft-deletes para preservar histórico.
* Todas as operações que alteram estado crítico (estoque, reserva, pagamento) devem ser idempotentes e registradas (request id / rid) para rastreabilidade.
* Validar dados no front e no backend (sempre confiar no backend).

---

## Roadmap / Próximos passos sugeridos

1. Implementar autenticação real (JWT) e RBAC (roles/permissions).
2. Integração com sistema de notificações (email/SMS) para reservas.
3. Painel de relatórios/analytics (vendas, consumo de estoque, horário de pico).
4. Integração com gateway de pagamentos para pagamentos no local (cartão/Pix).
5. Suporte a multi-organization tenant isolation (RBAC por org + project).

---

## Contribuição

* Fork → branch feature/xxx → PR descrevendo mudanças e screenshots.
* Seguir padrão de commits (feat, fix, chore) e incluir testes quando aplicável.


