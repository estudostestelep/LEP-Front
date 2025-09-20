# LEP System - Frontend Integration Guide

## 📋 Visão Geral

Este documento fornece todas as informações necessárias para integrar o frontend com a API do LEP System. Inclui especificações de endpoints, autenticação, exemplos de requests/responses e boas práticas.

## 🔐 Autenticação e Headers

### Headers Obrigatórios

Todos os endpoints (exceto `/login`, `POST /user`, `/ping`, `/health` e `/webhook/*`) requerem os seguintes headers:

```http
Authorization: Bearer <jwt-token>
X-Lpe-Organization-Id: <organization-uuid>
X-Lpe-Project-Id: <project-uuid>
Content-Type: application/json
```

### Fluxo de Autenticação

1. **Login**
```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response Success (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Nome do Usuário",
    "email": "user@example.com",
    "role": "admin",
    "permissions": ["view_orders", "create_reservation"]
  }
}
```

2. **Validação de Token**
```http
POST /checkToken
Authorization: Bearer <token>
```

3. **Logout**
```http
POST /logout
Authorization: Bearer <token>
```

## 📊 Endpoints Principais

### 👥 Usuários

#### Listar Usuários
```http
GET /user
Authorization: Bearer <token>
X-Lpe-Organization-Id: <org-id>
X-Lpe-Project-Id: <project-id>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@restaurant.com",
    "role": "waiter",
    "permissions": ["view_orders"],
    "created_at": "2023-12-01T10:00:00Z"
  }
]
```

#### Buscar Usuário por ID
```http
GET /user/:id
```

#### Buscar Usuários por Role (ex: "admin", "waiter")
```http
GET /user/group/:role
```

#### Criar Usuário
```http
POST /user
Content-Type: application/json

{
  "organization_id": "uuid",
  "project_id": "uuid",
  "name": "Novo Funcionário",
  "email": "funcionario@restaurant.com",
  "password": "senha123",
  "role": "waiter",
  "permissions": ["view_orders", "update_orders"]
}
```

### 📦 Produtos

#### Listar Produtos
```http
GET /product
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Pizza Margherita",
    "description": "Pizza com molho de tomate, mussarela e manjericão",
    "price": 32.90,
    "available": true,
    "prep_time_minutes": 25,
    "created_at": "2023-12-01T10:00:00Z"
  }
]
```

#### Criar Produto
```http
POST /product
Content-Type: application/json

{
  "organization_id": "uuid",
  "project_id": "uuid",
  "name": "Pizza Calabresa",
  "description": "Pizza com calabresa e cebola",
  "price": 35.90,
  "available": true,
  "prep_time_minutes": 25
}
```

### 🏠 Mesas

#### Listar Mesas
```http
GET /table
```

**Response:**
```json
[
  {
    "id": "uuid",
    "number": 1,
    "capacity": 4,
    "location": "Área externa",
    "status": "livre",
    "environment_id": "uuid"
  }
]
```

#### Status Possíveis de Mesa
- `livre` - Disponível para reserva
- `ocupada` - Mesa em uso
- `reservada` - Mesa reservada

### 📅 Reservas

#### Listar Reservas
```http
GET /reservation
```

**Query Parameters:**
- `date` - Filtrar por data (YYYY-MM-DD)
- `status` - Filtrar por status
- `table_id` - Filtrar por mesa

**Response:**
```json
[
  {
    "id": "uuid",
    "customer_id": "uuid",
    "table_id": "uuid",
    "datetime": "2023-12-25T19:30:00Z",
    "party_size": 4,
    "note": "Aniversário",
    "status": "confirmed"
  }
]
```

#### Status Possíveis de Reserva
- `confirmed` - Confirmada
- `cancelled` - Cancelada
- `completed` - Finalizada
- `no_show` - Cliente não compareceu

#### Criar Reserva
```http
POST /reservation
Content-Type: application/json

{
  "organization_id": "uuid",
  "project_id": "uuid",
  "customer_id": "uuid",
  "table_id": "uuid",
  "datetime": "2023-12-25T19:30:00Z",
  "party_size": 4,
  "note": "Mesa próxima à janela"
}
```

