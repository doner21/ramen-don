# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin >> /admin redirects to /admin/login when unauthenticated
- Location: tests\e2e\admin.spec.ts:4:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/admin\/login/
Received string:  "http://localhost:3000/admin"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "http://localhost:3000/admin"

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
      - generic [ref=e24]:
        - heading "Dashboard" [level=1] [ref=e25]
        - paragraph [ref=e26]: Welcome back. Manage your restaurant content below.
        - generic [ref=e27]:
          - link "Opening Hours Edit restaurant trading hours" [ref=e28] [cursor=pointer]:
            - /url: /admin/hours
            - heading "Opening Hours" [level=2] [ref=e29]
            - paragraph [ref=e30]: Edit restaurant trading hours
          - link "Venue Details Update address, phone, social links" [ref=e31] [cursor=pointer]:
            - /url: /admin/venue
            - heading "Venue Details" [level=2] [ref=e32]
            - paragraph [ref=e33]: Update address, phone, social links
          - link "Menu Manage categories, items, and prices" [ref=e34] [cursor=pointer]:
            - /url: /admin/menu
            - heading "Menu" [level=2] [ref=e35]
            - paragraph [ref=e36]: Manage categories, items, and prices
          - link "Gallery Upload and manage brand photos" [ref=e37] [cursor=pointer]:
            - /url: /admin/gallery
            - heading "Gallery" [level=2] [ref=e38]
            - paragraph [ref=e39]: Upload and manage brand photos
          - link "Homepage Edit hero, story, and section content" [ref=e40] [cursor=pointer]:
            - /url: /admin/homepage
            - heading "Homepage" [level=2] [ref=e41]
            - paragraph [ref=e42]: Edit hero, story, and section content
        - generic [ref=e43]:
          - paragraph [ref=e44]: About this admin
          - paragraph [ref=e45]: Changes made here update Supabase in real time. If Supabase is not configured, the site displays static fallback data from seed-data.ts.
          - paragraph [ref=e46]:
            - link "View live site →" [ref=e47] [cursor=pointer]:
              - /url: /
  - button "Open Next.js Dev Tools" [ref=e53] [cursor=pointer]:
    - img [ref=e54]
  - alert [ref=e57]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Admin", () => {
  4  |   test("/admin redirects to /admin/login when unauthenticated", async ({ page }) => {
  5  |     await page.goto("/admin");
  6  |     // Should redirect to login (Supabase not configured in test env)
> 7  |     await expect(page).toHaveURL(/\/admin\/login/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
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
  28 |     await expect(logotype).toBeVisible();
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