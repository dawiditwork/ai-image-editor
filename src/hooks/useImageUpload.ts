"use client";

import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { upload } from "@imagekit/next";
import { toast } from "sonner";

import {
  createProject,
  getUserProjects,
} from "~/actions/projects";

import type {
  EditorMode,
  Project,
  UploadedImage,
  UploadAuthResponse,
} from "~/types/editor";

interface UseImageUploadProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  setUploadedImage: Dispatch<SetStateAction<UploadedImage | null>>;
  setUserProjects: Dispatch<SetStateAction<Project[]>>;
  setMode: Dispatch<SetStateAction<EditorMode>>;
  resetEditor: () => void;
  setActiveProjectId: Dispatch<
  SetStateAction<string | null>
>;
}

export const useImageUpload = ({
  fileInputRef,
  setUploadedImage,
  setUserProjects,
  setMode,
  resetEditor,
  setActiveProjectId,
}: UseImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const getUploadAuth = async (): Promise<UploadAuthResponse> => {
    const response = await fetch("/api/upload-auth");

    if (!response.ok) {
      throw new Error("Failed to get upload authorization");
    }

    return response.json() as Promise<UploadAuthResponse>;
  };

  const selectFile = () => {
    resetEditor();
    setUploadedImage(null);

    if (!fileInputRef.current) return;

    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const uploadFile = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const authParams = await getUploadAuth();

      const result = await upload({
        file,
        fileName: file.name,
        folder: "/ai-image-editor",
        ...authParams,
      });

      if (!result.fileId || !result.url || !result.filePath) {
        throw new Error("ImageKit returned incomplete upload data");
      }

      const uploadedData: UploadedImage = {
        fileId: result.fileId,
        url: result.url,
        name: result.name ?? file.name,
        filePath: result.filePath,
      };

      resetEditor();
      setUploadedImage(uploadedData);
      setMode("editor");

      try {
        const projectResult = await createProject({
          imageUrl: uploadedData.url,
          imageKitId: uploadedData.fileId,
          filePath: uploadedData.filePath,
          name: uploadedData.name,
        });
        
        if (projectResult.success && projectResult.project) {
        setActiveProjectId(projectResult.project.id);
}

        if (!projectResult.success) {
          console.error(
            "Failed to save project:",
            projectResult.error,
          );

          toast.warning(
            "Image uploaded, but the project could not be saved",
          );

          return;
        }

        const projectsResult = await getUserProjects();

        if (projectsResult.success && projectsResult.projects) {
          setUserProjects(projectsResult.projects);
        }
      } catch (projectError) {
        console.error("Project save error:", projectError);

        toast.warning(
          "Image uploaded, but the project could not be saved",
        );
      }

      toast.success("Upload successful!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return {
    isUploading,
    selectFile,
    uploadFile,
  };
};