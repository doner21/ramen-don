import { test, expect } from "@playwright/test";

const OPENTABLE_URL = "https://www.opentable.co.uk/r/ramen-don-birmingham";
const KEY_PAGES = ["/", "/menu", "/visit", "/reservations", "/contact"];

test.describe("Booking CTAs", () => {
  test("OpenTable URL present on all key pages", async ({ page }) => {
    for (const path of KEY_PAGES) {
      await page.goto(path);
      const links = page.locator(`a[href="${OPENTABLE_URL}"]`);
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test("reservations page has OpenTable section", async ({ page }) => {
    await page.goto("/reservations");
    const section = page.locator('[data-testid="opentable-section"]');
    await expect(section).toBeVisible();
    await page.screenshot({ path: "tests/screenshots/reservations-desktop.png" });
  });

  test("reservations page has direct OpenTable link", async ({ page }) => {
    await page.goto("/reservations");
    const links = page.locator(`a[href*="opentable"]`);
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test("contact page has phone link", async ({ page }) => {
    await page.goto("/contact");
    const phoneLink = page.locator('[data-testid="phone-link"]');
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toContainText("0121 714 5565");
  });

  test("contact page has Instagram link", async ({ page }) => {
    await page.goto("/contact");
    const igLink = page.locator('[data-testid="instagram-link"]');
    await expect(igLink).toBeVisible();
  });
});
