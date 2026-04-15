# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Public pages — smoke tests >> /visit loads and contains opening hours
- Location: tests\e2e\admin.spec.ts:35:7

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
      - link "Ramen Don" [ref=e5] [cursor=pointer]:
        - /url: /
        - img "Ramen Don" [ref=e8]
      - navigation [ref=e9]:
        - link "Home" [ref=e10] [cursor=pointer]:
          - /url: /
        - link "Menu" [ref=e11] [cursor=pointer]:
          - /url: /menu
        - link "Visit" [ref=e12] [cursor=pointer]:
          - /url: /visit
        - link "Reservations" [ref=e13] [cursor=pointer]:
          - /url: /reservations
        - link "Gallery" [ref=e14] [cursor=pointer]:
          - /url: /gallery
        - link "Contact" [ref=e15] [cursor=pointer]:
          - /url: /contact
      - link "Book a Table" [ref=e17] [cursor=pointer]:
        - /url: https://www.opentable.co.uk/r/ramen-don-birmingham
  - main [ref=e18]:
    - generic [ref=e19]:
      - paragraph [ref=e20]: Come See Us
      - heading "Visit Us" [level=1] [ref=e21]
      - paragraph [ref=e22]: Unit 1A Regency Wharf 21, Birmingham
    - generic [ref=e24]:
      - generic [ref=e25]:
        - heading "Address" [level=2] [ref=e26]
        - generic [ref=e27]:
          - paragraph [ref=e28]: Ramen Don
          - paragraph [ref=e29]: Unit 1A Regency Wharf 21
          - paragraph [ref=e30]: Birmingham, West Midlands
          - paragraph [ref=e31]: B1 2DS
          - paragraph [ref=e32]:
            - link "0121 714 9999" [ref=e33] [cursor=pointer]:
              - /url: tel:01217149999
        - heading "Getting Here" [level=2] [ref=e34]
        - generic [ref=e35]:
          - paragraph [ref=e36]: "By Train: New Street Station is a 10-minute walk via Broad Street."
          - paragraph [ref=e37]: "By Bus: Multiple routes stop on Broad Street, 2 minutes away."
          - paragraph [ref=e38]: "By Car: Brindleyplace car parks are a 5-minute walk. Limited street parking on Regency Wharf."
          - paragraph [ref=e39]: "By Tram: Centenary Square stop is a 5-minute walk."
      - generic [ref=e40]:
        - heading "Opening Hours" [level=2] [ref=e41]
        - generic [ref=e42]:
          - generic [ref=e43]:
            - generic [ref=e44]: Monday
            - generic [ref=e45]: Closed
          - generic [ref=e46]:
            - generic [ref=e47]: Tuesday
            - generic [ref=e48]:
              - paragraph [ref=e49]: "Lunch: 13:00:00–15:00:00"
              - paragraph [ref=e50]: "Dinner: 17:15:00–22:00:00"
          - generic [ref=e51]:
            - generic [ref=e52]: Wednesday
            - generic [ref=e53]:
              - paragraph [ref=e54]: "Lunch: 12:00:00–15:00:00"
              - paragraph [ref=e55]: "Dinner: 17:00:00–22:00:00"
          - generic [ref=e56]:
            - generic [ref=e57]: Thursday
            - generic [ref=e58]:
              - paragraph [ref=e59]: "Lunch: 12:00:00–15:00:00"
              - paragraph [ref=e60]: "Dinner: 17:00:00–22:00:00"
          - generic [ref=e61]:
            - generic [ref=e62]: Friday
            - generic [ref=e63]:
              - paragraph [ref=e64]: "Lunch: 12:00:00–15:00:00"
              - paragraph [ref=e65]: "Dinner: 17:00:00–22:00:00"
          - generic [ref=e66]:
            - generic [ref=e67]: Saturday
            - generic [ref=e68]:
              - paragraph [ref=e69]: "Lunch: 12:00:00–15:00:00"
              - paragraph [ref=e70]: "Dinner: 17:00:00–23:00:00"
          - generic [ref=e71]:
            - generic [ref=e72]: Sunday
            - generic [ref=e73]: All day until 20:00
    - generic [ref=e74]:
      - heading "Plan Your Visit" [level=2] [ref=e75]
      - paragraph [ref=e76]: Book ahead to guarantee your table.
      - link "Book a Table" [ref=e77] [cursor=pointer]:
        - /url: https://www.opentable.co.uk/r/ramen-don-birmingham
        - text: Book a Table
        - img [ref=e78]
  - contentinfo [ref=e80]:
    - generic [ref=e81]:
      - generic [ref=e82]:
        - generic [ref=e83]:
          - link "Ramen Don" [ref=e84] [cursor=pointer]:
            - /url: /
            - img "Ramen Don" [ref=e86]
          - paragraph [ref=e87]:
            - text: Handcrafted broths.
            - text: Bold flavours.
            - text: Birmingham.
        - generic [ref=e88]:
          - heading "Navigate" [level=3] [ref=e89]
          - navigation [ref=e90]:
            - link "Home" [ref=e91] [cursor=pointer]:
              - /url: /
            - link "Menu" [ref=e92] [cursor=pointer]:
              - /url: /menu
            - link "Visit" [ref=e93] [cursor=pointer]:
              - /url: /visit
            - link "Reservations" [ref=e94] [cursor=pointer]:
              - /url: /reservations
            - link "Gallery" [ref=e95] [cursor=pointer]:
              - /url: /gallery
            - link "Contact" [ref=e96] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e97]:
          - heading "Find Us" [level=3] [ref=e98]
          - generic [ref=e99]:
            - paragraph [ref=e100]: Unit 1A Regency Wharf
            - paragraph [ref=e101]: Birmingham, West Midlands
            - paragraph [ref=e102]: B1 2DS
            - paragraph [ref=e103]:
              - link "0121 714 5565" [ref=e104] [cursor=pointer]:
                - /url: tel:01217145565
            - paragraph [ref=e105]:
              - link "@ramen_don_" [ref=e106] [cursor=pointer]:
                - /url: https://www.instagram.com/ramen_don_/
        - generic [ref=e107]:
          - heading "Opening Hours" [level=3] [ref=e108]
          - generic [ref=e109]:
            - paragraph [ref=e110]: Monday — Closed
            - paragraph [ref=e111]: "Tuesday: 13:00:00–15:00:00, 17:15:00–22:00:00"
            - paragraph [ref=e112]: "Wednesday: 12:00:00–15:00:00, 17:00:00–22:00:00"
            - paragraph [ref=e113]: "Thursday: 12:00:00–15:00:00, 17:00:00–22:00:00"
            - paragraph [ref=e114]: "Friday: 12:00:00–15:00:00, 17:00:00–22:00:00"
            - paragraph [ref=e115]: "Saturday: 12:00:00–15:00:00, 17:00:00–23:00:00"
            - paragraph [ref=e116]: "Sunday: All day until 20:00"
          - link "Book a Table" [ref=e117] [cursor=pointer]:
            - /url: https://www.opentable.co.uk/r/ramen-don-birmingham
      - generic [ref=e118]: © 2026 Ramen Don. All rights reserved.
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
  30  |     await expect(page.getByRole("heading", { name: /Opening Hours/i })).toBeVisible();
  31  |     // Should list day names
  32  |     await expect(page.getByText(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i).first()).toBeVisible();
  33  |   });
  34  | 
  35  |   test("/visit loads and contains opening hours", async ({ page }) => {
  36  |     await page.goto("/visit");
  37  |     await expect(page).toHaveURL("/visit");
> 38  |     await expect(page.getByRole("heading", { name: /Opening Hours/i })).toBeVisible();
      |                                                                         ^ Error: expect(locator).toBeVisible() failed
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
  131 | 
  132 |     await page.fill('input[type="email"]', "test@example.com");
  133 |     await page.fill('input[type="password"]', "wrongpassword");
  134 |     await page.click('button[type="submit"]');
  135 | 
  136 |     // Should show error (Supabase configured or not)
  137 |     // Either error message or still on login page
  138 |     await expect(page).toHaveURL(/\/admin\/login/);
```