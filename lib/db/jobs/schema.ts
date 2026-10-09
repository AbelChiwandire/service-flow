import { z } from "zod";

const emptyToNull = (value: unknown) =>
    typeof value === "string" && value.trim() === "" ? null : value;

export const JobStatusSchema = z.enum(["scheduled", "in_progress", "completed", "cancelled"]);

export const JobFormSchema = z.object({
    title: z.string().trim().min(2).max(255),
    description: z.preprocess(emptyToNull, z.string().nullable().optional()),
    scheduledDate: z.iso.date(),
    status: JobStatusSchema.optional(),
});

export const IdSchema = z.uuid();

export type JobFormErrors = {
    title?: string[];
    description?: string[];
    scheduledDate?: string[];
    status?: string[];
};

export function formatValidationErrors(
    error: z.ZodError<Partial<z.infer<typeof JobFormSchema>>>,
): JobFormErrors {
    const tree = z.treeifyError(error);
    return {
        title: tree.properties?.title?.errors,
        description: tree.properties?.description?.errors,
        scheduledDate: tree.properties?.scheduledDate?.errors,
        status: tree.properties?.status?.errors,
    };
}
