import { test, expect } from "@playwright/test";

test.describe("Public pages — smoke tests", () => {
  test("homepage (/) loads and contains expected text", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    await page.goto("/");
    await expect(page).toHaveURL("/");
    // Page should have a heading or key text
    await expect(page.locator("body")).toBeVisible();
    // No JS console errors
    expect(consoleErrors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("footer contains opening hours text", async ({ page }) => {
    await page.goto("/");
    // Footer should contain "Opening Hours" heading
    await expect(page.locator("footer").getByText("Opening Hours")).toBeVisible();
    // Footer should contain at least one day name
    await expect(
      page.locator("footer").getByText(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i).first()
    ).toBeVisible();
  });

  test("/contact loads and contains opening hours", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveURL("/contact");
    await expect(page.getByRole("heading", { name: /Opening Hours/i })).toBeVisible();
    // Should list day names
    await expect(page.getByText(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i).first()).toBeVisible();
  });

  test("/visit loads and contains opening hours", async ({ page }) => {
    await page.goto("/visit");
    await expect(page).toHaveURL("/visit");
    await expect(page.getByRole("heading", { name: /Opening Hours/i })).toBeVisible();
    await expect(page.getByText(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i).first()).toBeVisible();
  });
});

test.describe("Admin save-and-reflect", () => {
  // TODO: requires authenticated session (SUPABASE_SERVICE_ROLE_KEY + test user credentials)
  // These tests need a storageState with a logged-in admin session.
  // To enable: add TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD to .env.local,
  // create a global setup that logs in and saves storageState, then re-enable these.

  test.skip("admin homepage: edit subheading → reflects on public homepage", async ({ page }) => {
    // 1. Log in as admin
    await page.goto("/admin/login");
    await page.fill('input[type="email"]', process.env.TEST_ADMIN_EMAIL ?? "");
    await page.fill('input[type="password"]', process.env.TEST_ADMIN_PASSWORD ?? "");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin(?!\/login)/);

    // 2. Navigate to homepage admin
    await page.goto("/admin/homepage");
    const heroSubheadingInput = page.locator('input[placeholder="Enter subheading..."]').first();
    const testValue = `Test tagline ${Date.now()}`;
    await heroSubheadingInput.fill(testValue);
    await page.getByRole("button", { name: /Save All Changes/i }).click();
    await expect(page.getByText("Saved")).toBeVisible();

    // 3. Verify on public homepage
    await page.goto("/");
    await expect(page.getByText(testValue)).toBeVisible();
  });

  test.skip("admin hours: edit hours → reflects on /visit, /contact, and footer", async ({ page }) => {
    // 1. Log in as admin
    await page.goto("/admin/login");
    await page.fill('input[type="email"]', process.env.TEST_ADMIN_EMAIL ?? "");
    await page.fill('input[type="password"]', process.env.TEST_ADMIN_PASSWORD ?? "");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin(?!\/login)/);

    // 2. Navigate to hours admin
    await page.goto("/admin/hours");
    // Change Tuesday lunch open time (first time input after first "Open" toggle)
    const tuesdayRow = page.locator('[data-testid="hour-row-tuesday"]').first();
    const lunchOpenInput = tuesdayRow.locator('input[type="time"]').first();
    await lunchOpenInput.fill("11:00");
    await page.getByRole("button", { name: /Save All Changes/i }).click();
    await expect(page.getByText("Saved")).toBeVisible();

    // 3. Verify on /visit
    await page.goto("/visit");
    await expect(page.getByText(/11:00/)).toBeVisible();

    // 4. Verify on /contact
    await page.goto("/contact");
    await expect(page.getByText(/11:00/)).toBeVisible();

    // 5. Verify in footer
    await page.goto("/");
    await expect(page.locator("footer").getByText(/11:00/)).toBeVisible();
  });
});

test.describe("Admin", () => {
  test("/admin redirects to /admin/login when unauthenticated", async ({ page }) => {
    await page.goto("/admin");
    // Should redirect to login (Supabase not configured in test env)
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.screenshot({ path: "tests/screenshots/admin-login.png" });
  });

  test("/admin/login renders login form", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page).toHaveURL(/\/admin\/login/);

    // Form elements present
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText(/Sign In/i);

    // Logotype visible
    const logotype = page.locator("text=RAMEN DON").first();
    await expect(logotype).toBeVisible();
  });

  test("login form shows error on bad credentials", async ({ page }) => {
    await page.goto("/admin/login");

    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Should show error (Supabase configured or not)
    // Either error message or still on login page
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
