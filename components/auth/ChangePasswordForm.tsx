'use client';

import type { PasswordChangeState } from '@/lib/db/users/actions';

type ChangePasswordFormProps = {
    formAction: (formData: FormData) => void;
    state: PasswordChangeState;
    isPending: boolean;
};

export function ChangePasswordForm({ formAction, state, isPending }: ChangePasswordFormProps) {
    return (
        <form action={formAction} className="max-w-xl space-y-4">
            <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1">
                    Current password
                </label>
                <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                    autoComplete="current-password"
                    aria-describedby="currentPassword-error"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
                <div id="currentPassword-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.currentPassword?.map((error) => (
                        <p key={error} className="mt-1 text-sm text-red-600">{error}</p>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
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
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
                <div id="newPassword-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.newPassword?.map((error) => (
                        <p key={error} className="mt-1 text-sm text-red-600">{error}</p>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-slate-700 mb-1">
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
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
                <div id="confirmNewPassword-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.confirmNewPassword?.map((error) => (
                        <p key={error} className="mt-1 text-sm text-red-600">{error}</p>
                    ))}
                </div>
            </div>

            {state.message ? (
                <p className="text-sm text-red-600">{state.message}</p>
            ) : null}

            <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isPending ? 'Changing password...' : 'Change password'}
            </button>
        </form>
    );
}