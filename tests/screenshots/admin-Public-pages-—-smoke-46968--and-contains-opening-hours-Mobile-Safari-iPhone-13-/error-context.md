# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Public pages — smoke tests >> /contact loads and contains opening hours
- Location: tests\e2e\admin.spec.ts:27:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /Opening Hours/i })
Expected: visible
Error: strict mode violation: getByRole('heading', { name: /Opening Hours/i }) resolved to 2 elements:
    1) <h2 class="font-display text-2xl font-semibold text-[#F0EBE3] mb-6">Opening Hours</h2> aka getByRole('main').getByRole('heading', { name: 'Opening Hours' })
    2) <h3 class="font-display text-sm uppercase tracking-widest text-[#C8892A] mb-4">Opening Hours</h3> aka getByRole('contentinfo').getByRole('heading', { name: 'Opening Hours' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /Opening Hours/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e4]:
      - link "Ramen Don" [ref=e5]:
        - /url: /
        - img "Ramen Don" [ref=e8]
      - button "Toggle navigation" [ref=e9] [cursor=pointer]:
        - img [ref=e10]
  - main [ref=e12]:
    - generic [ref=e13]:
      - paragraph [ref=e14]: Get In Touch
      - heading "Contact Us" [level=1] [ref=e15]
    - generic [ref=e17]:
      - generic [ref=e18]:
        - heading "Reach Us" [level=2] [ref=e19]
        - generic [ref=e20]:
          - generic [ref=e21]:
            - paragraph [ref=e22]: Address
            - generic [ref=e23]:
              - paragraph [ref=e24]: Unit 1A Regency Wharf
              - paragraph [ref=e25]: Birmingham, West Midlands
              - paragraph [ref=e26]: B1 2DS
          - generic [ref=e27]:
            - paragraph [ref=e28]: Phone
            - link "0121 714 5565" [ref=e29]:
              - /url: tel:01217145565
          - generic [ref=e30]:
            - paragraph [ref=e31]: Instagram
            - link "@ramen_don_" [ref=e32]:
              - /url: https://www.instagram.com/ramen_don_/
      - generic [ref=e33]:
        - heading "Opening Hours" [level=2] [ref=e34]
        - generic [ref=e35]:
          - generic [ref=e36]:
            - generic [ref=e37]: Monday
            - generic [ref=e38]: Closed
          - generic [ref=e39]:
            - generic [ref=e40]: Tuesday
            - generic [ref=e41]: 13:00:00–15:00:00, 17:15:00–22:00:00
          - generic [ref=e42]:
            - generic [ref=e43]: Wednesday
            - generic [ref=e44]: 12:00:00–15:00:00, 17:00:00–22:00:00
          - generic [ref=e45]:
            - generic [ref=e46]: Thursday
            - generic [ref=e47]: 12:00:00–15:00:00, 17:00:00–22:00:00
          - generic [ref=e48]:
            - generic [ref=e49]: Friday
            - generic [ref=e50]: 12:00:00–15:00:00, 17:00:00–22:00:00
          - generic [ref=e51]:
            - generic [ref=e52]: Saturday
            - generic [ref=e53]: 12:00:00–15:00:00, 17:00:00–23:00:00
          - generic [ref=e54]:
            - generic [ref=e55]: Sunday
            - generic [ref=e56]: All day until 20:00
    - generic [ref=e57]:
      - heading "Ready to Join Us?" [level=2] [ref=e58]
      - paragraph [ref=e59]: Reserve your table at Ramen Don Birmingham.
      - link "Book a Table" [ref=e60]:
        - /url: https://www.opentable.co.uk/r/ramen-don-birmingham
        - text: Book a Table
        - img [ref=e61]
  - contentinfo [ref=e63]:
    - generic [ref=e64]:
      - generic [ref=e65]:
        - generic [ref=e66]:
          - link "Ramen Don":
            - /url: /
            - generic:
              - img "Ramen Don"
          - paragraph [ref=e67]:
            - text: Handcrafted broths.
            - text: Bold flavours.
            - text: Birmingham.
        - generic [ref=e68]:
          - heading "Navigate" [level=3] [ref=e69]
          - navigation [ref=e70]:
            - link "Home" [ref=e71]:
              - /url: /
            - link "Menu" [ref=e72]:
              - /url: /menu
            - link "Visit" [ref=e73]:
              - /url: /visit
            - link "Reservations" [ref=e74]:
              - /url: /reservations
            - link "Gallery" [ref=e75]:
              - /url: /gallery
            - link "Contact" [ref=e76]:
              - /url: /contact
        - generic [ref=e77]:
          - heading "Find Us" [level=3] [ref=e78]
          - generic [ref=e79]:
            - paragraph [ref=e80]: Unit 1A Regency Wharf
            - paragraph [ref=e81]: Birmingham, West Midlands
            - paragraph [ref=e82]: B1 2DS
            - paragraph [ref=e83]:
              - link "0121 714 5565" [ref=e84]:
                - /url: tel:01217145565
            - paragraph [ref=e85]:
              - link "@ramen_don_" [ref=e86]:
                - /url: https://www.instagram.com/ramen_don_/
        - generic [ref=e87]:
          - heading "Opening Hours" [level=3] [ref=e88]
          - generic [ref=e89]:
            - paragraph [ref=e90]: Monday — Closed
            - paragraph [ref=e91]: "Tuesday: 13:00:00–15:00:00, 17:15:00–22:00:00"
            - paragraph [ref=e92]: "Wednesday: 12:00:00–15:00:00, 17:00:00–22:00:00"
            - paragraph [ref=e93]: "Thursday: 12:00:00–15:00:00, 17:00:00–22:00:00"
            - paragraph [ref=e94]: "Friday: 12:00:00–15:00:00, 17:00:00–22:00:00"
            - paragraph [ref=e95]: "Saturday: 12:00:00–15:00:00, 17:00:00–23:00:00"
            - paragraph [ref=e96]: "Sunday: All day until 20:00"
          - link "Book a Table" [ref=e97]:
            - /url: https://www.opentable.co.uk/r/ramen-don-birmingham
      - generic [ref=e98]: © 2026 Ramen Don. All rights reserved.
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.describe("Public pages — smoke tests", () => {
  4   |   test("homepage (/) loads and contains expected text", async ({ page }) => {
  5   |     const consoleErrors: string[] = [];
  6   |     page.on("console", (msg) => {
  7   |       if (msg.type() === "error") consoleErrors.push(msg.text());
  8   |     });
  9   |     await page.goto("/");
  10  |     await expect(page).toHaveURL("/");
  11  |     // Page should have a heading or key text
  12  |     await expect(page.locator("body")).toBeVisible();
  13  |     // No JS console errors
  14  |     expect(consoleErrors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  15  |   });
  16  | 
  17  |   test("footer contains opening hours text", async ({ page }) => {
  18  |     await page.goto("/");
  19  |     // Footer should contain "Opening Hours" heading
  20  |     await expect(page.locator("footer").getByText("Opening Hours")).toBeVisible();
  21  |     // Footer should contain at least one day name
  22  |     await expect(
  23  |       page.locator("footer").getByText(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i).first()
  24  |     ).toBeVisible();
  25  |   });
  26  | 
  27  |   test("/contact loads and contains opening hours", async ({ page }) => {
  28  |     await page.goto("/contact");
  29  |     await expect(page).toHaveURL("/contact");
> 30  |     await expect(page.getByRole("heading", { name: /Opening Hours/i })).toBeVisible();
      |                                                                         ^ Error: expect(locator).toBeVisible() failed
  31  |     // Should list day names
  32  |     await expect(page.getByText(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i).first()).toBeVisible();
  33  |   });
  34  | 
  35  |   test("/visit loads and contains opening hours", async ({ page }) => {
  36  |     await page.goto("/visit");
  37  |     await expect(page).toHaveURL("/visit");
  38  |     await expect(page.getByRole("heading", { name: /Opening Hours/i })).toBeVisible();
  39  |     await expect(page.getByText(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i).first()).toBeVisible();
  40  |   });
  41  | });
  42  | 
  43  | test.describe("Admin save-and-reflect", () => {
  44  |   // TODO: requires authenticated session (SUPABASE_SERVICE_ROLE_KEY + test user credentials)
  45  |   // These tests need a storageState with a logged-in admin session.
  46  |   // To enable: add TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD to .env.local,
  47  |   // create a global setup that logs in and saves storageState, then re-enable these.
  48  | 
  49  |   test.skip("admin homepage: edit subheading → reflects on public homepage", async ({ page }) => {
  50  |     // 1. Log in as admin
  51  |     await page.goto("/admin/login");
  52  |     await page.fill('input[type="email"]', process.env.TEST_ADMIN_EMAIL ?? "");
  53  |     await page.fill('input[type="password"]', process.env.TEST_ADMIN_PASSWORD ?? "");
  54  |     await page.click('button[type="submit"]');
  55  |     await page.waitForURL(/\/admin(?!\/login)/);
  56  | 
  57  |     // 2. Navigate to homepage admin
  58  |     await page.goto("/admin/homepage");
  59  |     const heroSubheadingInput = page.locator('input[placeholder="Enter subheading..."]').first();
  60  |     const testValue = `Test tagline ${Date.now()}`;
  61  |     await heroSubheadingInput.fill(testValue);
  62  |     await page.getByRole("button", { name: /Save All Changes/i }).click();
  63  |     await expect(page.getByText("Saved")).toBeVisible();
  64  | 
  65  |     // 3. Verify on public homepage
  66  |     await page.goto("/");
  67  |     await expect(page.getByText(testValue)).toBeVisible();
  68  |   });
  69  | 
  70  |   test.skip("admin hours: edit hours → reflects on /visit, /contact, and footer", async ({ page }) => {
  71  |     // 1. Log in as admin
  72  |     await page.goto("/admin/login");
  73  |     await page.fill('input[type="email"]', process.env.TEST_ADMIN_EMAIL ?? "");
  74  |     await page.fill('input[type="password"]', process.env.TEST_ADMIN_PASSWORD ?? "");
  75  |     await page.click('button[type="submit"]');
  76  |     await page.waitForURL(/\/admin(?!\/login)/);
  77  | 
  78  |     // 2. Navigate to hours admin
  79  |     await page.goto("/admin/hours");
  80  |     // Change Tuesday lunch open time (first time input after first "Open" toggle)
  81  |     const tuesdayRow = page.locator('[data-testid="hour-row-tuesday"]').first();
  82  |     const lunchOpenInput = tuesdayRow.locator('input[type="time"]').first();
  83  |     await lunchOpenInput.fill("11:00");
  84  |     await page.getByRole("button", { name: /Save All Changes/i }).click();
  85  |     await expect(page.getByText("Saved")).toBeVisible();
  86  | 
  87  |     // 3. Verify on /visit
  88  |     await page.goto("/visit");
  89  |     await expect(page.getByText(/11:00/)).toBeVisible();
  90  | 
  91  |     // 4. Verify on /contact
  92  |     await page.goto("/contact");
  93  |     await expect(page.getByText(/11:00/)).toBeVisible();
  94  | 
  95  |     // 5. Verify in footer
  96  |     await page.goto("/");
  97  |     await expect(page.locator("footer").getByText(/11:00/)).toBeVisible();
  98  |   });
  99  | });
  100 | 
  101 | test.describe("Admin", () => {
  102 |   test("/admin redirects to /admin/login when unauthenticated", async ({ page }) => {
  103 |     await page.goto("/admin");
  104 |     // Should redirect to login (Supabase not configured in test env)
  105 |     await expect(page).toHaveURL(/\/admin\/login/);
  106 |     await page.screenshot({ path: "tests/screenshots/admin-login.png" });
  107 |   });
  108 | 
  109 |   test("/admin/login renders login form", async ({ page }) => {
  110 |     await page.goto("/admin/login");
  111 |     await expect(page).toHaveURL(/\/admin\/login/);
  112 | 
  113 |     // Form elements present
  114 |     const emailInput = page.locator('input[type="email"]');
  115 |     await expect(emailInput).toBeVisible();
  116 | 
  117 |     const passwordInput = page.locator('input[type="password"]');
  118 |     await expect(passwordInput).toBeVisible();
  119 | 
  120 |     const submitBtn = page.locator('button[type="submit"]');
  121 |     await expect(submitBtn).toBeVisible();
  122 |     await expect(submitBtn).toContainText(/Sign In/i);
  123 | 
  124 |     // Logotype visible
  125 |     const logotype = page.locator("text=RAMEN DON").first();
  126 |     await expect(logotype).toBeVisible();
  127 |   });
  128 | 
  129 |   test("login form shows error on bad credentials", async ({ page }) => {
  130 |     await page.goto("/admin/login");
```