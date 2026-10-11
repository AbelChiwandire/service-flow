"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { z } from "zod";

const LoginSchema = z.object({
    email: z.string().trim().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function authenticate(
    _previousState: string | undefined,
    formData: FormData,
): Promise<string | undefined> {
    const validatedFields = LoginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return "Please enter a valid email address and a password of at least 8 characters.";
    }

    try {
        await signIn("credentials", {
            ...validatedFields.data,
            redirectTo: "/dashboard",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid email or password.";
                default:
                    return "Something went wrong. Please try again.";
            }
        }

        throw error;
    }

    return undefined;
}