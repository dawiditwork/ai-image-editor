const POLAR_CREDITS: Record<string, number> = {
  "2936d517-b6b8-4afa-8016-82508de848a9": 50,
  "ca9df392-3a7f-44eb-b050-70b16eb4e2a6": 200,
  "29381f1e-0f43-407e-a15d-73c4db0a9a98": 1000,
};

export function getCreditsForProduct(
  productId: string | null,
): number | null {
  if (!productId) {
    return null;
  }

  return POLAR_CREDITS[productId] ?? null;
}