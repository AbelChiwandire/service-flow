'use client';

import { useActionState } from 'react';
import { updateJobAction, type State } from '@/lib/db/jobs/actions';
import type { JobStatus } from '@/lib/db/jobs/repository';
import { JobForm } from '@/components/jobs/JobForm';

const initialState: State = { message: null, errors: {} };

type UpdateJobFormProps = {
    userId: string;
    jobId: string;
    initialValues: {
        title: string;
        description: string | null;
        scheduledDate: string;
        status: JobStatus;
    };
};

export default function UpdateJobForm({
    userId,
    jobId,
    initialValues,
}: UpdateJobFormProps) {
    const boundUpdateJobAction = updateJobAction.bind(null, userId, jobId);
    const [state, formAction, isPending] = useActionState(boundUpdateJobAction, initialState);

    return (
        <JobForm
            formAction={formAction}
            state={state}
            isPending={isPending}
            initialValues={initialValues}
        />
    );
}