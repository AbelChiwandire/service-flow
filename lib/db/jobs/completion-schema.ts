import { z } from 'zod';

// Invoice details collected when a job is marked as completed.
export const CompleteJobSchema = z.object({
    amount: z.coerce
        .number({ error: 'Enter a valid amount.' })
        .positive('Enter an amount greater than 0.')
        .max(99999999.99, 'Amount is too large.'),
    dueDate: z.iso.date({ error: 'Choose a due date.' }),
});

export type CompletionErrors = {
    amount?: string[];
    dueDate?: string[];
};

export function formatCompletionErrors(
    error: z.ZodError<z.infer<typeof CompleteJobSchema>>
): CompletionErrors {
    const tree = z.treeifyError(error);
    return {
        amount: tree.properties?.amount?.errors,
        dueDate: tree.properties?.dueDate?.errors,
    };
}