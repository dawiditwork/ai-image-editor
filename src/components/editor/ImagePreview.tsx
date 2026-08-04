"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";

interface UploadedImage {
  fileId: string;
  url: string;
  name: string;
  filePath: string;
}

interface ImagePreviewProps {
  uploadedImage: UploadedImage | null;
  imageRef: React.RefObject<HTMLImageElement | null>;
  processingText: string;
  isProcessing: boolean;

  imageSrc: string;

  onBack: () => void;
  onLoad: () => void;
  onError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export default function ImagePreview({
  uploadedImage,
  imageRef,
  processingText,
  isProcessing,
  imageSrc,
  onBack,
  onLoad,
  onError,
}: ImagePreviewProps) {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-3">
        
  
                 <div className="mb-4 flex items-center justify-between rounded-xl border bg-gradient-to-r from-slate-50 to-white px-4 py-2 shadow-sm">
  <div className="flex items-center gap-3">
<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">      
  <ImageIcon className="h-4 w-4 text-blue-600" />
    </div>

<div className="flex flex-col gap-0.5">    
<h2 className="text-base font-semibold text-slate-900 mb-0.5">        
  Image Editor
      </h2>

      <p className="text-xs text-slate-500">
        AI-powered image editing
      </p>
    </div>
  </div>

  <Button
    variant="outline"
    onClick={onBack}
    className="gap-2 rounded-lg px-4"
  >
    <ArrowLeft className="h-4 w-4" />
    Back
  </Button>
</div>
 <div className="bg-slate-50 relative flex min-h-[650px] items-center justify-center overflow-hidden rounded-lg border">                      {isProcessing && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                            <div className="text-center text-white">
                              <div className="relative mb-2">
                                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                              </div>
                            <p className="text-sm font-semibold">
                              {processingText}
                            </p>
                              <p className="mt-1 text-xs text-white/80">
                                Please wait
                              </p>
                            </div>
                          </div>
                        )}
                  {uploadedImage && (

                        <img
                        ref={imageRef}
                        src={imageSrc}
                        alt={uploadedImage.name}
                        className="h-auto w-auto max-h-[700px] max-w-full object-contain"
                        onLoad={onLoad}
                        onError={onError}
                        />
                )}
                      </div>
                   

      </CardContent>
    </Card>
  );
}