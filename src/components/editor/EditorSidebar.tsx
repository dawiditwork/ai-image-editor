"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import {
  Scissors,
  Expand,
  Target,
  Download,
  RotateCcw,
  Minus,
  Upload,
  X,
} from "lucide-react";

interface EditorSidebarProps {
  credits: number;
  aiUnavailable: boolean;
  isProcessing: boolean;
  transformations: unknown[];

  objectInput: string;
  setObjectInput: (value: string) => void;

  aiEditPrompt: string;
  setAiEditPrompt: (value: string) => void;

  resizeWidth: string;
  setResizeWidth: (value: string) => void;

  resizeHeight: string;
  setResizeHeight: (value: string) => void;

  pdfImages: File[];
  setPdfImages: React.Dispatch<React.SetStateAction<File[]>>;

    getRootProps: () => React.HTMLAttributes<HTMLElement>;
    getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
  isDragActive: boolean;

  hasTransformation: (type: string) => boolean;
  removeTransformation: (type: string) => void;

  removeBackground: () => void;
  upscaleImage: () => void;
  objectCrop: () => void;
  aiEdit: () => void;
  convertFormat: (format: "jpg" | "png" | "webp") => void;
  applyResize: () => void;
  clearTransformations: () => void;
  downloadImage: () => void;
  generateMultiPdf: () => void;
}
export default function EditorSidebar({
  credits,
  aiUnavailable,
  isProcessing,
  transformations,
  objectInput,
  setObjectInput,
  aiEditPrompt,
  setAiEditPrompt,
  resizeWidth,
  setResizeWidth,
  resizeHeight,
  setResizeHeight,
  pdfImages,
  setPdfImages,
  getRootProps,
  getInputProps,
  isDragActive,
  hasTransformation,
  removeTransformation,
  removeBackground,
  upscaleImage,
  objectCrop,
  aiEdit,
  convertFormat,
  applyResize,
  clearTransformations,
  downloadImage,
  generateMultiPdf,
}: EditorSidebarProps) {
  return (
    
               <Card className="shadow-lg">
                            <CardContent className="p-5">
                              <div className="mb-3 flex items-start justify-between">
                                <div>
                                  <div className="mb-3 rounded-lg border bg-gradient-to-r from-amber-50 to-orange-50 p-3">
                                     <p className="text-xs text-muted-foreground">
                                      Available Credits
                                    </p>
                                      <p className="text-lg font-bold text-orange-600">
                                      {credits}
                                    </p>
                                    </div>
                                    <h3 className="mb-0.5 text-sm font-bold">
                                    AI Effects
                                  </h3>
                                  {aiUnavailable && (
                                  <div className="mb-3 rounded-lg border border-yellow-200 bg-yellow-50 p-2 text-xs text-yellow-800">
                                    AI tools are temporarily unavailable due to provider limits.
                                    Free tools are still available.
                                  </div>
        )}
                                  <p className="text-muted-foreground text-xs">
                                    Transform your image
                                  </p>
                                </div>
                              </div>
        
                              <div className="space-y-2">
                                <div className="grid gap-2 sm:grid-cols-1">
                                  <div className="group relative">
                                    <Button
                                      onClick={removeBackground}
                                      disabled={
                                            aiUnavailable ||  
                                        isProcessing || hasTransformation("background")
                                      }
                                      variant="outline"
                                      size="sm"
                                      className="h-8 w-full gap-1 px-2 text-xs hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
                                    >
                                      <Scissors className="h-3 w-3" />
                                      <span className="text-xs">
                                        {isProcessing
                                          ? "Processing..."
                                          : hasTransformation("background")
                                            ? "Removed ✓"
                                            : "Remove BG"}
                                      </span>
                                      {!hasTransformation("background") && (
                                        <span className="text-muted-foreground ml-1 text-xs">
                                          (2 credits)
                                        </span>
                                      )}
                                    </Button>
                                    {hasTransformation("background") && (
                                      <Button
                                        onClick={() =>
                                          removeTransformation("background")
                                        }
                                        disabled={isProcessing}
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                      >
                                        <Minus className="h-2 w-2" />
                                      </Button>
                                    )}
                                  </div>
        
                                  <div className="group relative">
                                    <Button
                                      onClick={upscaleImage}
                                      disabled={
                                         aiUnavailable ||
                                        isProcessing || hasTransformation("upscale")
                                      }
                                      variant="outline"
                                      size="sm"
                                      className="h-8 w-full gap-1 px-2 text-xs hover:border-blue-200 hover:bg-blue-50 disabled:opacity-50"
                                    >
                                      <Expand className="h-3 w-3" />
                                      <span className="text-xs">
                                        {isProcessing
                                          ? "Processing..."
                                          : hasTransformation("upscale")
                                            ? "Upscaled ✓"
                                            : "AI Upscale"}
                                      </span>
                                      {!hasTransformation("upscale") && (
                                        <span className="text-muted-foreground ml-1 text-xs">
                                          (1 credit)
                                        </span>
                                      )}
                                    </Button>
                                    {hasTransformation("upscale") && (
                                      <Button
                                        onClick={() => removeTransformation("upscale")}
                                        disabled={isProcessing}
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                      >
                                        <Minus className="h-2 w-2" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
        
                                <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-2">
                                  {/* Smart Object Crop Section */}
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <div className="rounded-full bg-green-500 p-1">
                                        <Target className="h-3 w-3 text-white" />
                                      </div>
                                      <div>
                                        <h4 className="text-xs font-bold text-green-900">
                                          Smart Object Crop
                                        </h4>
                                        <p className="text-xs text-green-700">1 credit</p>
                                      </div>
                                    </div>
        
                                    <Input
                                      placeholder="Enter object (e.g., person, car)"
                                      value={objectInput}
                                      onChange={(e) => {
                                        setObjectInput(e.target.value);
                                      }}
                                      disabled={
                                        isProcessing || hasTransformation("objectCrop")
                                      }
                                      className="h-7 border-green-200 bg-white text-xs focus:border-green-400 focus:ring-green-400"
                                    />
        
                                    <div className="rounded-md border border-green-200 bg-green-100/50 p-1.5">
                                      <p className="text-xs text-green-800">
                                        ✨ AI crops around specified object in 1:1 ratio
                                      </p>
                                    </div>
        
                                    <div className="flex gap-1">
                                      <Button
                                        onClick={objectCrop}
                                        disabled={
                                          isProcessing ||
                                          hasTransformation("objectCrop") ||
                                          !objectInput.trim()
                                        }
                                        variant="default"
                                        size="sm"
                                        className="h-7 flex-1 gap-1 bg-green-600 px-2 text-white hover:bg-green-700"
                                      >
                                        <Target className="h-2 w-2" />
                                        <span className="text-xs">
                                          {isProcessing
                                            ? "Processing..."
                                            : hasTransformation("objectCrop")
                                              ? "Applied ✓"
                                              : "Apply"}
                                        </span>
                                      </Button>
                                      {hasTransformation("objectCrop") && (
                                        <Button
                                          onClick={() =>
                                            removeTransformation("objectCrop")
                                          }
                                          disabled={isProcessing}
                                          variant="outline"
                                          size="sm"
                                          className="h-7 w-7 border-red-200 p-0 text-red-600 hover:bg-red-50"
                                        >
                                          <Minus className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
        
                                        <div className="rounded-lg border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 p-2">
                                        <div className="space-y-2">
                                          <div>
                                            <h4 className="text-xs font-bold text-indigo-900">
                                              Magic AI Edit
                                            </h4>
                                            <p className="text-xs text-indigo-700">2 credits</p>
                                          </div>
        
                                          <Input
                                            placeholder="e.g. Remove the person, add snow..."
                                            value={aiEditPrompt}
                                            onChange={(e) => setAiEditPrompt(e.target.value)}
                                            disabled={isProcessing}
                                            className="h-7 border-indigo-200 bg-white text-xs"
                                          />
        
                                          <div className="rounded-md border border-indigo-200 bg-indigo-100/50 p-1.5">
                                            <p className="text-xs text-indigo-800">
                                              ✨ Describe what you want AI to change
                                            </p>
                                          </div>
        
                                          <Button
                                            onClick={aiEdit}
                                            disabled={
                                              aiUnavailable ||
                                              isProcessing || !aiEditPrompt.trim()}
                                            size="sm"
                                            className="h-7 w-full bg-indigo-600 text-white hover:bg-indigo-700"
                                          >
                                            {isProcessing ? "Processing..." : "Apply AI Edit"}
                                          </Button>
                                        </div>
        </div>
        
        
                                {/* Format Converter */}
                                <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-2">
                                  <div className="space-y-2">
                                    <div>
                                      <h4 className="text-xs font-bold text-blue-900">
                                        Format Converter
                                      </h4>
                                      <p className="text-xs text-blue-700">FREE</p>
                                    </div>
        
                                    <div className="grid grid-cols-3 gap-1">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => convertFormat("jpg")}
                                      >
                                        JPG
                                      </Button>
        
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => convertFormat("png")}
                                      >
                                        PNG
                                      </Button>
        
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => convertFormat("webp")}
                                      >
                                        WEBP
                                      </Button>
                                    </div>
                                  </div>
                                </div>
        
        
                                <div className="rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-2">
                                <div className="space-y-2">
                                  <div>
                                    <h4 className="text-xs font-bold text-purple-900">
                                      Resize Image
                                    </h4>
                                    <p className="text-xs text-purple-700">FREE</p>
                                  </div>
        
                                  <div className="grid grid-cols-2 gap-1">
                                    <Input
                                      type="number"
                                      placeholder="Width"
                                      value={resizeWidth}
                                      onChange={(e) => setResizeWidth(e.target.value)}
                                      disabled={isProcessing}
                                      className="h-7 text-xs"
                                    />
        
                                    <Input
                                      type="number"
                                      placeholder="Height"
                                      value={resizeHeight}
                                      onChange={(e) => setResizeHeight(e.target.value)}
                                      disabled={isProcessing}
                                      className="h-7 text-xs"
                                    />
                                  </div>
        
                                  <div className="flex gap-1">
                                    <Button
                                      onClick={applyResize}
                                      disabled={
                                        isProcessing ||
                                        !resizeWidth ||
                                        !resizeHeight ||
                                        hasTransformation("resize")
                                      }
                                      size="sm"
                                      className="h-7 flex-1 bg-purple-600 hover:bg-purple-700"
                                    >
                                      {hasTransformation("resize")
                                        ? "Applied ✓"
                                        : "Resize"}
                                    </Button>
        
                                    {hasTransformation("resize") && (
                                      <Button
                                        onClick={() => removeTransformation("resize")}
                                        variant="outline"
                                        size="sm"
                                        className="h-7 w-7 border-red-200 p-0 text-red-600 hover:bg-red-50"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                                      
        
                      
        
        
                              <div className="rounded-lg border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 p-2">
                              <div className="space-y-2">
                                <div>
                                  <h4 className="text-xs font-bold text-teal-900">
                                    Images to PDF
                                  </h4>
                                  <p className="text-xs text-teal-700">FREE</p>
                                </div>
        
                                <div className="rounded-md border border-teal-200 bg-teal-100/50 p-1.5">
                                  <p className="text-xs text-teal-800">
                                    📚 Combine multiple images into one PDF
                                  </p>
                                </div>
        
                              
                                <div className="space-y-2">
                                  <div
                                    {...getRootProps()}
                                    className={`
                                      cursor-pointer rounded-lg border-2 border-dashed p-6 text-center
                                      transition-all
                                      ${
                                        isDragActive
                                          ? "border-teal-500 bg-teal-50"
                                          : "border-teal-300 hover:border-teal-500"
                                      }
                                    `}
                                  >
                                    <input {...getInputProps()} />
        
                                    <Upload className="mx-auto mb-2 h-8 w-8 text-teal-600" />
        
                                    <p className="font-medium">
                                      Drag & Drop images here
                                    </p>
        
                                    <p className="text-xs opacity-70">
                                      or click to select files
                                    </p>
                                  </div>
        
                                  {pdfImages.length > 0 && (
                                    <div className="space-y-1">
                                      {pdfImages.map((file, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between rounded border p-2 text-xs"
                                        >
                                          <span className="truncate">{file.name}</span>
        
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                              setPdfImages((prev) =>
                                                prev.filter((_, i) => i !== index),
                                              )
                                            }
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
        
                                  <div className="text-center text-xs text-teal-700">
                                    {pdfImages.length} image(s) selected
                                  </div>
        
                                  <Button
                                    onClick={generateMultiPdf}
                                    disabled={pdfImages.length === 0}
                                    size="sm"
                                    className="h-7 w-full bg-teal-600 text-white hover:bg-teal-700"
                                  >
                                    Generate PDF
                                  </Button>
                                </div>
                                </div> {/* zamyka wewnętrzne space-y-2 */}
                                </div> {/* zamyka zewnętrzne space-y-2 */}
        
        
                                {transformations.length > 0 && (
                                  <div className="py-1 text-center">
                                    <div className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">
                                      <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                                      <span className="text-xs">
                                        {transformations.length} applied
                                      </span>
                                    </div>
                                  </div>
                                )}
        
                                {transformations.length > 0 && (
                                
                                  <Button
                                    onClick={clearTransformations}
                                    disabled={isProcessing}
                                    variant="destructive"
                                    size="sm"
                                    className="h-7 w-full gap-1 px-2"
                                  >
                                    <RotateCcw className="h-3 w-3" />
                                    <span className="text-xs">Clear All</span>
                                  </Button>
                                )}
        
                                <div className="flex gap-2 border-t pt-2">                          
          
                                  {transformations.length > 0 && (
                                    <>  
                                    <Button
                                      onClick={downloadImage}
                                      size="sm"
                                      className="h-7 gap-1 bg-gradient-to-r from-blue-600 to-purple-600 px-2 hover:from-blue-700 hover:to-purple-700"
                                    >
                                      <Download className="h-3 w-3" />
                                      <span className="text-xs">Download</span>
                                    </Button>
                                  
        
                                      </>
        
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
    
  );
}