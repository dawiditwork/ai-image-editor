"use server";

import { headers } from "next/headers";

import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export async function getUserPurchases() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false as const,
        error: "Unauthorized",
        purchases: [],
      };
    }

    const purchases = await db.purchase.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        polarOrderId: true,
        credits: true,
        packageName: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
      },
    });

    return {
      success: true as const,
      purchases,
    };
  } catch (error) {
    console.error("Purchases fetch error:", error);

    return {
      success: false as const,
      error: "Failed to fetch purchases",
      purchases: [],
    };
  }
}