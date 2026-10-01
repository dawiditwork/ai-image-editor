import { CREDIT_COSTS } from "~/lib/credit-costs";
import type { CreditOperation } from "~/lib/credit-costs";
import { updateProjectTransformationsSchema } from "~/lib/project-schemas";
import { db } from "~/server/db";
import type { Transformation } from "~/types/editor";
import { Prisma } from "@prisma/client";

type BuildTransformationResult =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      transformations: Transformation[];
    };

export async function runPaidTransformation({
  projectId,
  userId,
  operation,
  buildTransformations,
}: {
  projectId: string;
  userId: string;
  operation: CreditOperation;
  buildTransformations: (
    transformations: Transformation[],
  ) => BuildTransformationResult;
}) {
  return db.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
      select: {
        id: true,
        transformations: true,
      },
    });

    if (!project) {
      return {
        success: false as const,
        error: "Project not found",
      };
    }

    const parsed = updateProjectTransformationsSchema.safeParse({
      projectId: project.id,
      transformations: Array.isArray(project.transformations)
        ? project.transformations
        : [],
    });

    if (!parsed.success) {
      throw new Error("Invalid stored project transformations");
    }

   const transformationResult = buildTransformations(
  parsed.data.transformations,
);
    if (!transformationResult.success) {
      return {
        success: false as const,
        error: transformationResult.error,
      };
    }

    const creditCost = CREDIT_COSTS[operation];

    const creditResult = await tx.user.updateMany({
      where: {
        id: userId,
        credits: {
          gte: creditCost,
        },
      },
      data: {
        credits: {
          decrement: creditCost,
        },
      },
    });

    if (creditResult.count === 0) {
      return {
        success: false as const,
        error: "Insufficient credits",
      };
    }
await tx.project.update({
  where: {
    id: project.id,
  },
  data: {
    transformations:
      transformationResult.transformations as unknown as Prisma.InputJsonValue,
  },
});

    const updatedUser = await tx.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        credits: true,
      },
    });

    if (!updatedUser) {
      throw new Error("User not found after credit deduction");
    }

    return {
      success: true as const,
      remainingCredits: updatedUser.credits,
      transformations: transformationResult.transformations,
    };
  });
}