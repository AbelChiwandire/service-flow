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
        <form action={formAction} className="inline">
            <button
                type="submit"
                disabled={isPending}
                className="text-sm text-red-600 hover:underline disabled:opacity-50"
            >
                {isPending ? 'Deleting...' : 'Delete'}
            </button>
            {state.message ? (
                <p className="text-sm text-red-600">{state.message}</p>
            ) : null}
        </form>
    );
}