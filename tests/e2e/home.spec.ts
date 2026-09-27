import { expect, test } from "@playwright/test";

test("application loads", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/AI|Image/i);
});