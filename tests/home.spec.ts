import { test, expect } from '@playwright/test';

test('Page title is correct', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');
    await expect(page).toHaveTitle(/Free Security Tools/i);
});

test('Header contains expected text', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');
    await expect(page.locator('h1')).toContainText('Security');
});

test('Each row has name and severity', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');

    const rows = page.locator('tbody tr');
    const count = await rows.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
        const row = rows.nth(i);

        const count = await row.locator('td').count();

        expect(count).toBeGreaterThan(0);
    }
});