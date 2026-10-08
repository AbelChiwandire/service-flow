'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireUserId } from '@/lib/auth/session';
import {
    createJob,
    updateJob,
    deleteJob,
    JobCustomerNotFoundError,
    ActiveJobDeleteError,
} from './repository';
import {
    JobFormSchema,
    IdSchema,
    formatValidationErrors,
    type JobFormErrors,
} from './schema';

const JOBS_PATH = '/jobs';

export type State = {
    errors?: JobFormErrors;
    message?: string | null;
    values?: {
        title?: string;
        description?: string;
        scheduledDate?: string;
        status?: string;
    };
};

function validateJobForm(formData: FormData) {
    return JobFormSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        scheduledDate: formData.get('scheduledDate'),
        status: formData.get('status') ?? undefined,
    });
}

function getRawJobValues(formData: FormData): State['values'] {
    return {
        title: formData.get('title')?.toString(),
        description: formData.get('description')?.toString(),
        scheduledDate: formData.get('scheduledDate')?.toString(),
        status: formData.get('status')?.toString(),
    };
}

async function runMutation(
    mutation: () => Promise<unknown>,
    logLabel: string
): Promise<State | undefined> {
    try {
        const result = await mutation();
        if (result === null) {
            return { message: 'Job not found.' };
        }
    } catch (error) {
        if (error instanceof JobCustomerNotFoundError || error instanceof ActiveJobDeleteError) {
            return { message: error.message };
        }
        console.error(logLabel, error);
        throw error;
    }

    revalidatePath(JOBS_PATH);
    redirect(JOBS_PATH);
}

export async function createJobAction(
    customerId: string,
    prevState: State,
    formData: FormData
): Promise<State> {
    const userId = await requireUserId();
    if (!IdSchema.safeParse(customerId).success) {
        return { message: 'Invalid customer id.' };
    }

    const validatedData = validateJobForm(formData);
    if (!validatedData.success) {
        return {
            errors: formatValidationErrors(validatedData.error),
            message: 'Missing or invalid fields. Failed to create Job.',
            values: getRawJobValues(formData),
        };
    }

    const result = await runMutation(
        () => createJob({ userId, customerId, ...validatedData.data }),
        'createJobAction failed:'
    );
    return result ?? {};
}

export async function updateJobAction(
    id: string,
    prevState: State,
    formData: FormData
): Promise<State> {
    const userId = await requireUserId();
    if (!IdSchema.safeParse(id).success) {
        return { message: 'Invalid job id.' };
    }

    const validatedData = validateJobForm(formData);
    if (!validatedData.success) {
        return {
            errors: formatValidationErrors(validatedData.error),
            message: 'Missing or invalid fields. Failed to update Job.',
            values: getRawJobValues(formData),
        };
    }

    const result = await runMutation(
        () => updateJob(userId, id, validatedData.data),
        'updateJobAction failed:'
    );
    return result ?? {};
}

export async function deleteJobAction(
    id: string,
    _prevState: State,
    _formData: FormData
): Promise<State> {
    const userId = await requireUserId();
    if (!IdSchema.safeParse(id).success) {
        return { message: 'Invalid job id.' };
    }

    const result = await runMutation(
        () => deleteJob(userId, id),
        'deleteJobAction failed:'
    );
    return result ?? {};
}