### ⏳ Lista de Espera

#### Listar Waitlist
```http
GET /waitlist
```

**Response:**
```json
[
  {
    "id": "uuid",
    "customer_id": "uuid",
    "party_size": 2,
    "estimated_wait": 30,
    "status": "waiting",
    "created_at": "2023-12-25T18:00:00Z"
  }
]
```

#### Status Possíveis de Waitlist
- `waiting` - Aguardando mesa
- `seated` - Cliente foi acomodado
- `left` - Cliente saiu da fila

### 👤 Clientes

#### Listar Clientes
```http
GET /customer
```

#### Criar Cliente
```http
POST /customer
Content-Type: application/json

{
  "organization_id": "uuid",
  "project_id": "uuid",
  "name": "Maria Silva",
  "email": "maria@email.com",
  "phone": "+5511999999999",
  "birth_date": "1990-01-15T00:00:00Z"
}
```

### 🛒 Pedidos

#### Listar Pedidos
```http
GET /order
```

#### Fila da Cozinha
```http
GET /kitchen/queue
```

**Response:**
```json
[
  {
    "id": "uuid",
    "table_number": 5,
    "items": [
      {
        "product_name": "Pizza Margherita",
        "quantity": 2,
        "prep_time_minutes": 25
      }
    ],
    "status": "preparing",
    "estimated_completion": "2023-12-25T19:45:00Z"
  }
]
```

## 📱 Sistema de Notificações

### Configurar Evento de Notificação
```http
POST /notification/config
Content-Type: application/json

{
  "event_type": "reservation_create",
  "enabled": true,
  "channels": ["sms", "whatsapp", "email"],
  "delay_minutes": 0
}
```

### Criar Template de Notificação
```http
POST /notification/template
Content-Type: application/json

{
  "channel": "sms",
  "event_type": "reservation_create",
  "subject": "Reserva Confirmada",
  "body": "Olá {{nome}}! Sua reserva para {{pessoas}} pessoas na mesa {{mesa}} está confirmada para {{data_hora}}."
}
```

### Variáveis Disponíveis nos Templates
- `{{nome}}` / `{{cliente}}` - Nome do cliente
- `{{mesa}}` / `{{numero_mesa}}` - Número da mesa
- `{{data}}` - Data (DD/MM/YYYY)
- `{{hora}}` - Hora (HH:MM)
- `{{data_hora}}` - Data e hora completa
- `{{pessoas}}` - Quantidade de pessoas
- `{{tempo_espera}}` - Tempo estimado de espera
- `{{status}}` - Status da reserva

### Enviar Notificação Manual
```http
POST /notification/send
Content-Type: application/json

{
  "event_type": "reservation_create",
  "entity_type": "reservation",
  "entity_id": "uuid-da-reserva",
  "recipient": "+5511999999999",
  "channel": "sms",
  "variables": {
    "nome": "João Silva",
    "mesa": "5",
    "data_hora": "25/12/2023 às 19:30"
  }
}
```

### Logs de Notificação
```http
GET /notification/logs?limit=50
```

## 📈 Relatórios

### Relatório de Ocupação
```http
GET /reports/occupancy?start_date=2023-12-01&end_date=2023-12-31
```

### Relatório de Reservas
```http
GET /reports/reservations?start_date=2023-12-01&end_date=2023-12-31
```

### Exportar para CSV
```http
GET /reports/export/csv?type=occupancy&start_date=2023-12-01&end_date=2023-12-31
```

## ⚠️ Códigos de Status HTTP

### Success (2xx)
- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Operação bem-sucedida sem conteúdo de retorno

### Client Error (4xx)
- `400 Bad Request` - Dados inválidos ou ausentes
- `401 Unauthorized` - Token inválido ou ausente
- `403 Forbidden` - Sem permissão para acessar o recurso
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (ex: email já cadastrado)

### Server Error (5xx)
- `500 Internal Server Error` - Erro interno do servidor

## 🔧 Boas Práticas

