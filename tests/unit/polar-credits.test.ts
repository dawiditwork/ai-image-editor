import { describe, expect, it } from "vitest";

import { getCreditsForProduct } from "~/lib/polar-credits";

describe("getCreditsForProduct", () => {
  it("returns 50 credits for the small package", () => {
    const result = getCreditsForProduct(
      "2936d517-b6b8-4afa-8016-82508de848a9",
    );

    expect(result).toBe(50);
  });

  it("returns 200 credits for the medium package", () => {
    const result = getCreditsForProduct(
      "ca9df392-3a7f-44eb-b050-70b16eb4e2a6",
    );

    expect(result).toBe(200);
  });

  it("returns 1000 credits for the large package", () => {
    const result = getCreditsForProduct(
      "29381f1e-0f43-407e-a15d-73c4db0a9a98",
    );

    expect(result).toBe(1000);
  });

  it("returns null for an unknown product", () => {
    const result = getCreditsForProduct("unknown-product");

    expect(result).toBeNull();
  });

  it("returns null when productId is null", () => {
    const result = getCreditsForProduct(null);

    expect(result).toBeNull();
  });
});