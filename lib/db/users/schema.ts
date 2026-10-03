import { z } from 'zod';

export const IdSchema = z.uuid();

export const SignupFormSchema = z
    .object({
        name: z.string().trim().min(2).max(255),
        businessName: z.string().trim().min(2).max(255),
        email: z.email().toLowerCase(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    });

export const UserProfileFormSchema = z.object({
    name: z.string().trim().min(2).max(255),
    businessName: z.string().trim().min(2).max(255),
    email: z.email().toLowerCase(),
});

export type UserFormErrors = {
    name?: string[];
    businessName?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
};

export function formatValidationErrors(
    error: z.ZodError<Partial<z.infer<typeof SignupFormSchema>>>
): UserFormErrors {
    const tree = z.treeifyError(error);
    return {
        name: tree.properties?.name?.errors,
        businessName: tree.properties?.businessName?.errors,
        email: tree.properties?.email?.errors,
        password: tree.properties?.password?.errors,
        confirmPassword: tree.properties?.confirmPassword?.errors,
    };
}