import { z } from "zod";

export const createProjectSchema = z.object({
  imageUrl: z
    .string()
    .url()
    .refine(
      (value) => {
        try {
          const url = new URL(value);
          return (
            url.protocol === "https:" &&
            url.hostname.endsWith("imagekit.io")
          );
        } catch {
          return false;
        }
      },
      {
        message: "Invalid ImageKit URL",
      },
    ),

  imageKitId: z.string().trim().min(1).max(255),

  filePath: z
    .string()
    .trim()
    .min(1)
    .max(500)
    .refine((value) => value.startsWith("/"), {
      message: "Invalid file path",
    }),

  name: z.string().trim().min(1).max(100).optional(),
});

export const transformationSchema = z.object({
  aiRemoveBackground: z.literal(true).optional(),
  aiUpscale: z.literal(true).optional(),
  format: z.enum(["jpg", "png", "webp"]).optional(),
  resize: z
    .object({
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .optional(),
  raw: z.string().optional(),
});
export const updateProjectTransformationsSchema = z.object({
  projectId: z.string().min(1),
  transformations: z.array(transformationSchema).max(100),
});