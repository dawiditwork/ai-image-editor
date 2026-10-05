"use client";

import { RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui";
import { useEffect, useRef, useState } from "react";

import { updateProjectTransformations } from "~/actions/projects";
import EditorSidebar from "~/components/editor/EditorSidebar";
import ImagePreview from "~/components/editor/ImagePreview";
import ProjectsGrid from "~/components/editor/ProjectsGrid";
import UploadScreen from "~/components/editor/UploadScreen";
import PdfConverter from "~/components/PdfConverter";
import Upgrade from "~/components/sidebar/upgrade";
import { useImageEditor } from "~/hooks/useImageEditor";
import { useImageUpload } from "~/hooks/useImageUpload";
import { usePdf } from "~/hooks/usePdf";
import { useProjects } from "~/hooks/useProjects";

import type { EditorMode, UploadedImage } from "~/types/editor";

export default function CreatePage() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null,
  );
  const [mode, setMode] = useState<EditorMode>("home");
  const [credits, setCredits] = useState(0);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const {
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
  } = useImageEditor({
    uploadedImage,
    imageRef,
    setCredits,
    activeProjectId,
    onInsufficientCredits: () => setUpgradeOpen(true),
  });

  const {
    isLoadingProjects,
    isOpeningProject,
    userProjects,
    setUserProjects,
  } = useProjects({
    setUploadedImage,
    setTransformations,
    setMode,
    setCredits,
    setActiveProjectId,
  });

  const { isUploading, selectFile, uploadFile } = useImageUpload({
    fileInputRef,
    setUploadedImage,
    setUserProjects,
    setMode,
    resetEditor,
    setActiveProjectId,
  });

  const {
    pdfImages,
    setPdfImages,
    getRootProps,
    getInputProps,
    isDragActive,
    generateMultiPdf,
    handlePdfFiles,
  } = usePdf();

  useEffect(() => {
    if (!activeProjectId) return;

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        const result = await updateProjectTransformations(
          activeProjectId,
          transformations,
        );

        if (!result.success) {
          console.error("Failed to autosave project:", result.error);
          return;
        }

        setUserProjects((previousProjects) =>
          previousProjects.map((project) =>
            project.id === activeProjectId
              ? {
                  ...project,
                  transformations,
                }
              : project,
          ),
        );
      })();
    }, 700);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeProjectId, transformations, setUserProjects]);

  return (
    <>
      <RedirectToSignIn />

      <SignedIn>
        <Upgrade
          open={upgradeOpen}
          onOpenChange={setUpgradeOpen}
          showTrigger={false}
        />

        <div className="min-h-screen">
          <div className="border-b border-gray-200 bg-white py-2">
            <div className="mx-auto max-w-7xl text-center">
              <h1 className="from-primary to-primary/70 mb-1 bg-gradient-to-r bg-clip-text text-lg font-bold text-transparent">
                Image Editing Tools
              </h1>

              <p className="text-muted-foreground mx-auto max-w-xl text-xs">
                Edit, enhance and convert images with AI-powered tools
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6">
            {isOpeningProject ? (
              <div className="flex min-h-[500px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                  <p className="text-muted-foreground text-sm">
                    Loading project...
                  </p>
                </div>
              </div>
            ) : mode === "home" ? (
              <UploadScreen
                isUploading={isUploading}
                selectFile={selectFile}
                setMode={setMode}
                fileInputRef={fileInputRef}
                pdfInputRef={pdfInputRef}
                uploadFile={uploadFile}
                handlePdfFiles={handlePdfFiles}
              />
            ) : mode === "pdf" ? (
              <PdfConverter
                pdfImages={pdfImages}
                setPdfImages={setPdfImages}
                generateMultiPdf={() => void generateMultiPdf()}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                isDragActive={isDragActive}
                onBack={() => setMode("home")}
              />
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:gap-4 lg:grid-cols-3">
                <div className="order-2 space-y-2 sm:space-y-3 lg:order-1 lg:col-span-1">
                  <EditorSidebar
                    credits={credits}
                    aiUnavailable={aiUnavailable}
                    isProcessing={isProcessing}
                    transformations={transformations}
                    objectInput={objectInput}
                    setObjectInput={setObjectInput}
                    aiEditPrompt={aiEditPrompt}
                    setAiEditPrompt={setAiEditPrompt}
                    resizeWidth={resizeWidth}
                    setResizeWidth={setResizeWidth}
                    resizeHeight={resizeHeight}
                    setResizeHeight={setResizeHeight}
                    pdfImages={pdfImages}
                    setPdfImages={setPdfImages}
                    getRootProps={getRootProps}
                    getInputProps={getInputProps}
                    isDragActive={isDragActive}
                    hasTransformation={hasTransformation}
                    removeTransformation={removeTransformation}
                    removeBackground={removeBackground}
                    upscaleImage={upscaleImage}
                    objectCrop={objectCrop}
                    aiEdit={aiEdit}
                    convertFormat={convertFormat}
                    applyResize={applyResize}
                    clearTransformations={clearTransformations}
                    downloadImage={downloadImage}
                    generateMultiPdf={() => void generateMultiPdf()}
                  />
                </div>

                <div className="order-1 space-y-2 sm:space-y-3 lg:order-2 lg:col-span-2">
                  <ImagePreview
                    uploadedImage={uploadedImage}
                    imageRef={imageRef}
                    processingText={processingText}
                    isProcessing={isProcessing}
                    imageSrc={imageSrc}
                    onBack={() => {
                      setUploadedImage(null);
                      setActiveProjectId(null);
                      resetEditor();
                      setMode("home");
                    }}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 bg-white px-2 py-3 sm:px-4 sm:py-4">
            <div className="mx-auto max-w-7xl">
              <div className="mb-6 text-center">
                <div className="mb-2 inline-flex items-center gap-2">
                  <div className="h-6 w-0.5 rounded-full bg-gradient-to-b from-blue-500 to-purple-600" />

                  <h2 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-xl font-bold text-transparent">
                    Your Recent Projects
                  </h2>

                  <div className="h-6 w-0.5 rounded-full bg-gradient-to-b from-purple-600 to-blue-500" />
                </div>

                <p className="text-muted-foreground mx-auto max-w-md text-sm">
                  Continue editing your previous creations
                </p>
              </div>
            </div>
          </div>

          <ProjectsGrid
            isLoadingProjects={isLoadingProjects}
            userProjects={userProjects}
            onProjectClick={(project) => {
              setUploadedImage({
                fileId: project.ImageKitId,
                url: project.imageUrl,
                name: project.name ?? "Untitled",
                filePath: project.filePath,
              });

              setActiveProjectId(project.id);
              setTransformations(project.transformations ?? []);
              setMode("editor");
            }}
          />
        </div>
      </SignedIn>
    </>
  );
}

