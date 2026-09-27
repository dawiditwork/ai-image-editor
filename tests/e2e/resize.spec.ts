import path from "node:path";
import { expect, test } from "@playwright/test";

test("authenticated user can upload an image and resize it", async ({ page }) => {
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

  await page.getByRole("button", { name: "Edit Single Image" }).click();

  const imageInput = page.locator(
    'input[type="file"][accept="image/*"]:not([multiple])',
  );

  await imageInput.setInputFiles(imagePath);

  await expect(page.getByText("Uploading your image")).toBeVisible();

  const widthInput = page.getByPlaceholder("Width");
  const heightInput = page.getByPlaceholder("Height");

  await expect(widthInput).toBeVisible({
    timeout: 15000,
  });

  await expect(heightInput).toBeVisible({
    timeout: 15000,
  });

  await widthInput.fill("800");
  await heightInput.fill("600");

  const resizeButton = page.getByRole("button", {
    name: /^Resize$/,
  });

  await expect(resizeButton).toBeEnabled();

  await resizeButton.click();

  await expect(resizeButton).toBeHidden({
    timeout: 10000,
  });
});