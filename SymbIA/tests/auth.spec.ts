import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should redirect to login when not authenticated', async ({ page }) => {
        await expect(page).toHaveURL('/login');
    });

    test('should login successfully with valid credentials', async ({ page }) => {
        await page.goto('/login');

        // Fill login form
        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'password123');

        // Submit form
        await page.click('button[type="submit"]');

        // Should redirect to dashboard
        await expect(page).toHaveURL('/dashboard');

        // Should show user email in header
        await expect(page.locator('.user-email')).toContainText('test@example.com');
    });

    test('should show error with invalid credentials', async ({ page }) => {
        await page.goto('/login');

        // Fill login form with invalid credentials
        await page.fill('input[type="email"]', 'invalid@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');

        // Submit form
        await page.click('button[type="submit"]');

        // Should show error message
        await expect(page.locator('.error-message')).toBeVisible();
        await expect(page.locator('.error-message')).toContainText('Invalid email or password');

        // Should stay on login page
        await expect(page).toHaveURL('/login');
    });

    test('should logout successfully', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');

        // Wait for dashboard
        await expect(page).toHaveURL('/dashboard');

        // Click logout
        await page.click('.logout-button');

        // Should redirect to login
        await expect(page).toHaveURL('/login');
    });
});