### 1. Gerenciamento de Estado
```javascript
// Exemplo com React/Redux
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    user: null,
    organizationId: localStorage.getItem('organizationId'),
    projectId: localStorage.getItem('projectId')
  }
});
```

### 2. Interceptor de Requisições
```javascript
// Axios interceptor example
axios.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  const orgId = store.getState().auth.organizationId;
  const projectId = store.getState().auth.projectId;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['X-Lpe-Organization-Id'] = orgId;
    config.headers['X-Lpe-Project-Id'] = projectId;
  }

  return config;
});
```

### 3. Tratamento de Erros
```javascript
// Error handling example
const handleApiError = (error) => {
  if (error.response?.status === 401) {
    // Token expirado - redirecionar para login
    store.dispatch(logout());
    navigate('/login');
  } else if (error.response?.status === 403) {
    // Sem permissão
    showToast('Você não tem permissão para essa ação', 'error');
  } else {
    // Erro genérico
    showToast(error.response?.data?.error || 'Erro interno', 'error');
  }
};
```

### 4. Paginação e Filtros
```javascript
// Example API call with filters
const fetchReservations = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.date) params.append('date', filters.date);
  if (filters.status) params.append('status', filters.status);
  if (filters.tableId) params.append('table_id', filters.tableId);

  const response = await api.get(`/reservation?${params.toString()}`);
  return response.data;
};
```

### 5. Real-time com WebSockets (Futuro)
```javascript
// WebSocket connection for real-time updates
const connectWebSocket = () => {
  const ws = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case 'reservation_created':
        store.dispatch(addReservation(data.reservation));
        break;
      case 'table_status_changed':
        store.dispatch(updateTableStatus(data.table));
        break;
    }
  };
};
```

## 📱 Estrutura Sugerida do Frontend

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── LoadingSpinner.jsx
│   ├── tables/
│   │   ├── TableList.jsx
│   │   ├── TableCard.jsx
│   │   └── TableStatusBadge.jsx
│   ├── reservations/
│   │   ├── ReservationList.jsx
│   │   ├── ReservationForm.jsx
│   │   └── ReservationCalendar.jsx
│   └── orders/
│       ├── OrderList.jsx
│       ├── KitchenQueue.jsx
│       └── OrderStatusBadge.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Tables.jsx
│   ├── Reservations.jsx
│   ├── Orders.jsx
│   ├── Customers.jsx
│   ├── Reports.jsx
│   └── Settings.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useApi.js
│   └── useRealTime.js
├── services/
│   ├── api.js
│   ├── auth.js
│   └── websocket.js
└── store/
    ├── authSlice.js
    ├── tablesSlice.js
    ├── reservationsSlice.js
    └── index.js
```

## 🧪 Testes da API

Use os seguintes exemplos para testar a integração:

### Teste de Autenticação
```bash
# Login
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}'

# Usar token retornado em requisições subsequentes
export TOKEN="<token-retornado>"
export ORG_ID="<organization-id>"
export PROJECT_ID="<project-id>"
```

### Teste de Endpoints
```bash
# Listar usuários
curl -X GET http://localhost:8080/user \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Lpe-Organization-Id: $ORG_ID" \
  -H "X-Lpe-Project-Id: $PROJECT_ID"

# Listar mesas
curl -X GET http://localhost:8080/table \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Lpe-Organization-Id: $ORG_ID" \
  -H "X-Lpe-Project-Id: $PROJECT_ID"
```

---

## 📞 Suporte

Para dúvidas sobre a integração:
1. Consulte este documento primeiro
2. Verifique os logs da API para mensagens de erro detalhadas
3. Use ferramentas como Postman ou curl para testar endpoints isoladamente
4. Implemente logging detalhado no frontend para debug

**Base URL:** `http://localhost:8080`
**Documentação da API:** Em desenvolvimento (OpenAPI/Swagger)
**Versão da API:** v1.0

## API Endpoints

### Autenticação
```bash
POST   /login          # Login do usuário
POST   /logout         # Logout do usuário
POST   /checkToken     # Validar token JWT
```

