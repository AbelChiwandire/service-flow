'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PLACEHOLDER_USER_ID } from '@/lib/auth/placeholder-session';
import {
    createJobRecord,
    deleteJobRecord,
    getJob,
    updateJobRecord,
} from './queries';
import {
    JobFormSchema,
    JobStatusSchema,
    IdSchema,
    formatValidationErrors,
    type JobFormErrors,
} from './schema';
import { JOB_STATUS_LABELS, canTransition } from './status';
import type { JobStatus } from './repository';

const JOBS_PATH = '/jobs';

export type State = {
    errors?: JobFormErrors & { customerId?: string[] };
    message?: string | null;
    values?: {
        customerId?: string;
        title?: string;
        description?: string;
        scheduledDate?: string;
    };
};

export type StatusState = {
    message?: string | null;
};

function validateJobForm(formData: FormData) {
    return JobFormSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        scheduledDate: formData.get('scheduledDate'),
        // Status is changed from the job details page, not from these forms.
        status: formData.get('status') ?? undefined,
    });
}

function getRawJobValues(formData: FormData): State['values'] {
    return {
        customerId: formData.get('customerId')?.toString(),
        title: formData.get('title')?.toString(),
        description: formData.get('description')?.toString(),
        scheduledDate: formData.get('scheduledDate')?.toString(),
    };
}

export async function createJobAction(
    _prevState: State,
    formData: FormData
): Promise<State> {
    const customerId = formData.get('customerId')?.toString() ?? '';
    const isCustomerValid = IdSchema.safeParse(customerId).success;
    const validatedData = validateJobForm(formData);

    if (!validatedData.success || !isCustomerValid) {
        return {
            errors: {
                ...(validatedData.success ? {} : formatValidationErrors(validatedData.error)),
                ...(isCustomerValid ? {} : { customerId: ['Select a customer.'] }),
            },
            message: 'Missing or invalid fields. Failed to create job.',
            values: getRawJobValues(formData),
        };
    }

    const result = await createJobRecord(PLACEHOLDER_USER_ID, {
        customerId,
        ...validatedData.data,
    });

    if (!result.ok) {
        return { message: result.message, values: getRawJobValues(formData) };
    }

    revalidatePath(JOBS_PATH);
    redirect(JOBS_PATH);
}

export async function updateJobAction(
    id: string,
    _prevState: State,
    formData: FormData
): Promise<State> {
    if (!IdSchema.safeParse(id).success) {
        return { message: 'Invalid job id.' };
    }

    const validatedData = validateJobForm(formData);
    if (!validatedData.success) {
        return {
            errors: formatValidationErrors(validatedData.error),
            message: 'Missing or invalid fields. Failed to update job.',
            values: getRawJobValues(formData),
        };
    }

    const result = await updateJobRecord(PLACEHOLDER_USER_ID, id, validatedData.data);

    if (!result.ok) {
        return { message: result.message, values: getRawJobValues(formData) };
    }

    revalidatePath(JOBS_PATH);
    revalidatePath(`${JOBS_PATH}/${id}`);
    redirect(JOBS_PATH);
}

export async function deleteJobAction(
    id: string,
    _prevState: State,
    _formData: FormData
): Promise<State> {
    if (!IdSchema.safeParse(id).success) {
        return { message: 'Invalid job id.' };
    }

    const result = await deleteJobRecord(PLACEHOLDER_USER_ID, id);

    if (!result.ok) {
        return { message: result.message };
    }

    revalidatePath(JOBS_PATH);
    redirect(JOBS_PATH);
}

// Moves a job to a new status after checking the transition on the server.
export async function changeJobStatusAction(
    id: string,
    target: JobStatus,
    _prevState: StatusState,
    _formData: FormData
): Promise<StatusState> {
    const parsedTarget = JobStatusSchema.safeParse(target);

    if (!IdSchema.safeParse(id).success || !parsedTarget.success) {
        return { message: 'Invalid request.' };
    }

    const job = await getJob(PLACEHOLDER_USER_ID, id);
    if (!job) {
        return { message: 'Job not found.' };
    }

    if (!canTransition(job.status, parsedTarget.data)) {
        return {
            message: `A ${JOB_STATUS_LABELS[job.status].toLowerCase()} job can't be changed to ${JOB_STATUS_LABELS[parsedTarget.data].toLowerCase()}.`,
        };
    }

    const result = await updateJobRecord(PLACEHOLDER_USER_ID, id, {
        status: parsedTarget.data,
    });
    if (!result.ok) {
        return { message: result.message };
    }

    revalidatePath(JOBS_PATH);
    revalidatePath(`${JOBS_PATH}/${id}`);
    return {};
}