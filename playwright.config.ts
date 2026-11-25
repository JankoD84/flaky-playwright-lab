import { defineConfig } from '@playwright/test';

const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  timeout: 15_000,
  reporter: process.env.CI ? [['list'], ['junit', { outputFile: 'test-results/junit.xml' }], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4791',
    trace: 'retain-on-failure',
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    { name: 'fixed', testDir: './tests/fixed', use: { browserName: 'chromium' } },
    { name: 'flaky', testDir: './tests/flaky', use: { browserName: 'chromium' } },
  ],
  webServer: {
    command: 'python3 -m http.server 4791 --bind 127.0.0.1 --directory site',
    url: 'http://127.0.0.1:4791/index.html',
    reuseExistingServer: !process.env.CI,
  },
});
