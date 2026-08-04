export interface UploadedImage {
  fileId: string;
  url: string;
  name: string;
  filePath: string;
}

export interface Project {
  id: string;
  name: string | null;
  imageUrl: string;
  ImageKitId: string;
  filePath: string;
  transformations: Transformation[] | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transformation {
  aiRemoveBackground?: true;
  aiUpscale?: true;
  format?: "jpg" | "png" | "webp";
  resize?: {
    width: number;
    height: number;
  };
  raw?: string;
}

export interface UploadAuthResponse {
  signature: string;
  expire: number;
  token: string;
  publicKey: string;
}

export type EditorMode = "home" | "editor" | "pdf";