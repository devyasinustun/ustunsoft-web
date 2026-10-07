import { z } from "zod";
import faqData from "@/content/faq.json";

const localizedText = z.object({ tr: z.string().min(1), en: z.string().min(1) });

const faqSchema = z.array(
  z.object({
    slug: z.string().min(1),
    items: z.array(z.object({ q: localizedText, a: localizedText })).min(1),
  }),
);

export type FaqGroup = z.infer<typeof faqSchema>[number];

// Uygulama bazlı sık sorulan sorular (content/faq.json).
export async function getFaq(): Promise<FaqGroup[]> {
  return faqSchema.parse(faqData);
}
