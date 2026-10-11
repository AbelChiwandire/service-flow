"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
    createUser,
    EmailAlreadyExistsError,
} from "@/lib/db/users/repository";

const SignupSchema = z
    .object({
        name: z.string().trim().min(2, "Please enter your full name."),
        businessName: z
            .string()
            .trim()
            .min(2, "Please enter your business name."),
        email: z
            .string()
            .trim()
            .email("Please enter a valid email address.")
            .transform((email) => email.toLowerCase()),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters."),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export interface SignupState {
    errors?: {
        name?: string[];
        businessName?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
    message?: string;
}

export async function signupAction(
    _previousState: SignupState,
    formData: FormData,
): Promise<SignupState> {
    const validatedFields = SignupSchema.safeParse({
        name: formData.get("name"),
        businessName: formData.get("businessName"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please correct the highlighted fields.",
        };
    }

    const { name, businessName, email, password } = validatedFields.data;

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        await createUser({
            name,
            businessName,
            email,
            passwordHash,
        });
    } catch (error) {
        if (error instanceof EmailAlreadyExistsError) {
            return {
                errors: {
                    email: ["An account with this email already exists."],
                },
                message: "Please use a different email address.",
            };
        }

        console.error("Signup failed:", error);

        return {
            message:
                "We couldn't create your account. Please try again later.",
        };
    }

    redirect("/login?registered=true");
}