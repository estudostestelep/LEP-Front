# Scripts de Seed - LEP System

Este diretório contém scripts para popular a aplicação com dados iniciais.

## 📋 O que o Seed cria?

O script `seed.ts` cria dados de exemplo para:

### 🏷️ Tags (8 tags)
- Sem Glúten
- Vegetariano
- Vegano
- Sem Lactose
- Picante
- Orgânico
- Low Carb
- Fit

### 📋 Menus (3 menus)
- Cardápio Principal
- Menu Executivo
- Carta de Vinhos

### 📁 Categorias (7 categorias)
- Entradas
- Pratos Principais
- Massas
- Carnes
- Peixes e Frutos do Mar
- Sobremesas
- Bebidas

### 🗂️ Subcategorias (8 subcategorias)
- Saladas
- Sopas
- Massas Artesanais
- Risotos
- Grelhados
- Assados
- Tortas e Bolos
- Sorvetes

### 🍽️ Produtos (7 produtos)
**Pratos:**
- Risoto de Cogumelos (R$ 58,90)
- Salmão Grelhado (R$ 78,90)
- Picanha na Brasa (R$ 89,90)

**Bebidas:**
- Suco Natural de Laranja (R$ 12,90)
- Cerveja Artesanal IPA (R$ 18,90)

**Vinhos:**
- Cabernet Sauvignon Reserva (R$ 120,00)
- Chardonnay Premium (R$ 95,00)

### 🔗 Relacionamentos
- Tags vinculadas aos produtos
- Produtos organizados em categorias e subcategorias
- Menus com categorias associadas

---

## 🚀 Como Executar

### Pré-requisitos

1. **Backend rodando:**
   ```bash
   cd ../LEP-Back
   go run main.go
   ```
   O backend deve estar rodando em `https://lep-system-516622888070.us-central1.run.app`

2. **Autenticação:**
   Você precisará de um token JWT válido e IDs de organização/projeto.

### Passo 1: Obter Token e IDs

Primeiro, faça login na aplicação para obter um token:

```bash
curl -X POST https://lep-system-516622888070.us-central1.run.app/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu-email@exemplo.com",
    "password": "sua-senha"
  }'
```

A resposta conterá:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "organization_id": "org-123",
    "project_id": "proj-456"
  }
}
```

### Passo 2: Atualizar o Script

Edite o arquivo `seed.ts` e atualize as seguintes linhas (linha ~14-17):

```typescript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer SEU_TOKEN_AQUI', // ← Cole seu token aqui
  'X-Lpe-Organization-Id': 'org-123',       // ← Cole seu organization_id aqui
  'X-Lpe-Project-Id': 'proj-456'            // ← Cole seu project_id aqui
};
```

### Passo 3: Instalar ts-node (se necessário)

```bash
npm install -g ts-node typescript
# ou
npm install --save-dev ts-node @types/node
```

### Passo 4: Executar o Seed

```bash
# Do diretório raiz do frontend
npx ts-node scripts/seed.ts
```

---

## 📊 Saída Esperada

```
🌱 Iniciando Seed...

⚠️  ATENÇÃO: Certifique-se de que:
  1. O backend está rodando em https://lep-system-516622888070.us-central1.run.app
  2. Você atualizou o token JWT e IDs de org/project no início deste arquivo
  3. O usuário tem permissões para criar esses recursos

✅ Conexão com backend OK

🏷️  Criando Tags...
  ✅ Tag criada: Sem Glúten
  ✅ Tag criada: Vegetariano
  ✅ Tag criada: Vegano
  ...

📋 Criando Menus...
  ✅ Menu criado: Cardápio Principal
  ✅ Menu criado: Menu Executivo
  ✅ Menu criado: Carta de Vinhos

📁 Criando Categorias...
  ✅ Categoria criada: Entradas
  ✅ Categoria criada: Pratos Principais
  ...

🗂️  Criando Subcategorias...
  ✅ Subcategoria criada: Saladas
  ✅ Subcategoria criada: Sopas
  ...

🍽️  Criando Produtos...
  ✅ Produto criado: Risoto de Cogumelos (prato)
  ✅ Produto criado: Salmão Grelhado (prato)
  ✅ Produto criado: Cabernet Sauvignon Reserva (vinho)
  ...

🔗 Vinculando Tags aos Produtos...
  ✅ Tag vinculada ao produto 0
  ✅ Tag vinculada ao produto 1
  ...

✅ Seed concluído com sucesso!

📊 Resumo:
  Tags: 8
  Menus: 3

🎉 Dados iniciais criados! Você pode acessar a aplicação agora.
```

---

## ❌ Troubleshooting

### Erro: "Cannot connect to backend"
- Verifique se o backend está rodando em `https://lep-system-516622888070.us-central1.run.app`
- Teste com: `curl https://lep-system-516622888070.us-central1.run.app/ping`

### Erro: "Unauthorized" ou "Invalid token"
- Seu token JWT pode ter expirado
- Faça login novamente e obtenha um novo token

### Erro: "Headers validation failed"
- Verifique se os IDs de `organization_id` e `project_id` estão corretos
- Eles devem corresponder ao usuário autenticado

### Erro: "Already exists"
- Alguns dados podem já existir no banco
- Isso é normal se você já executou o seed antes
- Você pode ignorar esses erros

---

## 🔄 Executar Novamente

Se quiser executar o seed novamente:

1. **Opção 1:** Limpe o banco de dados manualmente
2. **Opção 2:** Ignore os erros de "já existe" - o script continuará criando o que puder
3. **Opção 3:** Modifique o script para usar nomes diferentes

---

## 📝 Personalização

Para personalizar os dados criados, edite as constantes em `seed.ts`:

- `TAG_COLORS` - Cores das tags
- `tags` - Lista de tags a criar
- `menus` - Lista de menus a criar
- `categories` - Lista de categorias a criar
- `products` - Lista de produtos a criar

---

## 🎯 Próximos Passos

Após executar o seed com sucesso:

1. Acesse `http://localhost:5173/admin-menu` para ver os menus
2. Acesse `http://localhost:5173/tags` para ver as tags
3. Acesse `http://localhost:5173/products` para ver os produtos
4. Explore as categorias e subcategorias dentro de cada menu

---

## 💡 Dicas

- O seed cria dados **realistas** para demonstração
- Todos os preços são em Reais (R$)
- Os vinhos incluem informações completas (safra, uvas, região, etc.)
- As tags são automaticamente vinculadas a produtos relevantes
- Você pode executar este seed em ambientes de desenvolvimento e staging

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do backend para erros detalhados
2. Verifique se todas as tabelas existem no banco de dados
3. Verifique se as migrations foram executadas
4. Consulte a documentação do backend em `../LEP-Back/README.md`
