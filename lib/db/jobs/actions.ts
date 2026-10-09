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
import {
    CompleteJobSchema,
    formatCompletionErrors,
    type CompletionErrors,
} from './completion-schema';
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
    errors?: CompletionErrors;
    values?: { amount?: string; dueDate?: string };
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

    const result = await deleteJobRecord(await getCurrentUserId(), id);

    if (!result.ok) {
        return { message: result.message };
    }

    revalidatePath(JOBS_PATH);
    redirect(JOBS_PATH);
}

// Moves a job to a new status after checking the transition on the server.
// Returns an error message, or null when the change was saved.
async function applyStatusChange(id: string, target: JobStatus): Promise<string | null> {
    const userId = await getCurrentUserId();

    const job = await getJob(userId, id);
    if (!job) return 'Job not found.';

    if (!canTransition(job.status, target)) {
        return `A ${JOB_STATUS_LABELS[job.status].toLowerCase()} job can't be changed to ${JOB_STATUS_LABELS[target].toLowerCase()}.`;
    }

    const result = await updateJobRecord(userId, id, { status: target });
    if (!result.ok) return result.message;

    revalidatePath(JOBS_PATH);
    revalidatePath(`${JOBS_PATH}/${id}`);
    return null;
}

// Handles "Start job" and "Cancel job". Completing goes through completeJobAction.
export async function changeJobStatusAction(
    id: string,
    target: JobStatus,
    _prevState: StatusState,
    _formData: FormData
): Promise<StatusState> {
    const parsedTarget = JobStatusSchema.safeParse(target);

    if (
        !IdSchema.safeParse(id).success ||
        !parsedTarget.success ||
        parsedTarget.data === 'completed'
    ) {
        return { message: 'Invalid request.' };
    }

    const error = await applyStatusChange(id, parsedTarget.data);
    return error ? { message: error } : {};
}

// Completing a job collects the invoice details first. If anything fails,
// the job keeps its previous status.
export async function completeJobAction(
    id: string,
    _prevState: StatusState,
    formData: FormData
): Promise<StatusState> {
    if (!IdSchema.safeParse(id).success) {
        return { message: 'Invalid job id.' };
    }

    const parsed = CompleteJobSchema.safeParse({
        amount: formData.get('amount'),
        dueDate: formData.get('dueDate'),
    });

    if (!parsed.success) {
        return {
            errors: formatCompletionErrors(parsed.error),
            values: {
                amount: formData.get('amount')?.toString(),
                dueDate: formData.get('dueDate')?.toString(),
            },
        };
    }

    // TODO(invoices): create the invoice for this job here, before changing the
    // status, once the invoice backend exists. The amount and due date are validated
    // above but are not saved anywhere yet.
    const error = await applyStatusChange(id, 'completed');
    return error
        ? {
              message: error,
              values: {
                  amount: formData.get('amount')?.toString(),
                  dueDate: formData.get('dueDate')?.toString(),
              },
          }
        : {};
}