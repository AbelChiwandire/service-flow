'use client';

import { useActionState } from 'react';
import { deleteJobAction, type State } from '@/lib/db/jobs/actions';

const initialState: State = { message: null, errors: {} };

export default function DeleteJobButton({
    jobId,
}: {
    jobId: string;
}) {
    const boundDeleteJobAction = deleteJobAction.bind(null, jobId);
    const [state, formAction, isPending] = useActionState(boundDeleteJobAction, initialState);

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