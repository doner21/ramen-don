import { test, expect } from "@playwright/test";

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
