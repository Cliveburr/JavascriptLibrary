import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3001',
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],

    webServer: [
        {
            command: 'pnpm --filter @symbia/api dev',
            port: 3000,
            reuseExistingServer: !process.env.CI,
        },
        {
            command: 'pnpm --filter @symbia/web dev',
            port: 3001,
            reuseExistingServer: !process.env.CI,
        },
    ],
});
