"use server";

import { headers } from "next/headers";

import { auth } from "~/lib/auth";
import { CREDIT_COSTS } from "~/lib/credit-costs";
import type { CreditOperation } from "~/lib/credit-costs";
import { db } from "~/server/db";

export async function deductCredits(operation: CreditOperation) {
  try {
    const creditsToDeduct = CREDIT_COSTS[operation];

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const result = await db.user.updateMany({
      where: {
        id: session.user.id,
        credits: {
          gte: creditsToDeduct,
        },
      },
      data: {
        credits: {
          decrement: creditsToDeduct,
        },
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "Insufficient credits",
      };
    }

    const updatedUser = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        credits: true,
      },
    });

    if (!updatedUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return {
      success: true,
      remainingCredits: updatedUser.credits,
      operation,
      deductedCredits: creditsToDeduct,
    };
  } catch (error) {
    console.error(`Credit deduction error for ${operation}:`, error);

    return {
      success: false,
      error: "Failed to deduct credits",
    };
  }
}