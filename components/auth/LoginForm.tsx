"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

import { authenticate } from "@/lib/auth/actions";

const initialState: string | undefined = undefined;

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full btn-primary"
        >
            {pending ? "Signing in..." : "Sign in"}
        </button>
    );
}

export default function LoginForm() {
    const [errorMessage, formAction] = useActionState(
        authenticate,
        initialState,
    );

    return (
        <form action={formAction} className="space-y-6">
            {errorMessage && (
                <div
                    role="alert"
                    className="alert-error"
                >
                    {errorMessage}
                </div>
            )}

            <div>
                <label
                    htmlFor="email"
                    className="mb-1 field-label"
                >
                    Email address
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input-field"
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label
                        htmlFor="password"
                        className="field-label"
                    >
                        Password
                    </label>
                </div>

                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    minLength={8}
                    required
                    className="input-field"
                    placeholder="Enter your password"
                />
            </div>

            <SubmitButton />

            <p className="text-center small-text">
                Don&apos;t have an account?{" "}
                <Link
                    href="/signup"
                    className="link-primary"
                >
                    Create an account
                </Link>
            </p>
        </form>
    );
}