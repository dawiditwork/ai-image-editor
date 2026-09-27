import path from "node:path";
import { expect, test } from "@playwright/test";

test("authenticated user can upload an image and use background removal", async ({
  page,
}) => {
  const imagePath = path.join(
    process.cwd(),
    "tests",
    "fixtures",
    "test-image.jpg",
  );

  await page.goto("/dashboard/create");

  await expect(
    page.getByRole("button", { name: "Edit Single Image" }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Edit Single Image" })
    .click();

  const imageInput = page.locator(
    'input[type="file"][accept="image/*"]:not([multiple])',
  );

  await imageInput.setInputFiles(imagePath);

  await expect(
    page.getByText("Uploading your image"),
  ).toBeVisible();

  const removeBgButton = page.getByRole("button", {
    name: /Remove BG/i,
  });

  await expect(removeBgButton).toBeVisible({
    timeout: 15000,
  });

  await expect(removeBgButton).toBeEnabled();

  await removeBgButton.click();

  await expect(
    page.getByRole("button", {
      name: "Processing... (2 credits)",
      exact: true,
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", {
      name: /Removed/i,
    }),
  ).toBeVisible({
    timeout: 20000,
  });
});