'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PLACEHOLDER_USER_ID } from '@/lib/auth/placeholder-session';
import { createJobRecord, deleteJobRecord, updateJobRecord } from './queries';
import {
    JobFormSchema,
    IdSchema,
    formatValidationErrors,
    type JobFormErrors,
} from './schema';

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

// The user is always resolved on the server, never taken from the client.
// TODO(auth #18): replace with the signed-in user from the session.
async function getCurrentUserId(): Promise<string> {
    return PLACEHOLDER_USER_ID;
}

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

    const result = await createJobRecord(await getCurrentUserId(), {
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

    const result = await updateJobRecord(await getCurrentUserId(), id, validatedData.data);

    if (!result.ok) {
        return { message: result.message, values: getRawJobValues(formData) };
    }

    revalidatePath(JOBS_PATH);
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

    const result = await deleteJobRecord(await getCurrentUserId(), id);

    if (!result.ok) {
        return { message: result.message };
    }

    revalidatePath(JOBS_PATH);
    redirect(JOBS_PATH);
}