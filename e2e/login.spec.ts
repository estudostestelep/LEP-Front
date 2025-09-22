import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /entrar/i })).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/senha/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: /entrar/i }).click();

    await expect(page.getByText(/email é obrigatório/i)).toBeVisible();
    await expect(page.getByText(/senha é obrigatória/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Mock the API response for failed login
    await page.route('**/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Credenciais inválidas' })
      });
    });

    await page.getByPlaceholder(/email/i).fill('wrong@example.com');
    await page.getByPlaceholder(/senha/i).fill('wrongpassword');
    await page.getByRole('button', { name: /entrar/i }).click();

    await expect(page.getByText(/credenciais inválidas/i)).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Mock successful login response
    await page.route('**/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-jwt-token',
          user: {
            id: 'user-123',
            name: 'John Doe',
            email: 'john@example.com',
            organization_id: 'org-123',
            project_id: 'project-123',
            permissions: ['read', 'write']
          }
        })
      });
    });

    // Mock check token endpoint for after login
    await page.route('**/checkToken', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com'
        })
      });
    });

    await page.getByPlaceholder(/email/i).fill('john@example.com');
    await page.getByPlaceholder(/senha/i).fill('password123');
    await page.getByRole('button', { name: /entrar/i }).click();

    // Should redirect to home page
    await expect(page).toHaveURL('/');

    // Should show user interface elements (assuming navbar shows user info)
    await expect(page.getByText('John Doe')).toBeVisible();
  });

  test('should disable form during submission', async ({ page }) => {
    // Mock a delayed response
    await page.route('**/login', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'token', user: {} })
      });
    });

    await page.getByPlaceholder(/email/i).fill('john@example.com');
    await page.getByPlaceholder(/senha/i).fill('password123');

    const submitButton = page.getByRole('button', { name: /entrar/i });
    await submitButton.click();

    // Button should be disabled and show loading state
    await expect(submitButton).toBeDisabled();
    await expect(page.getByText(/entrando/i)).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.getByPlaceholder(/email/i).fill('invalid-email');
    await page.getByPlaceholder(/senha/i).fill('password123');
    await page.getByRole('button', { name: /entrar/i }).click();

    await expect(page.getByText(/email inválido/i)).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/login', async route => {
      await route.abort('failed');
    });

    await page.getByPlaceholder(/email/i).fill('john@example.com');
    await page.getByPlaceholder(/senha/i).fill('password123');
    await page.getByRole('button', { name: /entrar/i }).click();

    await expect(page.getByText(/erro de conexão/i)).toBeVisible();
  });
});