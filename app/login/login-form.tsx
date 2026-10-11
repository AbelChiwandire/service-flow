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
            className="w-full rounded-md bg-[#2667FF] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] focus:outline-none focus:ring-2 focus:ring-[#2667FF] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
        <form action={formAction} className="space-y-5">
            {errorMessage && (
                <div
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                    {errorMessage}
                </div>
            )}

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
                    className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2667FF] focus:ring-2 focus:ring-blue-100"
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Password
                    </label>

                    <Link
                        href="#"
                        className="text-sm font-medium text-[#2667FF] hover:text-[#3F8EFC]"
                    >
                        Forgot password?
                    </Link>
                </div>

                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    minLength={8}
                    required
                    className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2667FF] focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter your password"
                />
            </div>

            <SubmitButton />

            <p className="text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link
                    href="/signup"
                    className="font-semibold text-[#2667FF] hover:text-[#3F8EFC]"
                >
                    Create an account
                </Link>
            </p>
        </form>
    );
}