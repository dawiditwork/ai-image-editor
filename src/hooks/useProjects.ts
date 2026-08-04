"use client";

import { useEffect, useState } from "react";

import { getUserProjects } from "~/actions/projects";
import { authClient } from "~/lib/auth-client";

import type {
  EditorMode,
  Project,
  Transformation,
  UploadedImage,
} from "~/types/editor";

interface UseProjectsProps {
  setUploadedImage: React.Dispatch<
    React.SetStateAction<UploadedImage | null>
  >;

  setTransformations: React.Dispatch<
    React.SetStateAction<Transformation[]>
  >;

  setMode: React.Dispatch<
    React.SetStateAction<EditorMode>
  >;

  setCredits: React.Dispatch<
    React.SetStateAction<number>
  >;
  setActiveProjectId: React.Dispatch<
  React.SetStateAction<string | null>
>;
}

export const useProjects = ({
  setUploadedImage,
  setTransformations,
  setMode,
  setCredits,
  setActiveProjectId,
}: UseProjectsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] =
    useState(true);

  const [userProjects, setUserProjects] = useState<Project[]>(
    [],
  );

  useEffect(() => {
    const initializeData = async () => {
      try {
        await authClient.getSession();

        const creditsResponse = await fetch("/api/credits");

        if (!creditsResponse.ok) {
          throw new Error("Failed to fetch credits");
        }

        const creditsData = (await creditsResponse.json()) as {
          credits?: number;
        };

        setCredits(creditsData.credits ?? 0);

        const projectsResult = await getUserProjects();

        if (
          projectsResult.success &&
          projectsResult.projects
        ) {
          setUserProjects(projectsResult.projects);
        }
      } catch (error) {
        console.error(
          "Failed to initialize project data:",
          error,
        );
      } finally {
        setIsLoading(false);
        setIsLoadingProjects(false);
      }
    };

    void initializeData();
  }, [setCredits]);

  useEffect(() => {
    if (isLoadingProjects) return;
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(
      window.location.search,
    );

    const projectId = params.get("projectId");

    if (!projectId) return;

    const project = userProjects.find(
      (currentProject) =>
        currentProject.id === projectId,
    );

    if (!project) return;

    setUploadedImage({
      fileId: project.ImageKitId,
      url: project.imageUrl,
      name: project.name ?? "Untitled",
      filePath: project.filePath,
    });

    setActiveProjectId(project.id);
    setTransformations(project.transformations ?? []);
    setMode("editor");
  }, [
    isLoadingProjects,
    userProjects,
    setUploadedImage,
    setTransformations,
    setMode,
    setActiveProjectId,
  ]);

  return {
    isLoading,
    isLoadingProjects,
    userProjects,
    setUserProjects,
  };
};