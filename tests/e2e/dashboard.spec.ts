import { expect, test } from "@playwright/test";

test.describe("Dashboard", () => {
  test("authenticated user can access dashboard", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/dashboard/);

    await expect(
      page.getByRole("button", { name: "Buy Credits" }),
    ).toBeVisible();
  });

  test("user can open credit packages from dashboard", async ({ page }) => {
    await page.goto("/dashboard");

    await page
      .getByRole("button", { name: "Buy Credits" })
      .click();

    await expect(
      page.getByRole("heading", { name: "Buy Credits" }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Buy Small" }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Buy Medium" }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Buy Large" }),
    ).toBeVisible();

    await expect(
      page.getByText("50", { exact: true }),
    ).toBeVisible();

    await expect(
      page.getByText("200", { exact: true }),
    ).toBeVisible();

    await expect(
      page.getByText("1000", { exact: true }),
    ).toBeVisible();
  });
});