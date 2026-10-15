"use client";

import type { State } from "@/lib/db/users/actions";

type UserProfileFormProps = {
    formAction: (formData: FormData) => void;
    state: State;
    isPending: boolean;
    initialValues?: {
        name?: string;
        businessName?: string;
        email?: string;
    };
};

export function UserProfileForm({
    formAction,
    state,
    isPending,
    initialValues,
}: UserProfileFormProps) {
    const name = state.values?.name ?? initialValues?.name ?? "";
    const businessName = state.values?.businessName ?? initialValues?.businessName ?? "";
    const email = state.values?.email ?? initialValues?.email ?? "";

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
                    placeholder="Your full name"
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
                <label htmlFor="businessName" className="mb-1 field-label">
                    Business name
                </label>
                <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    defaultValue={businessName}
                    placeholder="Your business name"
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
                    placeholder="you@example.com"
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

            {state.message ? <p className="error-text">{state.message}</p> : null}

            <button type="submit" disabled={isPending} className="btn-primary">
                {isPending ? "Saving..." : "Save Profile"}
            </button>
        </form>
    );
}
