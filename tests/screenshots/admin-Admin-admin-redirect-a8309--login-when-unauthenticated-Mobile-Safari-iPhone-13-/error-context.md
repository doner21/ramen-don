# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin >> /admin redirects to /admin/login when unauthenticated
- Location: tests\e2e\admin.spec.ts:102:7

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
  30  |     await expect(page.getByRole("heading", { name: /Opening Hours/i })).toBeVisible();
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
> 105 |     await expect(page).toHaveURL(/\/admin\/login/);
      |                        ^ Error: expect(page).toHaveURL(expected) failed
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
  131 | 
  132 |     await page.fill('input[type="email"]', "test@example.com");
  133 |     await page.fill('input[type="password"]', "wrongpassword");
  134 |     await page.click('button[type="submit"]');
  135 | 
  136 |     // Should show error (Supabase configured or not)
  137 |     // Either error message or still on login page
  138 |     await expect(page).toHaveURL(/\/admin\/login/);
  139 |   });
  140 | });
  141 | 
```