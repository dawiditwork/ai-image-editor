import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("~/lib/polar-credits", () => ({
  getCreditsForProduct: vi.fn(),
}));

vi.mock("~/server/db", () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    purchase: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import { getCreditsForProduct } from "~/lib/polar-credits";
import { processPolarOrder } from "~/lib/process-polar-order";
import { db } from "~/server/db";

describe("processPolarOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // domyślnie znany produkt = 50 credits
    vi.mocked(getCreditsForProduct).mockReturnValue(50);
  });

  it("does not process the same Polar order twice", async () => {
    vi.mocked(db.user.findUnique).mockResolvedValue({
      id: "user-1",
      name: "Dawid",
      email: "test@example.com",
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      credits: 10,
    });

    vi.mocked(db.purchase.findUnique)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: "purchase-1",
        polarOrderId: "order-123",
        userId: "user-1",
        credits: 50,
        createdAt: new Date(),
      });

    vi.mocked(db.purchase.create).mockResolvedValue({
      id: "purchase-1",
      polarOrderId: "order-123",
      userId: "user-1",
      credits: 50,
      createdAt: new Date(),
    });

    vi.mocked(db.user.update).mockResolvedValue({
      id: "user-1",
      name: "Dawid",
      email: "test@example.com",
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      credits: 60,
    });

    vi.mocked(db.$transaction).mockResolvedValue([
      {
        id: "purchase-1",
        polarOrderId: "order-123",
        userId: "user-1",
        credits: 50,
        createdAt: new Date(),
      },
      {
        id: "user-1",
        credits: 60,
      },
    ] as never);

    const order = {
      id: "order-123",
      productId: "2936d517-b6b8-4afa-8016-82508de848a9",
      customer: {
        externalId: "user-1",
      },
    };

    await processPolarOrder(order);
    await processPolarOrder(order);

    expect(db.$transaction).toHaveBeenCalledTimes(1);
    expect(db.purchase.create).toHaveBeenCalledTimes(1);
    expect(db.user.update).toHaveBeenCalledTimes(1);
  });

  it("handles duplicate Polar order caused by a race condition", async () => {
    vi.mocked(db.user.findUnique).mockResolvedValue({
      id: "user-1",
      name: "Dawid",
      email: "test@example.com",
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      credits: 10,
    });

    vi.mocked(db.purchase.findUnique).mockResolvedValue(null);

    vi.mocked(db.$transaction).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "test",
      }),
    );

    const order = {
      id: "order-123",
      productId: "2936d517-b6b8-4afa-8016-82508de848a9",
      customer: {
        externalId: "user-1",
      },
    };

    await expect(processPolarOrder(order)).resolves.toBeUndefined();

    expect(db.$transaction).toHaveBeenCalledTimes(1);
  });

  it("throws when Polar customer has no externalId", async () => {
    const order = {
      id: "order-123",
      productId: "2936d517-b6b8-4afa-8016-82508de848a9",
      customer: {
        externalId: null,
      },
    };

    await expect(processPolarOrder(order)).rejects.toThrow(
      "Polar customer has no externalId",
    );

    expect(db.user.findUnique).not.toHaveBeenCalled();
    expect(db.purchase.findUnique).not.toHaveBeenCalled();
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("throws when Polar product is unknown", async () => {
    vi.mocked(db.user.findUnique).mockResolvedValue({
      id: "user-1",
      name: "Dawid",
      email: "test@example.com",
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      credits: 10,
    });

    vi.mocked(getCreditsForProduct).mockReturnValue(null);

    const order = {
      id: "order-123",
      productId: "unknown-product-id",
      customer: {
        externalId: "user-1",
      },
    };

    await expect(processPolarOrder(order)).rejects.toThrow(
      "Unknown Polar product: unknown-product-id",
    );

    expect(db.purchase.findUnique).not.toHaveBeenCalled();
    expect(db.$transaction).not.toHaveBeenCalled();
  });
});