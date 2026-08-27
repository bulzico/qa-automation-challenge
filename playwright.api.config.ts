import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/api',
  timeout: 15_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { outputFolder: 'reports/playwright', open: 'never' }], ['list']],
  use: {
    baseURL: process.env.API_BASE_URL ?? 'http://127.0.0.1:3000',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'node src/mock-api/server.mjs',
    url: 'http://127.0.0.1:3000/health',
    reuseExistingServer: !process.env.CI,
    timeout: 15_000
  }
});
