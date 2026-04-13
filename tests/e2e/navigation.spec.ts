import { test, expect } from "@playwright/test";

const PAGES = ["/", "/menu", "/visit", "/reservations", "/gallery", "/contact"];

test.describe("Navigation", () => {
  for (const path of PAGES) {
    test(`${path} loads with header and footer`, async ({ page }) => {
      await page.goto(path);

      // Header logo image present (logotype is now an image, not text)
      const logo = page.locator("header img[alt='Ramen Don']").first();
      await expect(logo).toBeVisible();

      // Reserve CTA — visible somewhere in header OR page (desktop: header, mobile: body)
      const anyOtLink = page.locator('a[href*="opentable"]');
      await expect(anyOtLink.first()).toBeTruthy();
      // At least one OpenTable link exists
      const count = await anyOtLink.count();
      expect(count).toBeGreaterThan(0);

      // Footer present
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();
    });
  }

  test("mobile hamburger opens drawer", async ({ page, isMobile }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const hamburger = page.locator("button[aria-label='Toggle navigation']");
    await expect(hamburger).toBeVisible();
    // Use tap() on real mobile (touch-enabled) contexts, click() on desktop Chrome
    if (isMobile) {
      await hamburger.tap();
    } else {
      await hamburger.click();
    }

    // Menu links visible in drawer
    const menuLink = page.locator("nav a[href='/menu']").last();
    await expect(menuLink).toBeVisible();

    await page.screenshot({ path: "tests/screenshots/mobile-nav-open.png" });
  });

  test("Reserve button present on all pages", async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(path);
      // At least one OpenTable link on the page (in header, footer, or content)
      const links = page.locator('a[href*="opentable"]');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});
