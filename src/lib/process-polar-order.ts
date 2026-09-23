import { Prisma } from "@prisma/client";

import { getCreditsForProduct } from "~/lib/polar-credits";
import { db } from "~/server/db";

type PolarOrderInput = {
  id: string;
  productId: string | null;
  customer: {
    externalId?: string | null;
  };
};

export async function processPolarOrder(order: PolarOrderInput) {
  const polarOrderId = order.id;
  const productId = order.productId;
  const externalCustomerId = order.customer.externalId;
  
if (!productId) {
  console.error("POLAR_MISSING_PRODUCT_ID", {
    orderId: polarOrderId,
  });

  throw new Error("Polar order has no productId");
}
  console.log("POLAR_ORDER_RECEIVED", {
    polarOrderId,
    productId,
    externalCustomerId,
  });

  if (!externalCustomerId) {
    console.error("POLAR_MISSING_EXTERNAL_CUSTOMER_ID", {
      orderId: polarOrderId,
    });

    throw new Error("Polar customer has no externalId");
  }

  const user = await db.user.findUnique({
    where: {
      id: externalCustomerId,
    },
  });

  if (!user) {
    console.error("POLAR_USER_NOT_FOUND", {
      orderId: polarOrderId,
      externalCustomerId,
    });

    throw new Error("No matching user found for Polar order");
  }

  const creditsToAdd = getCreditsForProduct(productId);

  if (creditsToAdd === null) {
    console.error("POLAR_UNKNOWN_PRODUCT", {
      orderId: polarOrderId,
      productId,
    });

    throw new Error(`Unknown Polar product: ${productId}`);
  }

  const existingPurchase = await db.purchase.findUnique({
    where: {
      polarOrderId,
    },
  });

  if (existingPurchase) {
    console.log("POLAR_ORDER_ALREADY_PROCESSED", {
      polarOrderId,
    });

    return;
  }

  try {
    await db.$transaction([
      db.purchase.create({
        data: {
          polarOrderId,
          userId: user.id,
          credits: creditsToAdd,
        },
      }),

      db.user.update({
        where: {
          id: user.id,
        },
        data: {
          credits: {
            increment: creditsToAdd,
          },
        },
      }),
    ]);

    console.log("POLAR_ORDER_PROCESSED", {
      polarOrderId,
      userId: user.id,
      creditsAdded: creditsToAdd,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      console.log("POLAR_DUPLICATE_ORDER", {
        polarOrderId,
      });

      return;
    }

    console.error("POLAR_ORDER_PROCESSING_FAILED", {
      polarOrderId,
      productId,
      userId: user.id,
      error,
    });

    throw error;
  }
}