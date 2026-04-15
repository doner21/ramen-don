# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin >> /admin/login renders login form
- Location: tests\e2e\admin.spec.ts:109:7

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
> 126 |     await expect(logotype).toBeVisible();
      |                            ^ Error: expect(locator).toBeVisible() failed
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