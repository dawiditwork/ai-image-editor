"use client";

import { useState, type ChangeEvent } from "react";
import { useDropzone } from "react-dropzone";
import jsPDF from "jspdf";
import { toast } from "sonner";

type NormalizedImage = {
  dataUrl: string;
  width: number;
  height: number;
};

const normalizeImage = async (
  file: File,
): Promise<NormalizedImage> => {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = new Image();

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(new Error(`Failed to load ${file.name}`));

      image.src = objectUrl;
    });

    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;

    if (!naturalWidth || !naturalHeight) {
      throw new Error(`Invalid image dimensions: ${file.name}`);
    }

    // Ograniczenie ogromnych zdjęć ze skanera/telefonu.
    // Nadal daje dobrą jakość w PDF, ale nie zabija pamięci.
    const maxDimension = 3500;
    const scale = Math.min(
      1,
      maxDimension / Math.max(naturalWidth, naturalHeight),
    );

    const canvasWidth = Math.round(naturalWidth * scale);
    const canvasHeight = Math.round(naturalHeight * scale);

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas is not supported");
    }

    // Białe tło, żeby przezroczyste PNG/WEBP nie zrobiły się czarne.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    context.drawImage(
      image,
      0,
      0,
      canvasWidth,
      canvasHeight,
    );

    return {
      dataUrl: canvas.toDataURL("image/jpeg", 0.92),
      width: canvasWidth,
      height: canvasHeight,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const usePdf = () => {
  const [pdfImages, setPdfImages] = useState<File[]>([]);

  const generateMultiPdf = async (filesArg?: File[]) => {
    const files = filesArg ?? pdfImages;

    if (files.length === 0) {
      toast.error("Please select images first");
      return;
    }

   try {
  let pdf: jsPDF | null = null;

  for (const [index, file] of files.entries()) {
    if (!file) continue;

    const normalizedImage = await normalizeImage(file);

    const orientation =
      normalizedImage.width > normalizedImage.height
        ? "landscape"
        : "portrait";

    if (!pdf) {
      pdf = new jsPDF({
        orientation,
        unit: "mm",
        format: "a4",
        compress: true,
      });
    } else {
      pdf.addPage("a4", orientation);
    }

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 8;
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    const ratio = Math.min(
      availableWidth / normalizedImage.width,
      availableHeight / normalizedImage.height,
    );

    const imageWidth = normalizedImage.width * ratio;
    const imageHeight = normalizedImage.height * ratio;

    const x = (pageWidth - imageWidth) / 2;
    const y = (pageHeight - imageHeight) / 2;

    pdf.addImage(
      normalizedImage.dataUrl,
      "JPEG",
      x,
      y,
      imageWidth,
      imageHeight,
      undefined,
      "FAST",
    );
  }

      if (!pdf) {
        throw new Error("No valid images were added");
      }

      pdf.save("images.pdf");

      toast.success(
        `${files.length} image(s) converted to PDF!`,
      );
    } catch (error) {
      console.error("PDF generation error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate PDF",
      );
    }
  };

  const handlePdfFiles = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) return;

    setPdfImages(files);

    toast.success(`${files.length} image(s) selected`);

    await generateMultiPdf(files);

    event.target.value = "";
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setPdfImages((previousImages) => {
      const updatedImages = [
        ...previousImages,
        ...acceptedFiles,
      ];

      toast.success(
        `${acceptedFiles.length} image(s) added. Total: ${updatedImages.length}`,
      );

      return updatedImages;
    });
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: true,
  });

  const clearPdfImages = () => {
    setPdfImages([]);
  };

  return {
    pdfImages,
    setPdfImages,
    getRootProps,
    getInputProps,
    isDragActive,
    generateMultiPdf,
    handlePdfFiles,
    clearPdfImages,
  };
};