import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Upgrade from "~/components/sidebar/upgrade";

const { checkoutMock } = vi.hoisted(() => ({
  checkoutMock: vi.fn(),
}));

vi.mock("~/lib/auth-client", () => ({
  authClient: {
    checkout: checkoutMock,
  },
}));

describe("Upgrade", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("opens the credit packages dialog", async () => {
    const user = userEvent.setup();

    render(<Upgrade />);

    await user.click(
      screen.getByRole("button", { name: "Buy Credits" }),
    );

    expect(
      screen.getByRole("heading", { name: "Buy Credits" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Choose a credit package. Credits never expire.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Buy Small" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Buy Medium" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Buy Large" }),
    ).toBeInTheDocument();
  });

  it.each([
    ["Small", "small"],
    ["Medium", "medium"],
    ["Large", "large"],
  ])(
    "starts checkout for the %s package",
    async (packageName, slug) => {
      const user = userEvent.setup();

      render(<Upgrade />);

      await user.click(
        screen.getByRole("button", { name: "Buy Credits" }),
      );

      await user.click(
        screen.getByRole("button", {
          name: `Buy ${packageName}`,
        }),
      );

      expect(checkoutMock).toHaveBeenCalledOnce();

      expect(checkoutMock).toHaveBeenCalledWith({
        slug,
      });
    },
  );

  it("disables all purchase buttons while checkout is pending", async () => {
    const user = userEvent.setup();

    checkoutMock.mockImplementation(
      () => new Promise<void>(() => {}),
    );

    render(<Upgrade />);

    await user.click(
      screen.getByRole("button", { name: "Buy Credits" }),
    );

    await user.click(
      screen.getByRole("button", { name: "Buy Small" }),
    );

    expect(
      screen.getByRole("button", { name: "Processing..." }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Buy Medium" }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Buy Large" }),
    ).toBeDisabled();

    expect(checkoutMock).toHaveBeenCalledOnce();
  });

  it("prevents duplicate checkout attempts", async () => {
    const user = userEvent.setup();

    checkoutMock.mockImplementation(
      () => new Promise<void>(() => {}),
    );

    render(<Upgrade />);

    await user.click(
      screen.getByRole("button", { name: "Buy Credits" }),
    );

    const smallButton = screen.getByRole("button", {
      name: "Buy Small",
    });

    await user.click(smallButton);
    await user.click(smallButton);

    expect(checkoutMock).toHaveBeenCalledOnce();

    expect(checkoutMock).toHaveBeenCalledWith({
      slug: "small",
    });
  });

  it("restores purchase buttons when checkout fails", async () => {
    const user = userEvent.setup();

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    checkoutMock.mockRejectedValueOnce(
      new Error("Checkout failed"),
    );

    render(<Upgrade />);

    await user.click(
      screen.getByRole("button", { name: "Buy Credits" }),
    );

    await user.click(
      screen.getByRole("button", { name: "Buy Small" }),
    );

    expect(
      await screen.findByRole("button", {
        name: "Buy Small",
      }),
    ).toBeEnabled();

    expect(
      screen.getByRole("button", { name: "Buy Medium" }),
    ).toBeEnabled();

    expect(
      screen.getByRole("button", { name: "Buy Large" }),
    ).toBeEnabled();

    expect(checkoutMock).toHaveBeenCalledOnce();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "CHECKOUT_START_FAILED",
      expect.objectContaining({
        slug: "small",
      }),
    );

    consoleErrorSpy.mockRestore();
  });
});