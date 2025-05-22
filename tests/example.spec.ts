import { test, expect } from '@playwright/test';

test('Is page header correct?', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');
    await expect(page).toHaveTitle(/Free Security Tools/i);
});