"use client";

import { Upload, Image as ImageIcon, Download } from "lucide-react";
import { Button } from "~/components/ui/button";

interface UploadScreenProps {
  isUploading: boolean;
  selectFile: () => void;
  setMode: (mode: "home" | "editor" | "pdf") => void;
fileInputRef: React.RefObject<HTMLInputElement | null>;
pdfInputRef: React.RefObject<HTMLInputElement | null>;
  uploadFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePdfFiles: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadScreen({
  isUploading,
  selectFile,
  setMode,
  fileInputRef,
  pdfInputRef,
  uploadFile,
  handlePdfFiles,
}: UploadScreenProps) {
  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="w-full max-w-2xl">
        {isUploading ? (
          <div className="border-border from-muted/50 via-background to-muted/30 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 text-center shadow-xl sm:p-12">
            <div className="from-primary/5 to-primary/10 absolute inset-0 bg-gradient-to-br" />
            <div className="relative z-10">
              <div className="relative mb-6">
                <div className="border-muted border-t-primary mx-auto h-16 w-16 animate-spin rounded-full border-4" />
              </div>
              <h3 className="text-foreground mb-2 text-lg font-bold">
                Uploading your image
              </h3>
              <p className="text-muted-foreground text-sm">
                Processing your file with AI magic ✨
              </p>
            </div>
          </div>
        ) : (
          <div className="group border-border from-muted/30 via-background to-muted/50 hover:border-primary/50 hover:bg-muted/40 relative overflow-hidden rounded-2xl border-2 border-dashed bg-gradient-to-br p-6 text-center transition-all duration-300 hover:shadow-xl sm:p-12">
            <div className="relative z-10">
              <div className="bg-primary mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full shadow-lg">
                <ImageIcon className="text-primary-foreground h-12 w-12" />
              </div>

              <h3 className="text-foreground mb-3 text-xl font-bold">
                AI Image Toolkit
              </h3>

              <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-gray-600">
                Choose a tool below to edit images, enhance photos or create
                PDFs.
              </p>

              <div className="mx-auto grid max-w-md gap-4">
                <Button
                  onClick={selectFile}
                  variant="outline"
                  className="h-24 flex-col gap-2 border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-500 hover:bg-blue-100"
                >
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-semibold">Edit Single Image</div>
                    <div className="text-xs opacity-70">
                      Remove BG, Resize, Upscale
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => setMode("pdf")}
                  variant="outline"
                className="h-24 flex-col gap-2 border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-orange-500 hover:bg-orange-100"
                >
                  <Download className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="font-semibold">Images to PDF</div>
                    <div className="text-xs opacity-70">
                      Combine multiple images into one PDF
                    </div>
                  </div>
                </Button>

                <input
                  ref={pdfInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePdfFiles}
                  className="hidden"
                />
              </div>
            </div>

            <Upload className="absolute bottom-4 left-4 h-6 w-6 text-purple-400 opacity-20" />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={uploadFile}
          className="hidden"
        />
      </div>
    </div>
  );
}