### Usuários (Headers obrigatórios: X-Lpe-Organization-Id, X-Lpe-Project-Id)
```bash
GET    /user/:id       # Buscar usuário por ID
GET    /user/group/:id # Buscar usuários por grupo
POST   /user           # Criar usuário (público)
PUT    /user/:id       # Atualizar usuário
DELETE /user/:id       # Deletar usuário (soft delete)
```

### Produtos (Headers obrigatórios: X-Lpe-Organization-Id, X-Lpe-Project-Id)
```bash
GET    /product/:id           # Buscar produto por ID
GET    /product/purchase/:id  # Buscar produtos por compra
POST   /product              # Criar produto
PUT    /product/:id          # Atualizar produto
DELETE /product/:id          # Deletar produto
```

### Compras (Headers obrigatórios: X-Lpe-Organization-Id, X-Lpe-Project-Id)
```bash
GET    /purchase/:id       # Buscar compra por ID
GET    /purchase/group/:id # Buscar compras por grupo
POST   /purchase           # Criar compra
PUT    /purchase/:id       # Atualizar compra
DELETE /purchase/:id       # Deletar compra
```

### Pedidos (Headers obrigatórios: X-Lpe-Organization-Id, X-Lpe-Project-Id)
```bash
GET    /order/:id    # Buscar pedido por ID
GET    /orders       # Listar pedidos
POST   /order        # Criar pedido
PUT    /order/:id    # Atualizar pedido
DELETE /order/:id    # Deletar pedido
```

### Mesas (Headers obrigatórios: X-Lpe-Organization-Id, X-Lpe-Project-Id)
```bash
GET    /table/:id    # Buscar mesa por ID
GET    /table        # Listar mesas
POST   /table        # Criar mesa
PUT    /table/:id    # Atualizar mesa
DELETE /table/:id    # Deletar mesa
```

### Lista de Espera (Headers obrigatórios: X-Lpe-Organization-Id, X-Lpe-Project-Id)
```bash
GET    /waitlist/:id # Buscar entrada na lista por ID
GET    /waitlist     # Listar entradas da lista de espera
POST   /waitlist     # Criar entrada na lista de espera
PUT    /waitlist/:id # Atualizar entrada na lista de espera
DELETE /waitlist/:id # Remover da lista de espera
```

### Reservas (Headers obrigatórios: X-Lpe-Organization-Id, X-Lpe-Project-Id)
```bash
GET    /reservation/:id # Buscar reserva por ID
GET    /reservation     # Listar reservas
POST   /reservation     # Criar reserva
PUT    /reservation/:id # Atualizar reserva
DELETE /reservation/:id # Cancelar reserva
```

### Clientes (Headers obrigatórios: X-Lpe-Organization-Id, X-Lpe-Project-Id)
```bash
GET    /customer/:id # Buscar cliente por ID
GET    /customer     # Listar clientes
POST   /customer     # Criar cliente
PUT    /customer/:id # Atualizar cliente
DELETE /customer/:id # Deletar cliente
```

### Notificações (Headers obrigatórios: X-Lpe-Organization-Id, X-Lpe-Project-Id)
```bash
# Configuração de Notificações
POST   /notification/config          # Criar/atualizar configuração de evento
GET    /notification/config/:event   # Buscar configuração por evento

# Templates de Notificação
POST   /notification/template        # Criar template
PUT    /notification/template/:id    # Atualizar template
GET    /notification/templates       # Listar templates

# Envio Manual de Notificações
POST   /notification/send           # Enviar notificação manual

# Logs e Histórico
GET    /notification/logs           # Buscar logs de notificações
GET    /notification/logs/:id       # Buscar log específico

# Webhooks (para integração com Twilio)
POST   /notification/webhook/twilio/status    # Status de entrega SMS/WhatsApp
POST   /notification/webhook/twilio/inbound   # Mensagens recebidas
```

### Relatórios (Headers obrigatórios: X-Lpe-Organization-Id, X-Lpe-Project-Id)
```bash
# Relatórios Analíticos
GET    /reports/occupancy          # Relatório de ocupação de mesas
GET    /reports/reservations       # Relatório de reservas
GET    /reports/waitlist           # Relatório de lista de espera
GET    /reports/leads              # Relatório de leads (futuro)

# Exportação
GET    /reports/export/csv         # Exportar relatório em CSV
```

