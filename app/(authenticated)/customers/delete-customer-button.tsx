'use client';

import { useActionState } from 'react';
import { deleteCustomerAction, type State } from '@/lib/db/customer/actions';

const initialState: State = { message: null, errors: {} };

export default function DeleteCustomerButton({
    userId,
    customerId,
}: {
    userId: string;
    customerId: string;
}) {
    const boundDeleteCustomerAction = deleteCustomerAction.bind(null, userId, customerId);
    const [state, formAction, isPending] = useActionState(
        boundDeleteCustomerAction,
        initialState
    );

    return (
        <form
            action={formAction}
            className="inline"
            onSubmit={(event) => {
                if (!window.confirm('Delete this customer? This action cannot be undone.')) {
                    event.preventDefault();
                }
            }}
        >
            <button
                type="submit"
                disabled={isPending}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-rose-300 bg-white px-5 py-2.5 text-sm font-semibold text-rose-800 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending ? 'Deleting…' : 'Delete Customer'}
            </button>
            {state.message ? (
                <p role="alert" className="mt-2 text-sm text-rose-800">
                    {state.message}
                </p>
            ) : null}
        </form>
    );
}