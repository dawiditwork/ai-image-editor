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