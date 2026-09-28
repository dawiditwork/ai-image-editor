export const CREDIT_COSTS = {
  removeBackground: 2,
  upscale: 1,
  smartCrop: 1,
  aiEdit: 2,
} as const;

export type CreditOperation = keyof typeof CREDIT_COSTS;