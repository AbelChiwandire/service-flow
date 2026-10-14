"use client";

import type { State } from "@/lib/db/users/actions";

type SignupFormProps = {
    formAction: (formData: FormData) => void;
    state: State;
    isPending: boolean;
};

export function SignupForm({ formAction, state, isPending }: SignupFormProps) {
    const name = state.values?.name ?? "";
    const businessName = state.values?.businessName ?? "";
    const email = state.values?.email ?? "";

    return (
        <form action={formAction} className="max-w-xl space-y-4">
            <div>
                <label htmlFor="name" className="mb-1 field-label">
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={name}
                    required
                    aria-describedby="name-error"
                    className="input-field"
                />
                <div id="name-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.name?.map((error) => (
                        <p key={error} className="mt-1 error-text">
                            {error}
                        </p>
                    ))}
                </div>
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
                    defaultValue={businessName}
                    required
                    aria-describedby="businessName-error"
                    className="input-field"
                />
                <div id="businessName-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.businessName?.map((error) => (
                        <p key={error} className="mt-1 error-text">
                            {error}
                        </p>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="email" className="mb-1 field-label">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={email}
                    required
                    aria-describedby="email-error"
                    className="input-field"
                />
                <div id="email-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.email?.map((error) => (
                        <p key={error} className="mt-1 error-text">
                            {error}
                        </p>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="password" className="mb-1 field-label">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    aria-describedby="password-error"
                    className="input-field"
                />
                <div id="password-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.password?.map((error) => (
                        <p key={error} className="mt-1 error-text">
                            {error}
                        </p>
                    ))}
                </div>
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
                    required
                    minLength={8}
                    autoComplete="new-password"
                    aria-describedby="confirmPassword-error"
                    className="input-field"
                />
                <div id="confirmPassword-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.confirmPassword?.map((error) => (
                        <p key={error} className="mt-1 error-text">
                            {error}
                        </p>
                    ))}
                </div>
            </div>

            {state.message ? <p className="error-text">{state.message}</p> : null}

            <button
                type="submit"
                disabled={isPending}
                className="btn-primary"
            >
                {isPending ? "Signing up..." : "Sign Up"}
            </button>
        </form>
    );
}
