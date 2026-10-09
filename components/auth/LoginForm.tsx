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
        <form action={formAction} className="space-y-5">
            <input type="hidden" name="redirectTo" value={callbackUrl} />
            <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
                />
            </div>
            <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    minLength={8}
                    required
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
                />
            </div>
            <button
                aria-disabled={isPending}
                type="submit"
                className="w-full rounded-md bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-70"
            >
                {isPending ? "Signing in..." : "Sign In"}
            </button>
            {errorMessage && (
                <p
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                    {errorMessage}
                </p>
            )}
        </form>
    );
}
