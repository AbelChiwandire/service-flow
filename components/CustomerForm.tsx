'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { State } from '@/lib/db/customer/actions';

type FieldName = 'name' | 'email' | 'phone' | 'address';

type CustomerValues = {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
};

type CustomerFormProps = {
    formAction: (formData: FormData) => void;
    state: State;
    isPending: boolean;
    initialValues?: CustomerValues;
    cancelHref: string;
    cancelLabel: string;
    isEditing?: boolean;
};

const inputClassName =
    'mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2667FF] focus:ring-2 focus:ring-[#2667FF]/20';
const labelClassName = 'block text-sm font-semibold text-slate-800';
const buttonClassName =
    'inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2667FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
const cancelClassName =
    'inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2';

export function CustomerForm({
    formAction,
    state,
    isPending,
    initialValues,
    cancelHref,
    cancelLabel,
    isEditing = false,
}: CustomerFormProps) {
    const [clearedErrors, setClearedErrors] = useState<Set<FieldName>>(
        () => new Set()
    );
    const [isMessageDismissed, setIsMessageDismissed] = useState(false);
    const values = {
        name: state.values?.name ?? initialValues?.name ?? '',
        email: state.values?.email ?? initialValues?.email ?? '',
        phone: state.values?.phone ?? initialValues?.phone ?? '',
        address: state.values?.address ?? initialValues?.address ?? '',
    };
    const getFieldErrors = (field: FieldName) =>
        clearedErrors.has(field) ? undefined : state.errors?.[field];
    const clearFieldError = (field: FieldName) => {
        setClearedErrors((current) => new Set(current).add(field));
        setIsMessageDismissed(true);
    };

    useEffect(() => {
        const firstInvalidField = (
            ['name', 'email', 'phone', 'address'] as const
        ).find((field) => state.errors?.[field]?.length);
        if (firstInvalidField) {
            document.getElementById(firstInvalidField)?.focus();
        }
    }, [state]);

    return (
        <form
            action={formAction}
            aria-busy={isPending}
            onSubmit={() => {
                setClearedErrors(new Set());
                setIsMessageDismissed(false);
            }}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="name" className={labelClassName}>
                        Name <span aria-hidden="true" className="text-rose-700">*</span>
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        defaultValue={values.name}
                        onChange={() => clearFieldError('name')}
                        aria-invalid={Boolean(getFieldErrors('name')?.length)}
                        aria-describedby="name-error"
                        className={`${inputClassName} ${
                            getFieldErrors('name')?.length
                                ? 'border-rose-700 focus:border-rose-700 focus:ring-rose-700/20'
                                : ''
                        }`}
                    />
                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        {getFieldErrors('name')?.map((error) => (
                            <p key={error} className="mt-1.5 text-sm text-rose-800">
                                {error}
                            </p>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className={labelClassName}>
                        Email <span aria-hidden="true" className="text-rose-700">*</span>
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        defaultValue={values.email}
                        onChange={() => clearFieldError('email')}
                        aria-invalid={Boolean(getFieldErrors('email')?.length)}
                        aria-describedby="email-error"
                        className={`${inputClassName} ${
                            getFieldErrors('email')?.length
                                ? 'border-rose-700 focus:border-rose-700 focus:ring-rose-700/20'
                                : ''
                        }`}
                    />
                    <div id="email-error" aria-live="polite" aria-atomic="true">
                        {getFieldErrors('email')?.map((error) => (
                            <p key={error} className="mt-1.5 text-sm text-rose-800">
                                {error}
                            </p>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="phone" className={labelClassName}>
                        Phone <span aria-hidden="true" className="text-rose-700">*</span>
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        defaultValue={values.phone}
                        onChange={() => clearFieldError('phone')}
                        aria-invalid={Boolean(getFieldErrors('phone')?.length)}
                        aria-describedby="phone-error"
                        className={`${inputClassName} ${
                            getFieldErrors('phone')?.length
                                ? 'border-rose-700 focus:border-rose-700 focus:ring-rose-700/20'
                                : ''
                        }`}
                    />
                    <div id="phone-error" aria-live="polite" aria-atomic="true">
                        {getFieldErrors('phone')?.map((error) => (
                            <p key={error} className="mt-1.5 text-sm text-rose-800">
                                {error}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="address" className={labelClassName}>
                        Address <span aria-hidden="true" className="text-rose-700">*</span>
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        autoComplete="street-address"
                        required
                        rows={3}
                        defaultValue={values.address}
                        onChange={() => clearFieldError('address')}
                        aria-invalid={Boolean(getFieldErrors('address')?.length)}
                        aria-describedby="address-error"
                        className={`${inputClassName} min-h-28 resize-y ${
                            getFieldErrors('address')?.length
                                ? 'border-rose-700 focus:border-rose-700 focus:ring-rose-700/20'
                                : ''
                        }`}
                    />
                    <div id="address-error" aria-live="polite" aria-atomic="true">
                        {getFieldErrors('address')?.map((error) => (
                            <p key={error} className="mt-1.5 text-sm text-rose-800">
                                {error}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {state.message && !isMessageDismissed ? (
                <div
                    role="alert"
                    className="mt-6 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-950"
                >
                    <p className="font-semibold">
                        {isEditing ? 'Changes could not be saved.' : 'Customer could not be created.'}
                    </p>
                    <p className="mt-1">{state.message}</p>
                </div>
            ) : null}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <Link href={cancelHref} className={cancelClassName}>
                    {cancelLabel}
                </Link>
                <button type="submit" disabled={isPending} className={buttonClassName}>
                    {isPending
                        ? isEditing
                            ? 'Saving changes…'
                            : 'Saving customer…'
                        : isEditing
                          ? 'Save changes'
                          : 'Save customer'}
                </button>
            </div>
        </form>
    );
}
