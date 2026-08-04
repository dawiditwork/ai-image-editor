"use server";

import { Prisma } from "@prisma/client";
import { headers } from "next/headers";

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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const project = await db.project.create({
      data: {
        name: data.name ?? "Untitled Project",
        imageUrl: data.imageUrl,
        ImageKitId: data.imageKitId,
        filePath: data.filePath,
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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const project = await db.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!project) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    await db.project.update({
      where: {
        id: projectId,
      },
      data: {
        transformations:
          transformations as unknown as Prisma.InputJsonValue,
      },
    });

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

export async function deductCredits(
  creditsToDeduct: number,
  operation?: string,
) {
  try {
    if (
      !Number.isInteger(creditsToDeduct) ||
      creditsToDeduct <= 0
    ) {
      return {
        success: false,
        error: "Invalid credit amount",
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
    };
  } catch (error) {
    console.error(
      `Credit deduction error${
        operation ? ` for ${operation}` : ""
      }:`,
      error,
    );

    return {
      success: false,
      error: "Failed to deduct credits",
    };
  }
}