"use server";

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