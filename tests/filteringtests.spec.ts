
import { test, expect } from '@playwright/test';

test('Only Critical rows remain in “All Free Tools” after filtering', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');


    await page.locator('button:has-text("Severity")').click({ force: true });


    const menu = page.locator('.MuiPopover-paper');
    await menu.locator('li[role="menuitem"]:has-text("Critical")').click();


    await page.keyboard.press('Escape');   // or menu.locator('.MuiBackdrop-root').click({force:true})
    const toolsTable = page
        .locator('section:has(h2:has-text("All Free Tools"))')
        .locator('table');

    const rows = toolsTable.locator('tbody tr');

    const count = await rows.count();
    expect(count).toBeGreaterThan(0);

    const chips = rows.locator('.MuiChip-label');
    const total = await chips.count();
    for (let i = 0; i < total; i++)
        expect((await chips.nth(i).innerText()).trim()).toBe('Critical');
});