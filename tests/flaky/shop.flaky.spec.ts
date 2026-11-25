import { test, expect } from '@playwright/test';

// Each test below passes on a fast, idle laptop and fails under CI-like load.
// The fixed versions live in tests/fixed/shop.spec.ts.

test('price loads (anti-pattern: fixed sleep + tiny timeout)', async ({ page }) => {
  await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(120); // "should be enough"
  await expect(page.locator('#price')).toHaveText('19 EUR', { timeout: 30 });
});

test('three items render (anti-pattern: non-retrying count)', async ({ page }) => {
  await page.goto('/index.html');
  await page.waitForTimeout(150);
  // count() reads the DOM once. If the fetch is not done yet, it's 0.
  expect(await page.locator('.item').count()).toBe(3);
});

test('buy button shows (anti-pattern: isVisible snapshot)', async ({ page }) => {
  await page.goto('/index.html');
  await page.waitForTimeout(150);
  // isVisible() is a one-time check, not an assertion that waits.
  expect(await page.locator('#buy').isVisible()).toBe(true);
});
