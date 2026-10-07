import { z } from "zod";

const localizedText = z.object({ tr: z.string().min(1), en: z.string().min(1) });
const localizedList = z.object({
  tr: z.array(z.string().min(1)),
  en: z.array(z.string().min(1)),
});

const imageSchema = z.object({
  src: z.string().startsWith("/apps/"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const appSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    packageName: z.string().min(1),
    name: localizedText,
    category: z.enum(["game", "app"]),
    status: z.enum(["published", "coming-soon"]),
    featured: z.boolean(),
    order: z.number().int(),
    accentColor: z.string().regex(/^#[0-9a-f]{6}$/i),
    playUrl: z.url().optional(),
    shortDescription: localizedText,
    description: localizedText,
    features: localizedList,
    stats: z
      .object({
        // Google Play'in gösterdiği alt sınır (10K+ için 10000).
        downloads: z.number().int().nonnegative(),
        rating: z.number().min(1).max(5).optional(),
        // Google Play'deki oy sayısı; verilirse JSON-LD aggregateRating'e eklenir.
        ratingCount: z.number().int().positive().optional(),
      })
      .optional(),
    ageRating: z.string().optional(),
    // YYYY-MM
    updatedAt: z
      .string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/)
      .optional(),
    icon: z.string().startsWith("/apps/").optional(),
    screenshots: z.array(imageSchema),
  })
  .refine((app) => app.status !== "published" || app.playUrl, {
    message: "published uygulamada playUrl zorunlu",
    path: ["playUrl"],
  });

export const appsSchema = z.array(appSchema);

export type App = z.infer<typeof appSchema>;
export type AppCategory = App["category"];
export type AppStatus = App["status"];
