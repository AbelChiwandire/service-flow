'use client';

import type { State } from '@/lib/db/customer/actions';

type CustomerFormProps = {
    formAction: (formData: FormData) => void;
    state: State;
    isPending: boolean;
    initialValues?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
    };
};

export function CustomerForm({
    formAction,
    state,
    isPending,
    initialValues,
}: CustomerFormProps) {
    const name = state.values?.name ?? initialValues?.name;
    const email = state.values?.email ?? initialValues?.email;
    const phone = state.values?.phone ?? initialValues?.phone;
    const address = state.values?.address ?? initialValues?.address;

    return (
        <form action={formAction} className="max-w-xl space-y-4">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 mb-1"
                >
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
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-1"
                >
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
                <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-700 mb-1"
                >
                    Phone
                </label>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={phone}
                    required
                    aria-describedby="phone-error"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
                <div id="phone-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.phone?.map((error) => (
                        <p key={error} className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
                    ))}
                </div>
            </div>

            <div>
                <label
                    htmlFor="address"
                    className="block text-sm font-medium text-slate-700 mb-1"
                >
                    Address
                </label>
                <textarea
                    id="address"
                    name="address"
                    defaultValue={address}
                    required
                    rows={3}
                    aria-describedby="address-error"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
                <div id="address-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.address?.map((error) => (
                        <p key={error} className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
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
                {isPending ? 'Saving...' : 'Save Customer'}
            </button>
        </form>
    );
}