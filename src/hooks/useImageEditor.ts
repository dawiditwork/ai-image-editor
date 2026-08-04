"use client";

import { useState, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deductCredits } from "~/actions/projects";
import { env } from "~/env";

import type {
  Transformation,
  UploadedImage,
} from "~/types/editor";

interface UseImageEditorProps {
  uploadedImage: UploadedImage | null;
  imageRef: RefObject<HTMLImageElement | null>;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
}

export const useImageEditor = ({
  uploadedImage,
  imageRef,
  setCredits,
}: UseImageEditorProps) => {
  const router = useRouter();

  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState("");

  const [objectInput, setObjectInput] = useState("");
  const [aiEditPrompt, setAiEditPrompt] = useState("");
  const [resizeWidth, setResizeWidth] = useState("");
  const [resizeHeight, setResizeHeight] = useState("");

  const [aiUnavailable, setAiUnavailable] = useState(false);

  const getTransformationString = () => {
    const parts: string[] = [];

    const aiEditTransformation = transformations.find((transformation) =>
      transformation.raw?.startsWith("e-edit"),
    );

    if (aiEditTransformation?.raw) {
      return aiEditTransformation.raw;
    }

    transformations.forEach((transformation) => {
      if (transformation.aiRemoveBackground) {
        parts.push("e-bgremove");
      }

      if (transformation.aiUpscale) {
        parts.push("e-upscale");
      }

      if (transformation.resize) {
        parts.push(`w-${transformation.resize.width}`);
        parts.push(`h-${transformation.resize.height}`);
      }

      if (transformation.format) {
        parts.push(`f-${transformation.format}`);
      }

      if (transformation.raw) {
        parts.push(transformation.raw);
      }
    });

    return parts.join(",");
  };

  const hasTransformation = (type: string) => {
    return transformations.some((transformation) => {
      if (
        type === "background" &&
        transformation.aiRemoveBackground
      ) {
        return true;
      }

      if (type === "upscale" && transformation.aiUpscale) {
        return true;
      }

      if (type === "resize" && transformation.resize) {
        return true;
      }

      if (
        type === "objectCrop" &&
        transformation.raw?.includes("fo-") &&
        transformation.raw.includes("ar-1-1")
      ) {
        return true;
      }

      return false;
    });
  };

  const removeTransformation = (type: string) => {
    setTransformations((previousTransformations) =>
      previousTransformations.filter((transformation) => {
        if (
          type === "background" &&
          transformation.aiRemoveBackground
        ) {
          return false;
        }

        if (type === "upscale" && transformation.aiUpscale) {
          return false;
        }

        if (type === "resize" && transformation.resize) {
          return false;
        }

        if (
          type === "objectCrop" &&
          transformation.raw?.includes("fo-") &&
          transformation.raw.includes("ar-1-1")
        ) {
          return false;
        }

        return true;
      }),
    );

    const transformationName =
      type.charAt(0).toUpperCase() + type.slice(1);

    toast.success(`${transformationName} transformation removed!`);
  };

  const removeBackground = async () => {
    if (!uploadedImage) return;

    if (aiUnavailable) {
      toast.error(
        "AI features are temporarily unavailable due to provider limits.",
      );
      return;
    }

    if (hasTransformation("background")) {
      toast.error("Background removal is already applied!");
      return;
    }

    setIsProcessing(true);
    setProcessingText("Removing background...");

    try {
      const creditResult = await deductCredits(
        2,
        "background removal",
      );

      if (!creditResult.success) {
        toast.error(
          creditResult.error ?? "Failed to process payment",
        );
        setIsProcessing(false);
        return;
      }

      setTransformations((previousTransformations) => [
        ...previousTransformations,
        { aiRemoveBackground: true },
      ]);

      if (typeof creditResult.remainingCredits === "number") {
        setCredits(creditResult.remainingCredits);
      }

      toast.success(
        `Background removed! ${creditResult.remainingCredits} credits remaining.`,
      );

      router.refresh();
    } catch (error) {
      console.error("Background removal error:", error);
      toast.error("Failed to remove background");
      setIsProcessing(false);
    }
  };

  const upscaleImage = async () => {
    if (!uploadedImage) return;

    if (aiUnavailable) {
      toast.error(
        "AI features are temporarily unavailable due to provider limits.",
      );
      return;
    }

    if (hasTransformation("upscale")) {
      toast.error("Image upscaling is already applied!");
      return;
    }

    setIsProcessing(true);
    setProcessingText("Upscaling image...");

    try {
      const creditResult = await deductCredits(1, "upscaling");

      if (!creditResult.success) {
        toast.error(
          creditResult.error ?? "Failed to process payment",
        );
        setIsProcessing(false);
        return;
      }

      setTransformations((previousTransformations) => [
        ...previousTransformations,
        { aiUpscale: true },
      ]);

      if (typeof creditResult.remainingCredits === "number") {
        setCredits(creditResult.remainingCredits);
      }

      toast.success(
        `Image upscaled! ${creditResult.remainingCredits} credits remaining.`,
      );

      router.refresh();
    } catch (error) {
      console.error("Upscaling error:", error);
      toast.error("Failed to upscale image");
      setIsProcessing(false);
    }
  };

  const objectCrop = async () => {
    if (!uploadedImage) return;

    if (hasTransformation("objectCrop")) {
      toast.error("Smart object crop is already applied!");
      return;
    }

    const cleanInput = objectInput.trim().toLowerCase();

    if (!cleanInput) {
      toast.error("Please enter an object to focus on!");
      return;
    }

    setIsProcessing(true);
    setProcessingText("Applying smart crop...");

    try {
      setTransformations((previousTransformations) => [
        ...previousTransformations,
        {
          raw: `fo-${encodeURIComponent(cleanInput)},ar-1-1`,
        },
      ]);

      toast.success(
        `Smart crop applied focusing on "${objectInput.trim()}"!`,
      );
    } catch (error) {
      console.error("Object crop error:", error);
      toast.error("Failed to apply smart crop");
      setIsProcessing(false);
    }
  };

  const aiEdit = async () => {
    if (!uploadedImage) return;

    if (aiUnavailable) {
      toast.error(
        "AI features are temporarily unavailable due to provider limits.",
      );
      return;
    }

    const cleanPrompt = aiEditPrompt.trim();

    if (!cleanPrompt) {
      toast.error("Please enter what you want to edit");
      return;
    }

    setIsProcessing(true);
    setProcessingText("Applying AI edit...");

    try {
      setTransformations((previousTransformations) => [
        ...previousTransformations.filter(
          (transformation) =>
            !transformation.raw?.startsWith("e-edit"),
        ),
        {
          raw: `e-edit-prompt-${encodeURIComponent(cleanPrompt)}`,
        },
      ]);

      toast.success("AI edit applied!");
    } catch (error) {
      console.error("AI edit error:", error);
      toast.error("Failed to apply AI edit");
      setIsProcessing(false);
    }
  };

  const applyResize = async () => {
    if (!uploadedImage) return;

    const width = Number(resizeWidth);
    const height = Number(resizeHeight);

    if (!Number.isInteger(width) || !Number.isInteger(height)) {
      toast.error("Width and height must be whole numbers");
      return;
    }

    if (width < 10 || height < 10) {
      toast.error("Minimum size is 10px");
      return;
    }

    if (width > 5000 || height > 5000) {
      toast.error("Maximum size is 5000px");
      return;
    }

    setIsProcessing(true);
    setProcessingText("Resizing image...");

    try {
      setTransformations((previousTransformations) => [
        ...previousTransformations.filter(
          (transformation) => !transformation.resize,
        ),
        {
          resize: {
            width,
            height,
          },
        },
      ]);

      toast.success(`Image resized to ${width}x${height}`);
    } catch (error) {
      console.error("Resize error:", error);
      toast.error("Resize failed");
      setIsProcessing(false);
    }
  };

  const convertFormat = async (
    format: "jpg" | "png" | "webp",
  ) => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    setProcessingText(
      `Converting to ${format.toUpperCase()}...`,
    );

    try {
      setTransformations((previousTransformations) => [
        ...previousTransformations.filter(
          (transformation) => !transformation.format,
        ),
        { format },
      ]);

      toast.success(`Converted to ${format.toUpperCase()}!`);
    } catch (error) {
      console.error("Format conversion error:", error);
      toast.error("Format conversion failed");
      setIsProcessing(false);
    }
  };

  const clearTransformations = () => {
    setTransformations([]);
    toast.success("All transformations cleared!");
  };

  const resetEditor = () => {
    setTransformations([]);
    setObjectInput("");
    setAiEditPrompt("");
    setResizeWidth("");
    setResizeHeight("");
    setProcessingText("");
    setIsProcessing(false);
  };

  const downloadImage = async () => {
    if (!uploadedImage) return;

    try {
      const transformationString = getTransformationString();

      const fallbackUrl =
        `${env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}` +
        `${uploadedImage.filePath}` +
        `${
          transformationString
            ? `?tr=${transformationString}`
            : ""
        }`;

      const imageUrl = imageRef.current?.src ?? fallbackUrl;

      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch image: ${response.status}`,
        );
      }

      const blob = await response.blob();

      const selectedFormat = transformations.find(
        (transformation) => transformation.format,
      )?.format;

      const originalExtension =
        uploadedImage.name.split(".").pop()?.toLowerCase() ?? "jpg";

      const extension =
        selectedFormat ??
        (["jpg", "jpeg", "png", "webp"].includes(originalExtension)
          ? originalExtension
          : "jpg");

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = `edited-image.${extension}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(blobUrl);

      toast.success("Download completed!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed");
    }
  };

  const handleImageLoad = () => {
    setIsProcessing(false);
  };

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement>,
  ) => {
    const failedSource = event.currentTarget.src;

    const isAiTransformation =
      failedSource.includes("e-bgremove") ||
      failedSource.includes("e-upscale") ||
      failedSource.includes("e-edit");

    if (isAiTransformation) {
      setAiUnavailable(true);

      setTransformations((previousTransformations) =>
        previousTransformations.filter(
          (transformation) =>
            !transformation.aiRemoveBackground &&
            !transformation.aiUpscale &&
            !transformation.raw?.startsWith("e-edit"),
        ),
      );

      toast.error(
        "AI tools are temporarily unavailable. Free tools still work.",
      );
    } else {
      toast.error("Image failed to load.");
    }

    setIsProcessing(false);
  };

  const transformationString = getTransformationString();

  const imageSrc = uploadedImage
    ? `${env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}${uploadedImage.filePath}${
        transformationString
          ? `?tr=${transformationString}`
          : ""
      }`
    : "";

  return {
    transformations,
    setTransformations,

    isProcessing,
    processingText,

    objectInput,
    setObjectInput,

    aiEditPrompt,
    setAiEditPrompt,

    resizeWidth,
    setResizeWidth,

    resizeHeight,
    setResizeHeight,

    aiUnavailable,

    imageSrc,

    hasTransformation,
    removeTransformation,
    removeBackground,
    upscaleImage,
    objectCrop,
    aiEdit,
    applyResize,
    convertFormat,
    clearTransformations,
    resetEditor,
    downloadImage,
    handleImageLoad,
    handleImageError,
  };
};