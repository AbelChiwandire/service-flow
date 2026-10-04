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

export const PasswordChangeFormSchema = z
    .object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8),
        confirmNewPassword: z.string().min(8),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'Passwords do not match.',
        path: ['confirmNewPassword'],
    });

export const UserProfileFormSchema = z.object({
    name: z.string().trim().min(2).max(255),
    businessName: z.string().trim().min(2).max(255),
    email: z.email().toLowerCase(),
});

export type PasswordChangeErrors = {
    currentPassword?: string[];
    newPassword?: string[];
    confirmNewPassword?: string[];
};

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

export function formatPasswordChangeErrors(
    error: z.ZodError<z.infer<typeof PasswordChangeFormSchema>>
): PasswordChangeErrors {
    const tree = z.treeifyError(error);
    return {
        currentPassword: tree.properties?.currentPassword?.errors,
        newPassword: tree.properties?.newPassword?.errors,
        confirmNewPassword: tree.properties?.confirmNewPassword?.errors,
    };
}