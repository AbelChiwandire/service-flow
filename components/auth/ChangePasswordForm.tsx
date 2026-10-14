"use client";

import type { PasswordChangeState } from "@/lib/db/users/actions";

type ChangePasswordFormProps = {
    formAction: (formData: FormData) => void;
    state: PasswordChangeState;
    isPending: boolean;
};

export function ChangePasswordForm({ formAction, state, isPending }: ChangePasswordFormProps) {
    return (
        <form action={formAction} className="max-w-xl space-y-4">
            <div>
                <label
                    htmlFor="currentPassword"
                    className="mb-1 field-label"
                >
                    Current password
                </label>
                <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                    autoComplete="current-password"
                    aria-describedby="currentPassword-error"
                    className="input-field"
                />
                <div id="currentPassword-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.currentPassword?.map((error) => (
                        <p key={error} className="mt-1 error-text">
                            {error}
                        </p>
                    ))}
                </div>
            </div>

            <div>
                <label
                    htmlFor="newPassword"
                    className="mb-1 field-label"
                >
                    New password
                </label>
                <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    aria-describedby="newPassword-error"
                    className="input-field"
                />
                <div id="newPassword-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.newPassword?.map((error) => (
                        <p key={error} className="mt-1 error-text">
                            {error}
                        </p>
                    ))}
                </div>
            </div>

            <div>
                <label
                    htmlFor="confirmNewPassword"
                    className="mb-1 field-label"
                >
                    Confirm new password
                </label>
                <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    aria-describedby="confirmNewPassword-error"
                    className="input-field"
                />
                <div id="confirmNewPassword-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.confirmNewPassword?.map((error) => (
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
                {isPending ? "Changing password..." : "Change password"}
            </button>
        </form>
    );
}
