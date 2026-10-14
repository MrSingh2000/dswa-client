import { z } from "zod";

export const addTaskSchema = z.object({
  scheduledDate: z
    .string()
    .min(1, "Date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(120, "Title must not exceed 120 characters"),
  eventType: z.enum(["problem", "revision", "custom"], {
    error: "Please select a valid event type",
  }),
  notes: z
    .string()
    .trim()
    .max(500, "Notes must not exceed 500 characters")
    .optional(),
});

export type AddTaskFormValues = z.infer<typeof addTaskSchema>;