### Headers Obrigatórios (exceto /login e POST /user)
```bash
X-Lpe-Organization-Id: <organization-uuid>
X-Lpe-Project-Id: <project-uuid>
Authorization: Bearer <jwt-token>
```

---

## Sistema de Notificações

### Visão Geral

O LEP System inclui um sistema completo de notificações automatizadas que suporta:
- **SMS** via Twilio
- **WhatsApp Business** via Twilio API
- **Email** via SMTP (Gmail, Outlook, etc.)

### Configuração de Notificações

#### 1. Configuração de Eventos

Para configurar quais eventos irão disparar notificações:

```bash
POST /notification/config
```

**Payload:**
```json
{
  "event_type": "reservation_create",
  "enabled": true,
  "channels": ["sms", "whatsapp", "email"],
  "delay_minutes": 0
}
```

**Eventos Disponíveis:**
- `reservation_create` - Nova reserva criada
- `reservation_update` - Reserva atualizada
- `reservation_cancel` - Reserva cancelada
- `table_available` - Mesa disponível (waitlist)
- `confirmation_24h` - Confirmação 24h antes (automático)

#### 2. Criação de Templates

Para criar templates personalizados para cada canal:

```bash
POST /notification/template
```

**Payload:**
```json
{
  "channel": "sms",
  "event_type": "reservation_create",
  "subject": "Reserva Confirmada",
  "body": "Olá {{nome}}! Sua reserva para {{pessoas}} pessoas na mesa {{mesa}} está confirmada para {{data_hora}}. Até breve!"
}
```

**Variáveis Disponíveis:**
- `{{nome}}` ou `{{cliente}}` - Nome do cliente
- `{{mesa}}` ou `{{numero_mesa}}` - Número da mesa
- `{{data}}` - Data (DD/MM/YYYY)
- `{{hora}}` - Hora (HH:MM)
- `{{data_hora}}` - Data e hora completa
- `{{pessoas}}` - Quantidade de pessoas
- `{{tempo_espera}}` - Tempo estimado de espera
- `{{status}}` - Status da reserva

#### 3. Envio Manual de Notificações

Para enviar notificações pontuais:

```bash
POST /notification/send
```

**Payload:**
```json
{
  "event_type": "reservation_create",
  "entity_type": "reservation",
  "entity_id": "uuid-da-reserva",
  "recipient": "+5511999999999",
  "channel": "sms",
  "variables": {
    "nome": "João Silva",
    "mesa": "5",
    "data_hora": "25/12/2023 às 19:30"
  }
}
```

### Configuração de Webhooks

#### Twilio Webhooks

Para receber atualizações de status e mensagens inbound, configure os webhooks no Twilio:

**Status de Entrega:**
```
URL: https://seu-dominio.com/notification/webhook/twilio/status
Método: POST
```

**Mensagens Recebidas:**
```
URL: https://seu-dominio.com/notification/webhook/twilio/inbound
Método: POST
```

### Configuração do Projeto

Para habilitar notificações em um projeto específico, utilize as configurações:

```json
{
  "notify_reservation_create": true,
  "notify_reservation_update": true,
  "notify_reservation_cancel": true,
  "notify_table_available": true,
  "notify_confirmation_24h": true
}
```

### Logs e Monitoramento

Para acompanhar o envio de notificações:

```bash
GET /notification/logs?limit=50
```

**Resposta:**
```json
{
  "logs": [
    {
      "id": "uuid",
      "event_type": "reservation_create",
      "channel": "sms",
      "recipient": "+5511999999999",
      "status": "sent",
      "external_id": "twilio-message-id",
      "created_at": "2023-12-25T10:00:00Z",
      "delivered_at": "2023-12-25T10:00:05Z"
    }
  ]
}
```

**Status Possíveis:**
- `sent` - Enviado com sucesso
- `delivered` - Entregue ao destinatário
- `failed` - Falha no envio
- `pending` - Aguardando processamento

---
