import { test, expect } from "@playwright/test";

const CATEGORIES = ["Plates", "Bowls", "Soft Drinks", "Beers", "Cocktails", "Saké", "Wine"];
const SAMPLE_ITEMS = [
  "Kotteri Pork",
  "Kara Miso",
  "Karaage",
  "Moscow Mule",
  "Yuzu Shu",
  "Asahi",
];

test.describe("Menu Page", () => {
  test("loads with correct title", async ({ page }) => {
    await page.goto("/menu");
    await expect(page).toHaveTitle(/Menu.*Ramen Don/i);
    await page.screenshot({ path: "tests/screenshots/menu-desktop.png" });
  });

  test("all 7 categories are visible", async ({ page }) => {
    await page.goto("/menu");
    for (const cat of CATEGORIES) {
      const heading = page.locator(`text=${cat}`).first();
      await expect(heading).toBeVisible({ timeout: 10000 });
    }
  });

  test("prices with pound sign present", async ({ page }) => {
    await page.goto("/menu");
    const prices = page.locator("text=/£\\d+/");
    const count = await prices.count();
    expect(count).toBeGreaterThan(5);
  });

  test("dietary tags visible", async ({ page }) => {
    await page.goto("/menu");
    // VG or Spicy tags
    const vgTags = page.locator("text=VG");
    await expect(vgTags.first()).toBeVisible({ timeout: 10000 });
  });

  test("sample menu items present", async ({ page }) => {
    await page.goto("/menu");
    for (const item of SAMPLE_ITEMS) {
      const el = page.locator(`text=${item}`).first();
      await expect(el).toBeVisible({ timeout: 10000 });
    }
  });

  test("MenuNav is present", async ({ page }) => {
    await page.goto("/menu");
    // MenuNav sticky bar
    const nav = page.locator("nav").nth(1);
    await expect(nav).toBeVisible();
  });

  test("mobile nav pills scroll to correct sections", async ({ page, isMobile }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/menu");

    // Wait for the page to fully load
    await page.waitForLoadState("networkidle");

    // Click each category pill and verify the corresponding section heading is visible
    const pillsToTest = [
      { pill: "Bowls", heading: "Bowls" },
      { pill: "Soft Drinks", heading: "Soft Drinks" },
      { pill: "Beers", heading: "Beers" },
    ];

    for (const { pill, heading } of pillsToTest) {
      // Find and tap the pill button
      const pillBtn = page.locator(`button:has-text("${pill}")`).first();
      await expect(pillBtn).toBeVisible({ timeout: 5000 });
      // Use tap() on real mobile (touch-enabled) contexts, click() on desktop Chrome
      if (isMobile) {
        await pillBtn.tap();
      } else {
        await pillBtn.click();
      }

      // Wait for scroll to settle
      await page.waitForTimeout(800);

      // The section heading should be in the viewport
      const section = page.locator(`#cat-${pill.toLowerCase().replace(/\s+/g, "-").replace(/[éè]/g, "e")}`);
      await expect(section).toBeInViewport({ timeout: 5000 });
    }
  });
});
