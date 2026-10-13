"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

import {
    signupAction,
    type SignupState,
} from "@/lib/db/users/actions";

const initialState: SignupState = {};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-[#2667FF] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] focus:outline-none focus:ring-2 focus:ring-[#2667FF] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {pending ? "Creating account..." : "Create account"}
        </button>
    );
}

export default function SignupForm() {
    const [state, formAction] = useActionState(
        signupAction,
        initialState,
    );

    return (
        <form action={formAction} className="space-y-5">
            {state.message && (
                <div
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                    {state.message}
                </div>
            )}

            <div>
                <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Full name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                    aria-invalid={Boolean(state.errors?.name)}
                    aria-describedby={
                        state.errors?.name ? "name-error" : undefined
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2667FF] focus:ring-2 focus:ring-blue-100"
                    placeholder="Your full name"
                />
                {state.errors?.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-600">
                        {state.errors.name[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="businessName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Business name
                </label>
                <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    autoComplete="organization"
                    required
                    minLength={2}
                    aria-invalid={Boolean(state.errors?.businessName)}
                    aria-describedby={
                        state.errors?.businessName
                            ? "businessName-error"
                            : undefined
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2667FF] focus:ring-2 focus:ring-blue-100"
                    placeholder="Your business name"
                />
                {state.errors?.businessName && (
                    <p
                        id="businessName-error"
                        className="mt-1 text-sm text-red-600"
                    >
                        {state.errors.businessName[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Email address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-invalid={Boolean(state.errors?.email)}
                    aria-describedby={
                        state.errors?.email ? "email-error" : undefined
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2667FF] focus:ring-2 focus:ring-blue-100"
                    placeholder="you@example.com"
                />
                {state.errors?.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600">
                        {state.errors.email[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    aria-invalid={Boolean(state.errors?.password)}
                    aria-describedby={
                        state.errors?.password ? "password-error" : undefined
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2667FF] focus:ring-2 focus:ring-blue-100"
                    placeholder="Create a password (at least 8 characters)"
                />
                {state.errors?.password && (
                    <p
                        id="password-error"
                        className="mt-1 text-sm text-red-600"
                    >
                        {state.errors.password[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Confirm password
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    aria-invalid={Boolean(state.errors?.confirmPassword)}
                    aria-describedby={
                        state.errors?.confirmPassword
                            ? "confirmPassword-error"
                            : undefined
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2667FF] focus:ring-2 focus:ring-blue-100"
                    placeholder="Confirm your password"
                />
                {state.errors?.confirmPassword && (
                    <p
                        id="confirmPassword-error"
                        className="mt-1 text-sm text-red-600"
                    >
                        {state.errors.confirmPassword[0]}
                    </p>
                )}
            </div>

            <SubmitButton />

            <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-semibold text-[#2667FF] hover:text-[#3F8EFC]"
                >
                    Sign in
                </Link>
            </p>
        </form>
    );
}
