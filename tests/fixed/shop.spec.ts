import { test, expect } from '@playwright/test';

// Same checks as tests/flaky, written so they wait for the state they assert.
// No sleeps: web-first assertions retry until the default timeout.

test('price loads', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('#price')).toHaveText('19 EUR');
});

test('three items render', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('.item')).toHaveCount(3);
});

test('buy button shows', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('#buy')).toBeVisible();
});

test('price comes from the API response, not from timing', async ({ page }) => {
  const response = page.waitForResponse(r => r.url().endsWith('/api.json') && r.ok());
  await page.goto('/index.html');
  const data = await (await response).json();
  await expect(page.locator('#price')).toHaveText(data.price);
});
