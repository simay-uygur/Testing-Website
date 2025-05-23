
import {test, expect, request} from '@playwright/test';

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


//not workng
test('clicking a severity chip filters All-Free-Tools table', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');
    const targetSeverity = 'Medium';     // or "Info" / "Low" / …

    /* ── click the chip in the Full-scan list ─────────────────────────── */
    const chip = page
        .locator('h5:has-text("Full scan")')
        .locator('xpath=following::table[1]')
        .locator(`tbody tr td:nth-child(3) .MuiChip-label:text("${targetSeverity}")`)
        .first()
        .locator('xpath=ancestor::div[@role="button"]');

    // The page will fire an XHR that contains ?severity=<level>
    const [ _response ] = await Promise.all([
        page.waitForResponse(r =>
            r.url().includes('/api/tools') &&
            r.url().includes(`severity=${targetSeverity.toLowerCase()}`) &&
            r.status() === 200
        ),
        chip.click({ force: true })
    ]);

    /* ── scroll All-Free-Tools card into view so rows mount ───────────── */
    await page.locator('#tools-table-view').scrollIntoViewIfNeeded();

    /* ── wait until at least one row appears ──────────────────────────── */
    const rows = page.locator('#tools-table-view table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0 );

    //await expect(rows).toHaveCountGreaterThan(0, { timeout: 10_000 });

    /* ── every chip in column-3 must match severity ───────────────────── */
    const chips = rows.locator('td:nth-child(3) .MuiChip-label');
    const n = await chips.count();
    for (let i = 0; i < n; i++) {
        expect((await chips.nth(i).innerText()).trim()).toBe(targetSeverity);
    }
});

test('Invalid domain → 404 (HTML)', async () => {
    const api = await request.newContext();
    const res = await api.get('https://s4e.io/api/tools?scanType=full&domain=not_a_valid_domain');
    expect(res.status()).toBe(404);

    const text = await res.text();
    // it contains the standard 404 heading
    expect(text).toContain('<!DOCTYPE html>');
    expect(text).toContain('404');
});




/*
test('Clicking “Last run” sorts the All Free Tools table by descending date', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');

    const table = page
        .locator('section:has(h2:has-text("All Free Tools"))')
        .locator('table');

    // Trigger sort
    await table.locator('th:has-text("Last Run")').click();
    await page.waitForTimeout(500);

    // Grab and parse all dates from the 6th column
    const dateCells = await table.locator('tbody tr td:nth-child(6)').allTextContents();
    const dates = dateCells.map(txt => new Date(txt));

    // Assert each date is >= the next
    for (let i = 0; i + 1 < dates.length; i++) {
        expect(dates[i].getTime()).toBeGreaterThanOrEqual(dates[i + 1].getTime());
    }
});
/!*

 *!/

test('Toggle Full scan vs Sample scan filters table rows', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');

    // Helper to assert scan-type in a given section
    const assertScanType = async (tabText: string, expectedScanType: string) => {
        // click the tab
        await page.locator(`h5:has-text("${tabText}")`).click();
        // wait for table to re-render
        await page.waitForTimeout(500);

        // scope to the “All Free Tools” table
        const rows = page
            .locator('section:has(h2:has-text("All Free Tools")) table tbody tr');

        const count = await rows.count();
        expect(count).toBeGreaterThan(0);

        // verify the 4th <td> text in each row
        for (let i = 0; i < await rows.count(); i++) {
            const scanType = await rows.nth(i).locator('td:nth-child(4)').innerText();
            expect(scanType.trim()).toBe(expectedScanType);
        }
    };

    await assertScanType('Full scan',    'Full Scan');
    await assertScanType('Sample scan',  'Sample Scan');
});*/



test('GET /api/tools?scanType=full returns valid tool objects', async () => {
    const api = await request.newContext();
    // include the same query param your UI uses
    const res = await api.get('https://s4e.io/api/tools?scanType=full');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/application\/json/);

    const tools = await res.json();
    expect(Array.isArray(tools)).toBe(true);
    expect(tools.length).toBeGreaterThan(0);

    // spot-check shape
    expect(tools[0]).toMatchObject({
        domain: expect.any(String),
        toolName: expect.any(String),
        severity: expect.stringMatching(/Info|Low|Medium|High|Critical/),
        scanType: 'Full Scan',
        status: expect.any(String),
        lastRun: expect.any(String),
    });
});

