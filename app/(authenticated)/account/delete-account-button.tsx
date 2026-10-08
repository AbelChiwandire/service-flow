'use client';

import { useActionState } from 'react';
import type { SubmitEvent } from 'react';
import { deleteUserAction, type State } from '@/lib/db/users/actions';

const initialState: State = { message: null, errors: {} };

export default function DeleteAccountButton({}: object) {
    const boundDeleteUserAction = deleteUserAction;
    const [state, formAction, isPending] = useActionState(boundDeleteUserAction, initialState);

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        const confirmed = window.confirm(
            'Delete your account? This also deletes every customer and job you own. This cannot be undone.'
        );
        if (!confirmed) {
            event.preventDefault();
        }
    }

    return (
        <form action={formAction} onSubmit={handleSubmit} className="inline">
            <button
                type="submit"
                disabled={isPending}
                className="text-sm text-red-600 hover:underline disabled:opacity-50"
            >
                {isPending ? 'Deleting account...' : 'Delete account'}
            </button>
            {state.message ? (
                <p className="text-sm text-red-600">{state.message}</p>
            ) : null}
        </form>
    );
}