import { test, expect } from '@playwright/test';

test('Page title is correct', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');
    await expect(page).toHaveTitle(/Free Security Tools/i);
});

test('Header contains expected text', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');
    await expect(page.locator('h1')).toContainText('Security');
});