import { test, expect } from '@playwright/test';

test.describe('Order Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        organization_id: 'org-123',
        project_id: 'project-123',
        permissions: ['read', 'write', 'create', 'delete']
      }));
    });

    // Mock API endpoints
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

    await page.route('**/product', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'product-1',
            name: 'Pizza Margherita',
            price: 25.90,
            available: true,
            prep_time_minutes: 20
          },
          {
            id: 'product-2',
            name: 'Hambúrguer',
            price: 18.50,
            available: true,
            prep_time_minutes: 15
          }
        ])
      });
    });

    await page.route('**/table', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'table-1',
            number: 1,
            capacity: 4,
            status: 'livre'
          },
          {
            id: 'table-2',
            number: 2,
            capacity: 2,
            status: 'livre'
          }
        ])
      });
    });

    await page.route('**/customer', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'customer-1',
            name: 'João Silva',
            phone: '(11) 99999-9999'
          },
          {
            id: 'customer-2',
            name: 'Maria Santos',
            phone: '(11) 88888-8888'
          }
        ])
      });
    });

    await page.goto('/orders');
  });

  test('should create a new order successfully', async ({ page }) => {
    // Mock successful order creation
    await page.route('**/order', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'order-123',
            items: [
              {
                product_id: 'product-1',
                quantity: 2,
                product_name: 'Pizza Margherita'
              }
            ],
            customer_id: 'customer-1',
            table_id: 'table-1',
            total_amount: 51.80
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    // Click "New Order" button
    await page.getByRole('button', { name: /novo pedido/i }).click();

    // Wait for form to load
    await expect(page.getByText(/novo pedido/i)).toBeVisible();

    // Select a table
    await page.getByDisplayValue('Selecione uma mesa').selectOption('table-1');

    // Select a customer
    await page.getByDisplayValue('Selecione um cliente (opcional)').selectOption('customer-1');

    // Add a product
    await page.getByDisplayValue('Selecione um produto').selectOption('product-1');
    await page.getByRole('button', { name: '+' }).first().click();

    // Verify product was added
    await expect(page.getByText('Pizza Margherita')).toBeVisible();
    await expect(page.getByText('R$ 25,90 cada')).toBeVisible();

    // Increase quantity
    const increaseButtons = page.getByRole('button', { name: '+' });
    await increaseButtons.nth(1).click(); // Second + button (for quantity)

    // Verify total calculation
    await expect(page.getByText('R$ 51,80')).toBeVisible();

    // Submit the order
    await page.getByRole('button', { name: /criar pedido/i }).click();

    // Should redirect to orders list
    await expect(page.getByText(/pedido criado com sucesso/i)).toBeVisible();
  });

  test('should prevent submission without items', async ({ page }) => {
    await page.getByRole('button', { name: /novo pedido/i }).click();

    // Try to submit without adding items
    const submitButton = page.getByRole('button', { name: /criar pedido/i });
    await expect(submitButton).toBeDisabled();
  });

  test('should calculate total price correctly', async ({ page }) => {
    await page.getByRole('button', { name: /novo pedido/i }).click();

    // Add Pizza Margherita (R$ 25,90)
    await page.getByDisplayValue('Selecione um produto').selectOption('product-1');
    await page.getByRole('button', { name: '+' }).first().click();

    // Increase quantity to 2
    const increaseButtons = page.getByRole('button', { name: '+' });
    await increaseButtons.nth(1).click();

    // Add Hambúrguer (R$ 18,50)
    await page.getByDisplayValue('Selecione um produto').selectOption('product-2');
    await page.getByRole('button', { name: '+' }).first().click();

    // Check total: (25.90 * 2) + (18.50 * 1) = 70.30
    await expect(page.getByText('R$ 70,30')).toBeVisible();
  });

  test('should remove items from order', async ({ page }) => {
    await page.getByRole('button', { name: /novo pedido/i }).click();

    // Add a product
    await page.getByDisplayValue('Selecione um produto').selectOption('product-1');
    await page.getByRole('button', { name: '+' }).first().click();

    // Verify item was added
    await expect(page.getByText('Pizza Margherita')).toBeVisible();

    // Remove the item
    await page.getByRole('button', { name: /delete/i }).click();

    // Verify item was removed
    await expect(page.getByText('Pizza Margherita')).not.toBeVisible();

    // Submit button should be disabled again
    const submitButton = page.getByRole('button', { name: /criar pedido/i });
    await expect(submitButton).toBeDisabled();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/order', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal server error' })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    await page.getByRole('button', { name: /novo pedido/i }).click();

    // Add a product and submit
    await page.getByDisplayValue('Selecione um produto').selectOption('product-1');
    await page.getByRole('button', { name: '+' }).first().click();
    await page.getByRole('button', { name: /criar pedido/i }).click();

    // Should show error message
    await expect(page.getByText(/erro ao salvar pedido/i)).toBeVisible();
  });

  test('should show loading states', async ({ page }) => {
    // Mock delayed product loading
    await page.route('**/product', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.getByRole('button', { name: /novo pedido/i }).click();

    // Product select should be disabled while loading
    const productSelect = page.getByDisplayValue('Selecione um produto');
    await expect(productSelect).toBeDisabled();
  });

  test('should validate required fields', async ({ page }) => {
    await page.getByRole('button', { name: /novo pedido/i }).click();

    // Add an item but don't select table
    await page.getByDisplayValue('Selecione um produto').selectOption('product-1');
    await page.getByRole('button', { name: '+' }).first().click();

    // Try to submit
    await page.getByRole('button', { name: /criar pedido/i }).click();

    // Should show validation message or prevent submission
    // This depends on your validation implementation
  });
});