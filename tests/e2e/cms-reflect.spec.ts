import { test, expect } from "@playwright/test";

test("admin venue: edit opentable_url → reflects in VisitInfo on home page", async ({ page }) => {
  // 1. Authenticate
  await page.goto("/admin/login");
  await page.fill('input[type="email"]', process.env.TEST_ADMIN_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_ADMIN_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin(?!\/login)/);

  // 2. Navigate to venue admin
  await page.goto("/admin/venue");

  // 3. Change OpenTable URL to a unique sentinel value
  const sentinelUrl = "https://www.opentable.co.uk/r/test-sentinel-" + Date.now();
  const openTableInput = page.locator('input[placeholder="Enter opentable url..."]');
  await openTableInput.fill(sentinelUrl);
  await page.getByRole("button", { name: /Save Changes/i }).click();
  await expect(page.getByText("Changes saved successfully")).toBeVisible();

  // 4. Navigate to home page
  await page.goto("/");

  // 5. Assert VisitInfo "Book a Table" anchor has the new URL
  await expect(page.locator('[data-testid="visit-booking-cta"]')).toHaveAttribute("href", sentinelUrl);
});

test("admin venue: edit address_line1 → reflects in Footer", async ({ page }) => {
  // 1. Authenticate
  await page.goto("/admin/login");
  await page.fill('input[type="email"]', process.env.TEST_ADMIN_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_ADMIN_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin(?!\/login)/);

  // 2. Navigate to venue admin
  await page.goto("/admin/venue");

  // 3. Change address line 1
  const sentinelAddress = "Unit TEST-" + Date.now();
  const addressInput = page.locator('input[placeholder="Enter address line 1..."]');
  await addressInput.fill(sentinelAddress);
  await page.getByRole("button", { name: /Save Changes/i }).click();
  await expect(page.getByText("Changes saved successfully")).toBeVisible();

  // 4. Navigate to home page
  await page.goto("/");

  // 5. Assert Footer contains the new address
  await expect(page.locator("footer").getByText(sentinelAddress)).toBeVisible();
});

test("admin homepage: edit hero cta_url → reflects in Hero booking link", async ({ page }) => {
  // 1. Authenticate
  await page.goto("/admin/login");
  await page.fill('input[type="email"]', process.env.TEST_ADMIN_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_ADMIN_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin(?!\/login)/);

  // 2. Navigate to homepage admin
  await page.goto("/admin/homepage");

  // 3. Find the hero section's CTA URL input (first cta_url input = hero section)
  const sentinelUrl = "https://www.opentable.co.uk/r/hero-test-" + Date.now();
  const ctaUrlInput = page.locator('input[placeholder*="e.g. /menu"]').first();
  await ctaUrlInput.fill(sentinelUrl);
  await page.getByRole("button", { name: /Save All Changes/i }).click();
  await expect(page.getByText("Saved")).toBeVisible();

  // 4. Navigate to home page
  await page.goto("/");

  // 5. Assert Hero "Book a Table" link has the new URL
  await expect(page.locator('[data-testid="hero-booking-cta"]')).toHaveAttribute("href", sentinelUrl);
});

test("admin homepage: edit visit-cta cta_url → reflects in BookingCTA", async ({ page }) => {
  // 1. Authenticate
  await page.goto("/admin/login");
  await page.fill('input[type="email"]', process.env.TEST_ADMIN_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_ADMIN_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin(?!\/login)/);

  // 2. Navigate to homepage admin
  await page.goto("/admin/homepage");

  // 3. Find the visit-cta section's CTA URL input (it's the second/last cta_url input)
  const sentinelUrl = "https://www.opentable.co.uk/r/cta-test-" + Date.now();
  const ctaUrlInputs = page.locator('input[placeholder*="e.g. /menu"]');
  await ctaUrlInputs.last().fill(sentinelUrl);
  await page.getByRole("button", { name: /Save All Changes/i }).click();
  await expect(page.getByText("Saved")).toBeVisible();

  // 4. Navigate to home page
  await page.goto("/");

  // 5. Assert BookingCTA "Book a Table" anchor has the new URL
  await expect(page.locator('[data-testid="booking-cta"]')).toHaveAttribute("href", sentinelUrl);
});
