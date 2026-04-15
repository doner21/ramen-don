# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin >> /admin/login renders login form
- Location: tests\e2e\admin.spec.ts:11:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('text=RAMEN DON').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=RAMEN DON').first()
    9 × locator resolved to <a href="/" class="font-display text-base font-semibold tracking-[0.2em] uppercase text-[#F0EBE3] hover:text-[#C8892A] transition-colors">RAMEN DON</a>
      - unexpected value "hidden"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - complementary [ref=e3]:
      - generic [ref=e4]:
        - link "RAMEN DON" [ref=e5] [cursor=pointer]:
          - /url: /
        - paragraph [ref=e6]: Admin
      - navigation [ref=e7]:
        - link "◈ Dashboard" [ref=e8] [cursor=pointer]:
          - /url: /admin
          - generic [ref=e9]: ◈
          - text: Dashboard
        - link "◷ Opening Hours" [ref=e10] [cursor=pointer]:
          - /url: /admin/hours
          - generic [ref=e11]: ◷
          - text: Opening Hours
        - link "◎ Venue Details" [ref=e12] [cursor=pointer]:
          - /url: /admin/venue
          - generic [ref=e13]: ◎
          - text: Venue Details
        - link "◻ Menu" [ref=e14] [cursor=pointer]:
          - /url: /admin/menu
          - generic [ref=e15]: ◻
          - text: Menu
        - link "◫ Gallery" [ref=e16] [cursor=pointer]:
          - /url: /admin/gallery
          - generic [ref=e17]: ◫
          - text: Gallery
        - link "◱ Homepage" [ref=e18] [cursor=pointer]:
          - /url: /admin/homepage
          - generic [ref=e19]: ◱
          - text: Homepage
      - button "⇥ Sign Out" [ref=e21]:
        - generic [ref=e22]: ⇥
        - text: Sign Out
    - main [ref=e23]:
      - generic [ref=e25]:
        - generic [ref=e26]:
          - heading "RAMEN DON" [level=1] [ref=e27]
          - paragraph [ref=e28]: Admin Login
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]: Email
            - textbox "Email" [ref=e32]:
              - /placeholder: admin@ramendon.co.uk
          - generic [ref=e33]:
            - generic [ref=e34]: Password
            - textbox "Password" [ref=e35]:
              - /placeholder: ••••••••
          - button "Sign In" [ref=e36]
  - button "Open Next.js Dev Tools" [ref=e42] [cursor=pointer]:
    - img [ref=e43]
  - alert [ref=e46]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Admin", () => {
  4  |   test("/admin redirects to /admin/login when unauthenticated", async ({ page }) => {
  5  |     await page.goto("/admin");
  6  |     // Should redirect to login (Supabase not configured in test env)
  7  |     await expect(page).toHaveURL(/\/admin\/login/);
  8  |     await page.screenshot({ path: "tests/screenshots/admin-login.png" });
  9  |   });
  10 | 
  11 |   test("/admin/login renders login form", async ({ page }) => {
  12 |     await page.goto("/admin/login");
  13 |     await expect(page).toHaveURL(/\/admin\/login/);
  14 | 
  15 |     // Form elements present
  16 |     const emailInput = page.locator('input[type="email"]');
  17 |     await expect(emailInput).toBeVisible();
  18 | 
  19 |     const passwordInput = page.locator('input[type="password"]');
  20 |     await expect(passwordInput).toBeVisible();
  21 | 
  22 |     const submitBtn = page.locator('button[type="submit"]');
  23 |     await expect(submitBtn).toBeVisible();
  24 |     await expect(submitBtn).toContainText(/Sign In/i);
  25 | 
  26 |     // Logotype visible
  27 |     const logotype = page.locator("text=RAMEN DON").first();
> 28 |     await expect(logotype).toBeVisible();
     |                            ^ Error: expect(locator).toBeVisible() failed
  29 |   });
  30 | 
  31 |   test("login form shows error on bad credentials", async ({ page }) => {
  32 |     await page.goto("/admin/login");
  33 | 
  34 |     await page.fill('input[type="email"]', "test@example.com");
  35 |     await page.fill('input[type="password"]', "wrongpassword");
  36 |     await page.click('button[type="submit"]');
  37 | 
  38 |     // Should show error (Supabase configured or not)
  39 |     // Either error message or still on login page
  40 |     await expect(page).toHaveURL(/\/admin\/login/);
  41 |   });
  42 | });
  43 | 
```