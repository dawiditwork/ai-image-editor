"use client";

import { FileText, Upload, X } from "lucide-react";
import { Button } from "~/components/ui/button";

interface Props {
  pdfImages: File[];
  setPdfImages: React.Dispatch<React.SetStateAction<File[]>>;
  generateMultiPdf: () => void;
  getRootProps: () => React.HTMLAttributes<HTMLElement>;
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
  isDragActive: boolean;
  onBack: () => void;
}

export default function PdfConverter({
  pdfImages,
  setPdfImages,
  generateMultiPdf,
  getRootProps,
  getInputProps,
  isDragActive,
  onBack,
}: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border bg-white p-8 shadow-xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold">Images to PDF</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Convert multiple images into a single PDF document.
            </p>

            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                JPG
              </span>

              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                PNG
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                WEBP
              </span>
            </div>
          </div>

          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>

        <div className="rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 p-5">
          <div className="space-y-5">
            <div className="rounded-lg border border-teal-200 bg-teal-100/50 p-3 text-sm text-teal-800">
              📚 Combine multiple images into one PDF
            </div>

            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200 ${
                isDragActive
                  ? "border-teal-500 bg-teal-100"
                  : "border-teal-300 hover:border-teal-500 hover:bg-teal-50"
              }`}
            >
              <input {...getInputProps()} />

              <Upload className="mx-auto mb-4 h-12 w-12 text-teal-600" />

              <p className="text-lg font-semibold">
                Drag & Drop your images
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Click to browse or drop multiple files here
              </p>
            </div>

            {pdfImages.length > 0 && (
              <div className="space-y-2">
                {pdfImages.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm"
                  >
                    <span className="truncate text-sm font-medium">
                      {file.name}
                    </span>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setPdfImages((prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center text-sm font-medium text-teal-700">
              {pdfImages.length === 0
                ? "No images selected"
                : `${pdfImages.length} image${pdfImages.length > 1 ? "s" : ""} selected`}
            </div>

            <Button
              onClick={generateMultiPdf}
              disabled={pdfImages.length === 0}
              className="h-11 w-full bg-teal-600 text-white hover:bg-teal-700"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}