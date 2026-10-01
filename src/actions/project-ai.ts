"use server";

import { CREDIT_COSTS } from "~/lib/credit-costs";
import { updateProjectTransformationsSchema } from "~/lib/project-schemas";
import { db } from "~/server/db";
import { headers } from "next/headers";

import { auth } from "~/lib/auth";
import { runPaidTransformation } from "~/lib/run-paid-transformation";

export async function applyRemoveBackground(projectId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false as const,
        error: "Unauthorized",
      };
    }

    return await runPaidTransformation({
      projectId,
      userId: session.user.id,
      operation: "removeBackground",
      buildTransformations(transformations) {
        const alreadyApplied = transformations.some(
          (transformation) => transformation.aiRemoveBackground,
        );

        if (alreadyApplied) {
          return {
            success: false as const,
            error: "Background removal already applied",
          };
        }

        return {
          success: true as const,
          transformations: [
            ...transformations,
            {
              aiRemoveBackground: true as const,
            },
          ],
        };
      },
    });
  } catch (error) {
    console.error("Remove background processing error:", error);

    return {
      success: false as const,
      error: "Failed to apply background removal",
    };
  }
}

export async function applyUpscale(projectId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false as const,
        error: "Unauthorized",
      };
    }

    return await runPaidTransformation({
      projectId,
      userId: session.user.id,
      operation: "upscale",
      buildTransformations(transformations) {
        const alreadyApplied = transformations.some(
          (transformation) => transformation.aiUpscale,
        );

        if (alreadyApplied) {
          return {
            success: false as const,
            error: "Upscale already applied",
          };
        }

        return {
          success: true as const,
          transformations: [
            ...transformations,
            {
              aiUpscale: true as const,
            },
          ],
        };
      },
    });
  } catch (error) {
    console.error("Upscale processing error:", error);

    return {
      success: false as const,
      error: "Failed to apply upscale",
    };
  }
}

export async function applySmartCrop(
  projectId: string,
  objectInput: string,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false as const,
        error: "Unauthorized",
      };
    }

    const cleanInput = objectInput.trim().toLowerCase();

    if (!cleanInput) {
      return {
        success: false as const,
        error: "Invalid object",
      };
    }

    return await runPaidTransformation({
      projectId,
      userId: session.user.id,
      operation: "smartCrop",
      buildTransformations(transformations) {
        const alreadyApplied = transformations.some(
          (transformation) =>
            transformation.raw?.includes("fo-") &&
            transformation.raw.includes("ar-1-1"),
        );

        if (alreadyApplied) {
          return {
            success: false as const,
            error: "Smart crop already applied",
          };
        }

        return {
          success: true as const,
          transformations: [
            ...transformations,
            {
              raw: `fo-${encodeURIComponent(cleanInput)},ar-1-1`,
            },
          ],
        };
      },
    });
  } catch (error) {
    console.error("Smart crop processing error:", error);

    return {
      success: false as const,
      error: "Failed to apply smart crop",
    };
  }
}

export async function applyAiEdit(
  projectId: string,
  prompt: string,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false as const,
        error: "Unauthorized",
      };
    }

    const cleanPrompt = prompt.trim();

    if (!cleanPrompt) {
      return {
        success: false as const,
        error: "Invalid prompt",
      };
    }

    return await runPaidTransformation({
      projectId,
      userId: session.user.id,
      operation: "aiEdit",
      buildTransformations(transformations) {
        return {
          success: true as const,
          transformations: [
            ...transformations.filter(
              (transformation) =>
                !transformation.raw?.startsWith("e-edit"),
            ),
            {
              raw: `e-edit-prompt-${encodeURIComponent(cleanPrompt)}`,
            },
          ],
        };
      },
    });
  } catch (error) {
    console.error("AI edit processing error:", error);

    return {
      success: false as const,
      error: "Failed to apply AI edit",
    };
  }
}
type PaidTransformationType =
  | "background"
  | "upscale"
  | "objectCrop"
  | "aiEdit";

export async function undoPaidTransformation(
  projectId: string,
  type: PaidTransformationType,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false as const,
        error: "Unauthorized",
      };
    }

    return await db.$transaction(async (tx) => {
      const project = await tx.project.findFirst({
        where: {
          id: projectId,
          userId: session.user.id,
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

      const transformations = parsed.data.transformations;

      let operation:
        | "removeBackground"
        | "upscale"
        | "smartCrop"
        | "aiEdit";

      let exists = false;

      const nextTransformations = transformations.filter(
        (transformation) => {
          if (
            type === "background" &&
            transformation.aiRemoveBackground
          ) {
            exists = true;
            return false;
          }

          if (
            type === "upscale" &&
            transformation.aiUpscale
          ) {
            exists = true;
            return false;
          }

          if (
            type === "objectCrop" &&
            transformation.raw?.includes("fo-") &&
            transformation.raw.includes("ar-1-1")
          ) {
            exists = true;
            return false;
          }

          if (
            type === "aiEdit" &&
            transformation.raw?.startsWith("e-edit")
          ) {
            exists = true;
            return false;
          }

          return true;
        },
      );

      if (!exists) {
        return {
          success: false as const,
          error: "Transformation not found",
        };
      }

      switch (type) {
        case "background":
          operation = "removeBackground";
          break;

        case "upscale":
          operation = "upscale";
          break;

        case "objectCrop":
          operation = "smartCrop";
          break;

        case "aiEdit":
          operation = "aiEdit";
          break;
      }

      await tx.project.update({
        where: {
          id: project.id,
        },
        data: {
          transformations: nextTransformations,
        },
      });

      const updatedUser = await tx.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          credits: {
            increment: CREDIT_COSTS[operation],
          },
        },
        select: {
          credits: true,
        },
      });

      return {
        success: true as const,
        transformations: nextTransformations,
        remainingCredits: updatedUser.credits,
        refundedCredits: CREDIT_COSTS[operation],
      };
    });
  } catch (error) {
    console.error("Undo paid transformation error:", error);

    return {
      success: false as const,
      error: "Failed to undo transformation",
    };
  }
}