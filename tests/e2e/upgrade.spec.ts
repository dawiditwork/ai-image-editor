import { expect, test } from "@playwright/test";

test("opens Buy Credits dialog and shows all packages", async ({ page }) => {
  await page.goto("/dashboard");

  await page.getByRole("button", { name: "Buy Credits" }).click();

  await expect(
    page.getByRole("heading", { name: "Buy Credits" }),
  ).toBeVisible();

  await expect(
    page.getByText("Choose a credit package. Credits never expire."),
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
    page.getByText("4.99", { exact: true }),
  ).toBeVisible();

  await expect(
    page.getByText("14.99", { exact: true }),
  ).toBeVisible();

  await expect(
    page.getByText("49.99", { exact: true }),
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

  await expect(
    page.getByText("Secure payment powered by Polar"),
  ).toBeVisible();
});