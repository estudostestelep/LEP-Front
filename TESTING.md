# 🧪 Testing Guide - LEP Frontend

Este documento descreve a estratégia de testes e como executá-los no projeto LEP Frontend.

## 📋 Visão Geral

O projeto utiliza uma estratégia de testes em múltiplas camadas:

- **Unit Tests**: Testes de componentes e funções isoladas
- **Integration Tests**: Testes de fluxos completos de usuário
- **Component Tests**: Testes de componentes React
- **E2E Tests**: Testes end-to-end com Playwright

## 🛠️ Ferramentas Utilizadas

- **Vitest**: Framework de testes para unit/integration tests
- **Testing Library**: Utilitários para testar componentes React
- **Playwright**: Framework para testes E2E
- **@vitest/coverage-v8**: Coverage de código

## 🚀 Comandos de Teste

### Testes Unitários e de Integração

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes uma vez (CI)
npm run test:run

# Executar testes com coverage
npm run test:coverage

# Interface visual para testes
npm run test:ui

# Interface visual com coverage
npm run test:coverage:ui
```

### Testes E2E

```bash
# Executar testes E2E
npm run test:e2e

# Interface visual para E2E
npm run test:e2e:ui

# Debug de testes E2E
npm run test:e2e:debug
```

## 📁 Estrutura de Testes

```
src/
├── api/__tests__/           # Testes dos serviços de API
├── components/__tests__/    # Testes de componentes
├── context/__tests__/       # Testes de contextos
├── hooks/__tests__/         # Testes de hooks customizados
├── test/                    # Utilitários e setup de testes
│   ├── setup.ts            # Configuração global
│   ├── utils.tsx           # Helpers para testes
│   └── integration/        # Testes de integração
e2e/                        # Testes end-to-end
├── login.spec.ts
└── order-flow.spec.ts
```

## 🧩 Tipos de Teste

### 1. Unit Tests - Serviços de API

Testam a lógica dos serviços de API isoladamente:

```typescript
// Exemplo: src/api/__tests__/userService.test.ts
describe('userService', () => {
  it('should fetch all users', async () => {
    mockApi.get.mockResolvedValue({ data: mockUsers })
    const result = await userService.getAll()
    expect(result.data).toEqual(mockUsers)
  })
})
```

### 2. Component Tests

Testam componentes React isoladamente:

```typescript
// Exemplo: src/components/__tests__/Button.test.tsx
describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

### 3. Integration Tests

Testam fluxos completos envolvendo múltiplos componentes:

```typescript
// Exemplo: src/test/integration/auth-flow.test.tsx
describe('Authentication Flow', () => {
  it('successfully logs in user', async () => {
    // Testa todo o fluxo de login
  })
})
```

### 4. Context/Hook Tests

Testam contextos e hooks customizados:

```typescript
// Exemplo: src/context/__tests__/authContext.test.tsx
describe('AuthContext', () => {
  it('provides authentication state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    // ...
  })
})
```

### 5. E2E Tests

Testam a aplicação completa em um navegador real:

```typescript
// Exemplo: e2e/login.spec.ts
test('should login successfully', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[placeholder*="email"]', 'user@example.com')
  // ...
})
```

## ⚙️ Configuração

### Vitest (vitest.config.ts)

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    }
  }
})
```

### Playwright (playwright.config.ts)

```typescript
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173'
  }
})
```

## 🎯 Estratégias de Mock

### API Mocking

```typescript
// Mock do serviço de API
vi.mock('@/api/userService', () => ({
  userService: {
    getAll: vi.fn(),
    create: vi.fn(),
    // ...
  }
}))
```

### Context Mocking

```typescript
// Mock do AuthContext
vi.mock('@/context/authContext', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn()
  })
}))
```

### LocalStorage Mocking

```typescript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})
```

## 📊 Coverage

O projeto está configurado com thresholds de coverage:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Executar Coverage

```bash
npm run test:coverage
```

Os relatórios são gerados em:
- **Terminal**: Sumário no console
- **HTML**: `coverage/index.html`
- **JSON**: `coverage/coverage.json`

## 🔧 Debugging

### Debug Unit Tests

```bash
# Com breakpoints no VS Code
npm run test:watch

# Interface visual
npm run test:ui
```

### Debug E2E Tests

```bash
# Modo debug step-by-step
npm run test:e2e:debug

# Interface visual
npm run test:e2e:ui
```

## 🏃‍♂️ CI/CD

### GitHub Actions Example

```yaml
- name: Run Unit Tests
  run: npm run test:run

- name: Run E2E Tests
  run: npm run test:e2e

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/coverage.json
```

## 📝 Boas Práticas

### 1. Estrutura de Testes

- Use `describe` para agrupar testes relacionados
- Use nomes descritivos para os testes
- Siga o padrão AAA (Arrange, Act, Assert)

### 2. Mocking

- Mock apenas o que é necessário
- Use mocks realistas
- Limpe mocks entre testes

### 3. Assertions

- Use matchers específicos (`toBeInTheDocument` vs `toBeTruthy`)
- Teste comportamentos, não implementação
- Use `waitFor` para operações assíncronas

### 4. E2E Tests

- Use seletores estáveis (roles, labels)
- Mock APIs externas
- Teste fluxos críticos de usuário

## 🐛 Troubleshooting

### Problemas Comuns

1. **Tests timeout**: Aumente o timeout em `vitest.config.ts`
2. **DOM não encontrado**: Verifique se `jsdom` está configurado
3. **Mocks não funcionam**: Verifique a ordem dos imports
4. **E2E instável**: Use `waitFor` e seletores mais específicos

### Logs Úteis

```bash
# Debug verbose do Vitest
npm run test -- --reporter=verbose

# Debug do Playwright
npm run test:e2e -- --debug
```

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

*Para mais informações sobre testes específicos, consulte os arquivos de teste correspondentes.*