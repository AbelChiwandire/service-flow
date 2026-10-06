import { z } from 'zod';

export const CustomerFormSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    phone: z.string().min(2),
    address: z.string().min(5),
});

export const IdSchema = z.uuid();

export type CustomerFormErrors = {
    name?: string[];
    email?: string[];
    phone?: string[];
    address?: string[];
};

export function formatValidationErrors(
    error: z.ZodError<Partial<z.infer<typeof CustomerFormSchema>>>
): CustomerFormErrors {
    const tree = z.treeifyError(error);
    return {
        name: tree.properties?.name?.errors,
        email: tree.properties?.email?.errors,
        phone: tree.properties?.phone?.errors,
        address: tree.properties?.address?.errors,
    };
}