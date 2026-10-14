import { z } from "zod";

export const autoPlanSchema = z.object({
  selectedTopicId: z.string().min(1, "Please select a curriculum scope"),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
  dailyHours: z
    .number()
    .min(0.5, "Daily study commitment must be at least 30 minutes (0.5 hrs)")
    .max(12, "Daily study commitment cannot exceed 12 hours"),
  includeSolved: z.boolean(),
  replaceExisting: z.boolean(),
});

export type AutoPlanFormValues = z.infer<typeof autoPlanSchema>;
