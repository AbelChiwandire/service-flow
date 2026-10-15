"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

import {
    signupAction,
    type State,
} from "@/lib/db/users/actions";

const initialState: State = {};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full btn-primary"
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
        <form action={formAction} className="space-y-6">
            {state.message && (
                <div
                    role="alert"
                    className="alert-error"
                >
                    {state.message}
                </div>
            )}

            <div>
                <label
                    htmlFor="name"
                    className="mb-1 field-label"
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
                    className="input-field"
                    placeholder="Your full name"
                />
                {state.errors?.name && (
                    <p id="name-error" className="mt-1 error-text">
                        {state.errors.name[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="businessName"
                    className="mb-1 field-label"
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
                    className="input-field"
                    placeholder="Your business name"
                />
                {state.errors?.businessName && (
                    <p
                        id="businessName-error"
                        className="mt-1 error-text"
                    >
                        {state.errors.businessName[0]}
                    </p>
                )}
            </div>

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
                    aria-invalid={Boolean(state.errors?.email)}
                    aria-describedby={
                        state.errors?.email ? "email-error" : undefined
                    }
                    className="input-field"
                    placeholder="you@example.com"
                />
                {state.errors?.email && (
                    <p id="email-error" className="mt-1 error-text">
                        {state.errors.email[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="mb-1 field-label"
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
                    className="input-field"
                    placeholder="Create a password (at least 8 characters)"
                />
                {state.errors?.password && (
                    <p
                        id="password-error"
                        className="mt-1 error-text"
                    >
                        {state.errors.password[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="confirmPassword"
                    className="mb-1 field-label"
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
                    className="input-field"
                    placeholder="Confirm your password"
                />
                {state.errors?.confirmPassword && (
                    <p
                        id="confirmPassword-error"
                        className="mt-1 error-text"
                    >
                        {state.errors.confirmPassword[0]}
                    </p>
                )}
            </div>

            <SubmitButton />

            <p className="text-center small-text">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="link-primary"
                >
                    Sign in
                </Link>
            </p>
        </form>
    );
}
