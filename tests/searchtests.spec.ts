import { test, expect } from '@playwright/test';



/*test('Arama kutusu doldurulabiliyor', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');
    await page.fill('input[placeholder*="example.io"]', 'example.com');
    const inputValue = await page.locator('input[placeholder*="example.io"]').inputValue();
    expect(inputValue).toBe('example.com');
});*/


test('When scan button is clicked with empty ip, popup screen is displayed', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');

    // Butona bas (input dolu değil)
    await page.click('button:has-text("Start Full Scan")');

    // Popup başlığındaki metne göre kontrol (safe & stable)
    const popup = page.locator('text=Scan Only One: Domain, Ipv4, Subdomain');
    await expect(popup).toBeVisible();
});

test('IP adres input alanı doldurulabiliyor', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');

    const ipInput = page.locator('input[placeholder*="example.io"]');
    await ipInput.fill('1.1.1.1');
    const value = await ipInput.inputValue();

    expect(value).toBe('1.1.1.1');
});

test('Valid IP input prevents popup', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');

    // Safely pick the first matching input field
    const ipInput = page
        .locator('input[placeholder*="example.io"]')
        .first(); // ✅ picks the one in the correct scan box

    await ipInput.fill('8.8.8.8');
    await page.click('button:has-text("Start Full Scan")');

    // Wait for a brief moment in case of UI animation
    await page.waitForTimeout(500);

    const popup = page.locator('text=Scan Only One: Domain, Ipv4, Subdomain');
    await expect(popup).toHaveCount(0);
});

test('Popup appears for invalid input', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');

    // Target the correct input — first one on page
    const ipInput = page
        .locator('input[placeholder*="example.io"]')
        .first();

    await ipInput.fill('!@#%^&*()'); // 🚨 clearly invalid
    await page.click('button:has-text("Start Full Scan")');

    const popup = page.locator('text=Scan Only One: Domain, Ipv4, Subdomain');
    await expect(popup).toBeVisible();
});


test('Araçlar tablosu satır içeriyor', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');
    const rows = page.locator('tbody tr'); // table içindeki satırlar
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
});


/*

test('Search shows results for valid query', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');
    await page.fill('input[name="search"]', 'firewall');
    await page.click('button:text("Search")');

    const results = page.locator('.result');
    const count = await results.count();

    expect(count).toBeGreaterThan(0);
});*/
