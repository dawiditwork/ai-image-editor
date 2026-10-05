import { expect, test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Missing E2E_EMAIL or E2E_PASSWORD environment variables",
    );
  }

  await page.goto("/auth/sign-in");

  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);

  await page.getByRole("button", { name: /sign in/i }).click();

await page.waitForURL((url) => !url.pathname.includes("/auth/sign-in"), {
  timeout: 15_000,
});

  await page.context().storageState({
    path: authFile,
  });
});