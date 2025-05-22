import { test, expect } from '@playwright/test';



test('When scan button is clicked with empty ip, popup screen is displayed', async ({ page }) => {
    await page.goto('https://s4e.io/free-security-tools');

    // Butona bas (input dolu değil)
    await page.click('button:has-text("Start Full Scan")');

    // Popup başlığındaki metne göre kontrol (safe & stable)
    const popup = page.locator('text=Scan Only One: Domain, Ipv4, Subdomain');
    await expect(popup).toBeVisible();
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

    const ipInput = page
        .locator('input[placeholder*="example.io"]')
        .first();

    await ipInput.fill('!@#%^&*()');
    await page.click('button:has-text("Start Full Scan")');

    const popup = page.locator('text=Scan Only One: Domain, Ipv4, Subdomain');
    await expect(popup).toBeVisible();
});

