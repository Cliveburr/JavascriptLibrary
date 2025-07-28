import { test, expect } from '@playwright/test';

test.describe('Memory Management', () => {
    test.beforeEach(async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/dashboard');
    });

    test('should display memories sidebar', async ({ page }) => {
        // Check if sidebar is visible
        await expect(page.locator('.memory-sidebar')).toBeVisible();
        await expect(page.locator('.sidebar-header h2')).toContainText('Memories');

        // Check if add button is visible
        await expect(page.locator('.add-memory-button')).toBeVisible();
    });

    test('should create a new memory', async ({ page }) => {
        // Click add memory button
        await page.click('.add-memory-button');

        // Check if create form is visible
        await expect(page.locator('.create-memory-form')).toBeVisible();

        // Fill memory name
        const memoryName = `Test Memory ${Date.now()}`;
        await page.fill('.create-memory-form input', memoryName);

        // Submit form
        await page.click('.create-memory-form button[type="submit"]');

        // Check if memory appears in list
        await expect(page.locator('.memory-item').filter({ hasText: memoryName })).toBeVisible();

        // Check if form is hidden after creation
        await expect(page.locator('.create-memory-form')).not.toBeVisible();
    });

    test('should select memory and update chat area', async ({ page }) => {
        // Create a test memory first
        await page.click('.add-memory-button');
        const memoryName = `Test Memory ${Date.now()}`;
        await page.fill('.create-memory-form input', memoryName);
        await page.click('.create-memory-form button[type="submit"]');

        // Click on the memory to select it
        await page.locator('.memory-item').filter({ hasText: memoryName }).click();

        // Check if memory is marked as active
        await expect(page.locator('.memory-item.active')).toContainText(memoryName);

        // Check if chat header shows the memory name
        await expect(page.locator('.chat-header h3')).toContainText(memoryName);
    });

    test('should delete memory when more than one exists', async ({ page }) => {
        // Create two test memories
        const memory1 = `Test Memory 1 ${Date.now()}`;
        const memory2 = `Test Memory 2 ${Date.now()}`;

        // Create first memory
        await page.click('.add-memory-button');
        await page.fill('.create-memory-form input', memory1);
        await page.click('.create-memory-form button[type="submit"]');

        // Create second memory
        await page.click('.add-memory-button');
        await page.fill('.create-memory-form input', memory2);
        await page.click('.create-memory-form button[type="submit"]');

        // Try to delete first memory
        await page.locator('.memory-item').filter({ hasText: memory1 }).locator('.delete-memory-button').click();

        // Confirm deletion in dialog
        page.on('dialog', dialog => dialog.accept());

        // Check if memory is removed
        await expect(page.locator('.memory-item').filter({ hasText: memory1 })).not.toBeVisible();

        // Check if second memory is still there
        await expect(page.locator('.memory-item').filter({ hasText: memory2 })).toBeVisible();
    });

    test('should disable delete button when only one memory exists', async ({ page }) => {
        // Get the number of memories
        const memoryItems = page.locator('.memory-item');
        const count = await memoryItems.count();

        // If there's only one memory, delete button should be disabled
        if (count === 1) {
            await expect(memoryItems.first().locator('.delete-memory-button')).toBeDisabled();
        }
    });

    test('should be responsive on mobile viewport', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Check if sidebar is visible
        await expect(page.locator('.memory-sidebar')).toBeVisible();

        // Check if chat area is visible
        await expect(page.locator('.chat-area')).toBeVisible();

        // Test creating memory on mobile
        await page.click('.add-memory-button');
        await expect(page.locator('.create-memory-form')).toBeVisible();

        const memoryName = `Mobile Memory ${Date.now()}`;
        await page.fill('.create-memory-form input', memoryName);
        await page.click('.create-memory-form button[type="submit"]');

        // Memory should be created
        await expect(page.locator('.memory-item').filter({ hasText: memoryName })).toBeVisible();
    });

    test('should maintain minimum width of 320px', async ({ page }) => {
        // Set very small viewport
        await page.setViewportSize({ width: 320, height: 568 });

        // Check if page is still usable
        await expect(page.locator('.memory-sidebar')).toBeVisible();
        await expect(page.locator('.chat-area')).toBeVisible();

        // Should be able to create memory
        await page.click('.add-memory-button');
        const memoryName = `Tiny Memory ${Date.now()}`;
        await page.fill('.create-memory-form input', memoryName);
        await page.click('.create-memory-form button[type="submit"]');

        await expect(page.locator('.memory-item').filter({ hasText: memoryName })).toBeVisible();
    });
});
