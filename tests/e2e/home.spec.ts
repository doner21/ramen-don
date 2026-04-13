import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows hero content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Ramen Don/i);

    // H1 contains Ramen Don logo image (logotype is now an image, not text)
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    const heroLogo = page.locator("h1 img[alt='Ramen Don']").first();
    await expect(heroLogo).toBeVisible();

    // OpenTable link present anywhere on page
    const otLink = page.locator('a[href*="opentable"]').first();
    const count = await page.locator('a[href*="opentable"]').count();
    expect(count).toBeGreaterThan(0);
    expect(otLink).toBeTruthy();

    await page.screenshot({ path: "tests/screenshots/home-desktop.png" });
  });

  test("mobile viewport hero", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    await page.screenshot({ path: "tests/screenshots/home-mobile.png" });
  });

  test("brand colours present in CSS", async ({ page }) => {
    await page.goto("/");
    // Check page source contains brand color
    const content = await page.content();
    expect(content).toContain("1A1714");
  });
});
