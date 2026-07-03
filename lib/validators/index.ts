import { z } from "zod";

// ── Enums (mirror Prisma) ────────────────────────────────────────────────────

export const MemoryTypeSchema = z.enum(["PHOTO", "VIDEO", "JOURNAL", "AUDIO", "LOCATION"]);
export const ExhibitThemeSchema = z.enum(["GOLD", "AURORA", "RAIN", "NEUTRAL"]);

// ── Pagination ───────────────────────────────────────────────────────────────

export const PaginationSchema = z.object({
  cursor: z.string().cuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ── Wing ────────────────────────────────────────────────────────────────────

export const CreateWingSchema = z.object({
  name: z.string().min(1).max(80).trim(),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
});

// ── Exhibit ──────────────────────────────────────────────────────────────────

export const CreateExhibitSchema = z.object({
  title: z.string().min(1).max(120).trim(),
  description: z.string().max(2000).trim().optional(),
  wingId: z.string().cuid().optional(),
  theme: ExhibitThemeSchema.default("NEUTRAL"),
  coverMemoryId: z.string().cuid().optional(),
});

export const UpdateExhibitSchema = CreateExhibitSchema.partial().extend({
  id: z.string().cuid(),
  isPublished: z.boolean().optional(),
  aiGeneratedNarrative: z.string().max(2000).optional(),
});

// ── Memory ───────────────────────────────────────────────────────────────────

export const CreateMemorySchema = z.object({
  type: MemoryTypeSchema,
  mediaUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  capturedAt: z.coerce.date().optional(),
  locationLat: z.number().min(-90).max(90).optional(),
  locationLng: z.number().min(-180).max(180).optional(),
  locationName: z.string().max(200).trim().optional(),
  caption: z.string().max(2000).trim().optional(),
  exhibitId: z.string().cuid().optional(),
  peopleIds: z.array(z.string().cuid()).max(50).default([]),
});

export const UpdateMemorySchema = CreateMemorySchema.partial().extend({
  id: z.string().cuid(),
});

export const MemoryListQuerySchema = PaginationSchema.extend({
  exhibitId: z.string().cuid().optional(),
  wingId: z.string().cuid().optional(),
  type: MemoryTypeSchema.optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// ── Upload ───────────────────────────────────────────────────────────────────

export const RequestUploadUrlSchema = z.object({
  fileName: z.string().min(1).max(260),
  mimeType: z.string().min(1).max(100),
  fileSizeBytes: z.number().int().positive().max(500 * 1024 * 1024), // 500 MB max
  memoryType: MemoryTypeSchema,
});

// ── Person ───────────────────────────────────────────────────────────────────

export const CreatePersonSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  relation: z.string().max(60).trim().optional(),
});

// ── API Response helpers ──────────────────────────────────────────────────────

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: string; details?: unknown };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function apiSuccess<T>(data: T): ApiSuccess<T> {
  return { success: true, data };
}

export function apiError(message: string, details?: unknown): ApiError {
  return { success: false, error: message, details };
}

// ── Inferred types ────────────────────────────────────────────────────────────

export type CreateMemoryInput = z.infer<typeof CreateMemorySchema>;
export type UpdateMemoryInput = z.infer<typeof UpdateMemorySchema>;
export type CreateExhibitInput = z.infer<typeof CreateExhibitSchema>;
export type UpdateExhibitInput = z.infer<typeof UpdateExhibitSchema>;
export type CreateWingInput = z.infer<typeof CreateWingSchema>;
export type RequestUploadUrlInput = z.infer<typeof RequestUploadUrlSchema>;
export type MemoryListQuery = z.infer<typeof MemoryListQuerySchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
