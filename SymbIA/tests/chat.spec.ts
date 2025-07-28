import { test, expect } from '@playwright/test';

test.describe('Chat Functionality', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app
        await page.goto('http://localhost:3001');

        // Wait for the app to load
        await page.waitForSelector('[data-testid="app"]');

        // Login (mock authentication)
        await page.fill('[data-testid="email-input"]', 'test@example.com');
        await page.fill('[data-testid="password-input"]', 'password123');
        await page.click('[data-testid="login-button"]');

        // Wait for dashboard to load
        await page.waitForSelector('[data-testid="dashboard"]');

        // Select or create a memory if needed
        const memoryExists = await page.locator('[data-testid="memory-item"]').first().isVisible();
        if (!memoryExists) {
            // Create a new memory
            await page.click('[data-testid="create-memory-button"]');
            await page.fill('[data-testid="memory-name-input"]', 'Test Memory');
            await page.click('[data-testid="confirm-create-memory"]');
        }

        // Select the first memory
        await page.click('[data-testid="memory-item"]');

        // Wait for chat area to be ready
        await page.waitForSelector('[data-testid="chat-input"]');
    });

    test('should send and receive 3 messages without page reload', async ({ page }) => {
        const messages = [
            'Hello, how are you?',
            'Can you help me with a programming question?',
            'Thank you for your help!'
        ];

        // Track that we don't reload the page
        let pageReloaded = false;
        page.on('load', () => {
            pageReloaded = true;
        });

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];

            // Type message
            await page.fill('[data-testid="chat-input"]', message);

            // Send message
            await page.click('[data-testid="send-button"]');

            // Wait for user message to appear
            await expect(page.locator('[data-testid="message"]').filter({ hasText: message })).toBeVisible();

            // Wait for AI response (should appear as assistant message)
            await page.waitForSelector('[data-testid="message"][data-role="assistant"]', {
                timeout: 10000
            });

            // Verify assistant message is visible
            const assistantMessages = page.locator('[data-testid="message"][data-role="assistant"]');
            await expect(assistantMessages).toHaveCount(i + 1);

            // Verify input is cleared after sending
            await expect(page.locator('[data-testid="chat-input"]')).toHaveValue('');

            // Verify loading state is gone
            await expect(page.locator('[data-testid="typing-indicator"]')).toBeHidden();
        }

        // Verify we have 3 user messages and 3 assistant messages
        await expect(page.locator('[data-testid="message"][data-role="user"]')).toHaveCount(3);
        await expect(page.locator('[data-testid="message"][data-role="assistant"]')).toHaveCount(3);

        // Verify page didn't reload
        expect(pageReloaded).toBe(false);

        // Verify auto-scroll to bottom - last message should be visible
        const lastMessage = page.locator('[data-testid="message"]').last();
        await expect(lastMessage).toBeInViewport();
    });

    test('should auto-scroll to bottom when new messages arrive', async ({ page }) => {
        // Send a message to get some content
        await page.fill('[data-testid="chat-input"]', 'First message');
        await page.click('[data-testid="send-button"]');

        // Wait for response
        await page.waitForSelector('[data-testid="message"][data-role="assistant"]');

        // Scroll up manually
        await page.locator('[data-testid="messages-container"]').evaluate(el => {
            el.scrollTop = 0;
        });

        // Send another message
        await page.fill('[data-testid="chat-input"]', 'Second message');
        await page.click('[data-testid="send-button"]');

        // Wait for response
        await page.waitForSelector('[data-testid="message"][data-role="assistant"]', {
            timeout: 10000
        });

        // Verify the page auto-scrolled to bottom (last message should be visible)
        const lastMessage = page.locator('[data-testid="message"]').last();
        await expect(lastMessage).toBeInViewport();
    });

    test('should show typing indicator while waiting for response', async ({ page }) => {
        // Send a message
        await page.fill('[data-testid="chat-input"]', 'Test message');
        await page.click('[data-testid="send-button"]');

        // Verify typing indicator appears
        await expect(page.locator('[data-testid="typing-indicator"]')).toBeVisible();

        // Wait for response and verify typing indicator disappears
        await page.waitForSelector('[data-testid="message"][data-role="assistant"]');
        await expect(page.locator('[data-testid="typing-indicator"]')).toBeHidden();
    });

    test('should handle Enter key to send messages', async ({ page }) => {
        // Type message
        await page.fill('[data-testid="chat-input"]', 'Message sent with Enter');

        // Press Enter to send
        await page.press('[data-testid="chat-input"]', 'Enter');

        // Verify message was sent
        await expect(page.locator('[data-testid="message"]').filter({ hasText: 'Message sent with Enter' })).toBeVisible();

        // Verify response
        await page.waitForSelector('[data-testid="message"][data-role="assistant"]');
        await expect(page.locator('[data-testid="message"][data-role="assistant"]')).toHaveCount(1);
    });

    test('should handle Shift+Enter for new lines', async ({ page }) => {
        // Type multi-line message
        await page.fill('[data-testid="chat-input"]', 'Line 1');
        await page.press('[data-testid="chat-input"]', 'Shift+Enter');
        await page.type('[data-testid="chat-input"]', 'Line 2');

        // Send message
        await page.click('[data-testid="send-button"]');

        // Verify multi-line message was sent
        await expect(page.locator('[data-testid="message"]').filter({ hasText: 'Line 1\nLine 2' })).toBeVisible();
    });
});
