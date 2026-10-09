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
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={name}
                    required
                    aria-describedby="name-error"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
                <div id="name-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.name?.map((error) => (
                        <p key={error} className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
                    ))}
                </div>
            </div>

            <div>
                <label
                    htmlFor="businessName"
                    className="block text-sm font-medium text-slate-700 mb-1"
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
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
                <div id="businessName-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.businessName?.map((error) => (
                        <p key={error} className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={email}
                    required
                    aria-describedby="email-error"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
                <div id="email-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.email?.map((error) => (
                        <p key={error} className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
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
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
                <div id="password-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.password?.map((error) => (
                        <p key={error} className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
                    ))}
                </div>
            </div>

            <div>
                <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-slate-700 mb-1"
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
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
                <div id="confirmPassword-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.confirmPassword?.map((error) => (
                        <p key={error} className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
                    ))}
                </div>
            </div>

            {state.message ? <p className="text-sm text-red-600">{state.message}</p> : null}

            <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isPending ? "Signing up..." : "Sign Up"}
            </button>
        </form>
    );
}
