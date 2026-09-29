"use server";
import { createProjectSchema } from "~/lib/project-schemas";
import { updateProjectTransformationsSchema } from "~/lib/project-schemas";
import { headers } from "next/headers";
import { CREDIT_COSTS } from "~/lib/credit-costs";
import type { CreditOperation } from "~/lib/credit-costs";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

import type { Transformation } from "~/types/editor";

interface CreateProjectData {
  imageUrl: string;
  imageKitId: string;
  filePath: string;
  name?: string;
}

export async function createProject(data: CreateProjectData) {
  try {

        const parsed = createProjectSchema.safeParse(data);

        if (!parsed.success) {
          return {
            success: false,
            error: "Invalid project data",
          };
        }


    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
    const expectedPathPrefix = `/ai-image-editor/${session.user.id}/`;

      if (!parsed.data.filePath.startsWith(expectedPathPrefix)) {
        return {
          success: false,
          error: "Invalid file ownership",
        };
}

    const project = await db.project.create({
      data: {
        name: parsed.data.name ?? "Untitled Project",
        imageUrl: parsed.data.imageUrl,
        ImageKitId: parsed.data.imageKitId,
        filePath: parsed.data.filePath,
        userId: session.user.id,
        transformations: [],
      },
    });

    return {
      success: true,
      project,
    };
  } catch (error) {
    console.error("Project creation error:", error);

    return {
      success: false,
      error: "Failed to create project",
    };
  }
}

export async function getUserProjects() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const projects = await db.project.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const normalizedProjects = projects.map((project) => ({
      ...project,
      transformations: Array.isArray(project.transformations)
        ? (project.transformations as unknown as Transformation[])
        : null,
    }));

    return {
      success: true,
      projects: normalizedProjects,
    };
  } catch (error) {
    console.error("Projects fetch error:", error);

    return {
      success: false,
      error: "Failed to fetch projects",
    };
  }
}

export async function updateProjectTransformations(
  projectId: string,
  transformations: Transformation[],
) {
  try {
    const parsed = updateProjectTransformationsSchema.safeParse({
      projectId,
      transformations,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid project data",
      };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const result = await db.project.updateMany({
      where: {
        id: parsed.data.projectId,
        userId: session.user.id,
      },
      data: {
        transformations: parsed.data.transformations,
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Project transformations update error:",
      error,
    );

    return {
      success: false,
      error: "Failed to save project",
    };
  }
}


export async function applyRemoveBackground(projectId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success:  false as const,
        error: "Unauthorized",
      };
    }

    const result = await db.$transaction(async (tx) => {
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

      const alreadyApplied = parsed.data.transformations.some(
        (transformation) => transformation.aiRemoveBackground,
      );

      if (alreadyApplied) {
        return {
          success: false as const,
          error: "Background removal already applied",
        };
      }

      const creditCost = CREDIT_COSTS.removeBackground;

      const creditResult = await tx.user.updateMany({
        where: {
          id: session.user.id,
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

      const nextTransformations = [
        ...parsed.data.transformations,
        {
          aiRemoveBackground: true as const,
        },
      ];

      await tx.project.update({
        where: {
          id: project.id,
        },
        data: {
          transformations: nextTransformations,
        },
      });

      const updatedUser = await tx.user.findUnique({
        where: {
          id: session.user.id,
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
        transformations: nextTransformations,
      };
    });

    return result;
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

    const result = await db.$transaction(async (tx) => {
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

      const alreadyApplied = parsed.data.transformations.some(
        (transformation) => transformation.aiUpscale,
      );

      if (alreadyApplied) {
        return {
          success: false as const,
          error: "Upscale already applied",
        };
      }

      const creditCost = CREDIT_COSTS.upscale;

      const creditResult = await tx.user.updateMany({
        where: {
          id: session.user.id,
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

      const nextTransformations = [
        ...parsed.data.transformations,
        {
          aiUpscale: true as const,
        },
      ];

      await tx.project.update({
        where: {
          id: project.id,
        },
        data: {
          transformations: nextTransformations,
        },
      });

      const updatedUser = await tx.user.findUnique({
        where: {
          id: session.user.id,
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
        transformations: nextTransformations,
      };
    });

    return result;
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

    const result = await db.$transaction(async (tx) => {
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

      const alreadyApplied = parsed.data.transformations.some(
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

      const creditCost = CREDIT_COSTS.smartCrop;

      const creditResult = await tx.user.updateMany({
        where: {
          id: session.user.id,
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

      const nextTransformations = [
        ...parsed.data.transformations,
        {
          raw: `fo-${encodeURIComponent(cleanInput)},ar-1-1`,
        },
      ];

      await tx.project.update({
        where: {
          id: project.id,
        },
        data: {
          transformations: nextTransformations,
        },
      });

      const updatedUser = await tx.user.findUnique({
        where: {
          id: session.user.id,
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
        transformations: nextTransformations,
      };
    });

    return result;
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

    const result = await db.$transaction(async (tx) => {
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

      const creditCost = CREDIT_COSTS.aiEdit;

      const creditResult = await tx.user.updateMany({
        where: {
          id: session.user.id,
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

      const nextTransformations = [
        ...parsed.data.transformations.filter(
          (transformation) =>
            !transformation.raw?.startsWith("e-edit"),
        ),
        {
          raw: `e-edit-prompt-${encodeURIComponent(cleanPrompt)}`,
        },
      ];

      await tx.project.update({
        where: {
          id: project.id,
        },
        data: {
          transformations: nextTransformations,
        },
      });

      const updatedUser = await tx.user.findUnique({
        where: {
          id: session.user.id,
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
        transformations: nextTransformations,
      };
    });

    return result;
  } catch (error) {
    console.error("AI edit processing error:", error);

    return {
      success: false as const,
      error: "Failed to apply AI edit",
    };
  }
}
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