type PolarProduct = {
  credits: number;
  packageName: string;
  amount: number;
  currency: string;
};

const POLAR_PRODUCTS: Record<string, PolarProduct> = {
  "2936d517-b6b8-4afa-8016-82508de848a9": {
    credits: 50,
    packageName: "Small",
    amount: 499,
    currency: "CHF",
  },
  "ca9df392-3a7f-44eb-b050-70b16eb4e2a6": {
    credits: 200,
    packageName: "Medium",
    amount: 1499,
    currency: "CHF",
  },
  "29381f1e-0f43-407e-a15d-73c4db0a9a98": {
    credits: 1000,
    packageName: "Large",
    amount: 4999,
    currency: "CHF",
  },
};

export function getProductForPolarId(
  productId: string | null,
): PolarProduct | null {
  if (!productId) {
    return null;
  }

  return POLAR_PRODUCTS[productId] ?? null;
}

export function getCreditsForProduct(
  productId: string | null,
): number | null {
  return getProductForPolarId(productId)?.credits ?? null;
}