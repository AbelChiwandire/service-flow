'use client';

import { useActionState } from 'react';
import { createJobAction, type State } from '@/lib/db/jobs/actions';
import { JobForm } from '@/components/jobs/JobForm';

const initialState: State = { message: null, errors: {} };

type CreateJobFormProps = {
    userId: string;
    customerId: string;
};

export default function CreateJobForm({ userId, customerId }: CreateJobFormProps) {
    const boundCreateJobAction = createJobAction.bind(null, userId, customerId);
    const [state, formAction, isPending] = useActionState(boundCreateJobAction, initialState);

    return <JobForm formAction={formAction} state={state} isPending={isPending} />;
}