import { test, expect } from "@playwright/test";

test.describe("User Dashboard E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto("http://localhost:3000");
  });

  test("should display loading state initially", async ({ page }) => {
    // Check if loading text appears (it might be very quick)
    const loadingElement = page.getByText("Loading");
    await expect(loadingElement).toBeVisible({ timeout: 5000 });
  });

  test("should display user data after loading", async ({ page }) => {
    // Wait for either user data or sum result to appear
    await expect(page.getByText(/John|Jane|Mike|Sarah|David|3/)).toBeVisible({
      timeout: 10000,
    });

    // Verify the page title
    await expect(page).toHaveTitle(/Create Next App/);
  });

  test("should handle API data correctly", async ({ page }) => {
    // Wait for any content to appear (user data or sum result)
    const contentElement = await page.waitForSelector(
      "text=/John|Jane|Mike|Sarah|David|3/",
      { timeout: 10000 },
    );
    expect(contentElement).toBeTruthy();

    // Check if the text is visible using Playwright's expect
    await expect(
      page.locator("text=/John|Jane|Mike|Sarah|David|3/"),
    ).toBeVisible();
  });

  test("should have proper page structure", async ({ page }) => {
    // Check basic HTML structure
    await expect(page.locator("html")).toBeAttached();
    await expect(page.locator("body")).toBeAttached();

    // Check if the main content is rendered
    const mainContent = page.locator("body > div");
    await expect(mainContent).toBeAttached();
  });
});

test.describe("API Integration E2E Tests", () => {
  test("should fetch user data from API", async ({ page }) => {
    // Intercept API calls to verify they're made
    const apiResponsePromise = page.waitForResponse("**/api/user");

    await page.goto("http://localhost:3000");

    // Wait for API response
    const response = await apiResponsePromise;

    // Verify API response
    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData.success).toBe(true);
    expect(responseData.data).toBeInstanceOf(Array);
    expect(responseData.data.length).toBeGreaterThan(0);
    expect(responseData.pagination).toBeDefined();
  });

  test("should handle API errors gracefully", async ({ page }) => {
    // Mock API to return error
    await page.route("**/api/user", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ success: false, error: "Server error" }),
      });
    });

    await page.goto("http://localhost:3000");

    // Should still show loading or handle error gracefully
    await expect(page.getByText("Loading")).toBeVisible();
  });
});

test.describe("User Interaction E2E Tests", () => {
  test("should be responsive and interactive", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Wait for content to load (either user data or sum result)
    await page.waitForSelector("text=/John|Jane|Mike|Sarah|David|3/", {
      timeout: 10000,
    });

    // Test page interactions
    await page.click("body"); // Basic click interaction

    // Verify page is still functional
    await expect(page.getByText(/John|Jane|Mike|Sarah|David|3/)).toBeVisible();
  });

  test("should work across different viewport sizes", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("http://localhost:3000");

    await expect(page.getByText(/John|Jane|Mike|Sarah|David|3/)).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();

    await expect(page.getByText(/John|Jane|Mike|Sarah|David|3/)).toBeVisible();
  });
});
