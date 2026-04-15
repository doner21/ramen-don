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
    - generic [ref=e3]:
      - link "RAMEN DON" [ref=e4]:
        - /url: /
      - button "Toggle navigation" [ref=e5] [cursor=pointer]:
        - img [ref=e6]
    - complementary [ref=e8]:
      - generic [ref=e9]:
        - link "RAMEN DON" [ref=e10]:
          - /url: /
        - paragraph [ref=e11]: Admin
      - navigation [ref=e12]:
        - link "◈ Dashboard" [ref=e13]:
          - /url: /admin
          - generic [ref=e14]: ◈
          - text: Dashboard
        - link "◷ Opening Hours" [ref=e15]:
          - /url: /admin/hours
          - generic [ref=e16]: ◷
          - text: Opening Hours
        - link "◎ Venue Details" [ref=e17]:
          - /url: /admin/venue
          - generic [ref=e18]: ◎
          - text: Venue Details
        - link "◻ Menu" [ref=e19]:
          - /url: /admin/menu
          - generic [ref=e20]: ◻
          - text: Menu
        - link "◫ Gallery" [ref=e21]:
          - /url: /admin/gallery
          - generic [ref=e22]: ◫
          - text: Gallery
        - link "◱ Homepage" [ref=e23]:
          - /url: /admin/homepage
          - generic [ref=e24]: ◱
          - text: Homepage
      - button "⇥ Sign Out" [ref=e26]:
        - generic [ref=e27]: ⇥
        - text: Sign Out
    - main [ref=e28]:
      - generic [ref=e29]:
        - heading "Dashboard" [level=1] [ref=e30]
        - paragraph [ref=e31]: Welcome back. Manage your restaurant content below.
        - generic [ref=e32]:
          - link "Opening Hours Edit restaurant trading hours" [ref=e33]:
            - /url: /admin/hours
            - heading "Opening Hours" [level=2] [ref=e34]
            - paragraph [ref=e35]: Edit restaurant trading hours
          - link "Venue Details Update address, phone, social links" [ref=e36]:
            - /url: /admin/venue
            - heading "Venue Details" [level=2] [ref=e37]
            - paragraph [ref=e38]: Update address, phone, social links
          - link "Menu Manage categories, items, and prices" [ref=e39]:
            - /url: /admin/menu
            - heading "Menu" [level=2] [ref=e40]
            - paragraph [ref=e41]: Manage categories, items, and prices
          - link "Gallery Upload and manage brand photos" [ref=e42]:
            - /url: /admin/gallery
            - heading "Gallery" [level=2] [ref=e43]
            - paragraph [ref=e44]: Upload and manage brand photos
          - link "Homepage Edit hero, story, and section content" [ref=e45]:
            - /url: /admin/homepage
            - heading "Homepage" [level=2] [ref=e46]
            - paragraph [ref=e47]: Edit hero, story, and section content
        - generic [ref=e48]:
          - paragraph [ref=e49]: About this admin
          - paragraph [ref=e50]: Changes made here update Supabase in real time. If Supabase is not configured, the site displays static fallback data from seed-data.ts.
          - paragraph [ref=e51]:
            - link "View live site →" [ref=e52]:
              - /url: /
  - button "Open Next.js Dev Tools" [ref=e58] [cursor=pointer]:
    - img [ref=e59]
  - alert [ref=e64]
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