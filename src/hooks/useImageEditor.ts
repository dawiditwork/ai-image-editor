"use client";
import { useState, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  applyAiEdit,
  applyRemoveBackground,
  applySmartCrop,
  applyUpscale,
  undoPaidTransformation,
} from "~/actions/project-ai";
import { env } from "~/env";
import type {
  Transformation,
  UploadedImage,
} from "~/types/editor";
interface UseImageEditorProps {
  uploadedImage: UploadedImage | null;
  imageRef: RefObject<HTMLImageElement | null>;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  activeProjectId: string | null;
}
export const useImageEditor = ({
  uploadedImage,
  imageRef,
  setCredits,
  activeProjectId,
}: UseImageEditorProps) => {
  const router = useRouter();
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState("");
  const [pendingPaidTransformation, setPendingPaidTransformation] =
    useState<"background" | "upscale" | "objectCrop" | "aiEdit" | null>(
      null,
  );
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
      if (
        type === "aiEdit" &&
        transformation.raw?.startsWith("e-edit")
      ) {
        return true;
      }
      return false;
    });
  };
  const removeTransformation = (type: string) => {
    // Manual undo must never trigger the automatic provider-failure refund path.
    setPendingPaidTransformation(null);

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
        if (
          type === "aiEdit" &&
          transformation.raw?.startsWith("e-edit")
        ) {
          return false;
        }
        return true;
      }),
    );
    const transformationName =
      type === "aiEdit"
        ? "AI Edit"
        : type === "objectCrop"
          ? "Smart Crop"
          : type === "background"
            ? "Background Removal"
            : type === "upscale"
              ? "Upscale"
              : type.charAt(0).toUpperCase() + type.slice(1);
    toast.success(`${transformationName} removed.`);
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
      if (!activeProjectId) {
        toast.error("Project not found");
        setIsProcessing(false);
        return;
      }
      setPendingPaidTransformation("background");
      const result = await applyRemoveBackground(activeProjectId);
      if (!result.success) {
        setPendingPaidTransformation(null);
        toast.error(
          result.error ?? "Failed to remove background",
        );
        setIsProcessing(false);
        return;
      }
      setTransformations(result.transformations);
      setCredits(result.remainingCredits);
      toast.success(
        `Background removed! ${result.remainingCredits} credits remaining.`,
      );
      router.refresh();
    } catch (error) {
      setPendingPaidTransformation(null);
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
      if (!activeProjectId) {
        toast.error("Project not found");
        setIsProcessing(false);
        return;
      }
      setPendingPaidTransformation("upscale");
      const result = await applyUpscale(activeProjectId);
      if (!result.success) {
        setPendingPaidTransformation(null);
        toast.error(
          result.error ?? "Failed to upscale image",
        );
        setIsProcessing(false);
        return;
      }
      setTransformations(result.transformations);
      setCredits(result.remainingCredits);
      toast.success(
        `Image upscaled! ${result.remainingCredits} credits remaining.`,
      );
      router.refresh();
    } catch (error) {
      setPendingPaidTransformation(null);
      console.error("Upscaling error:", error);
      toast.error("Failed to upscale image");
      setIsProcessing(false);
    }
  };
  const objectCrop = async () => {
    if (!uploadedImage) return;
    if (aiUnavailable) {
      toast.error(
        "AI features are temporarily unavailable due to provider limits.",
      );
      return;
    }
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
      if (!activeProjectId) {
        toast.error("Project not found");
        setIsProcessing(false);
        return;
      }
      setPendingPaidTransformation("objectCrop");
      const result = await applySmartCrop(
        activeProjectId,
        cleanInput,
      );
      if (!result.success) {
        setPendingPaidTransformation(null);
        toast.error(
          result.error ?? "Failed to apply smart crop",
        );
        setIsProcessing(false);
        return;
      }
      setTransformations(result.transformations);
      setCredits(result.remainingCredits);
      toast.success(
        `Smart crop applied! ${result.remainingCredits} credits remaining.`,
      );
      router.refresh();
    } catch (error) {
      setPendingPaidTransformation(null);
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
      if (!activeProjectId) {
        toast.error("Project not found");
        setIsProcessing(false);
        return;
      }
      setPendingPaidTransformation("aiEdit");
      const result = await applyAiEdit(
        activeProjectId,
        cleanPrompt,
      );
      if (!result.success) {
        setPendingPaidTransformation(null);
        toast.error(
          result.error ?? "Failed to apply AI edit",
        );
        setIsProcessing(false);
        return;
      }
      setTransformations(result.transformations);
      setCredits(result.remainingCredits);
      toast.success(
        `AI edit applied! ${result.remainingCredits} credits remaining.`,
      );
      router.refresh();
    } catch (error) {
      setPendingPaidTransformation(null);
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
    setPendingPaidTransformation(null);
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
    setPendingPaidTransformation(null);
    setIsProcessing(false);
  };
  const handleImageError = async (
    event: React.SyntheticEvent<HTMLImageElement>,
  ) => {
    const failedSource = event.currentTarget.src;
    const isSmartCropTransformation =
      failedSource.includes("fo-") &&
      failedSource.includes("ar-1-1");
    const isAiTransformation =
      failedSource.includes("e-bgremove") ||
      failedSource.includes("e-upscale") ||
      failedSource.includes("e-edit") ||
      isSmartCropTransformation;
    if (isAiTransformation) {
      setAiUnavailable(true);
      if (pendingPaidTransformation && activeProjectId) {
        try {
          const refundResult = await undoPaidTransformation(
            activeProjectId,
            pendingPaidTransformation,
          );
          if (refundResult.success) {
            setTransformations(refundResult.transformations);
            setCredits(refundResult.remainingCredits);
            toast.error(
              `AI processing failed. ${refundResult.refundedCredits} credit(s) refunded.`,
            );
          } else {
            toast.error(
              "AI processing failed. Credit refund could not be completed.",
            );
          }
        } catch (error) {
          console.error("Automatic refund failed:", error);
          toast.error(
            "AI processing failed. Credit refund could not be completed.",
          );
        }
      } else {
        toast.error(
          "AI tools are temporarily unavailable. Free tools still work.",
        );
      }
      setPendingPaidTransformation(null);
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
