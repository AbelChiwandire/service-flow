// PLACEHOLDER: Login form component for user authentication
// The login form will be implemented in the auth UI branch
// This is for testing purposes only

"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/auth/actions";
import { useSearchParams } from "next/navigation";
export function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="redirectTo" value={callbackUrl} />
            <div className="space-y-2">
                <label htmlFor="email" className="field-label">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    className="input-field"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="password" className="field-label">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    minLength={8}
                    required
                    className="input-field"
                />
            </div>
            <button
                aria-disabled={isPending}
                type="submit"
                className="w-full btn-primary"
            >
                {isPending ? "Signing in..." : "Sign In"}
            </button>
            {errorMessage && (
                <p
                    role="alert"
                    className="alert-error"
                >
                    {errorMessage}
                </p>
            )}
        </form>
    );
}
