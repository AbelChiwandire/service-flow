'use client';

import type { State } from '@/lib/db/jobs/actions';
import type { JobStatus } from '@/lib/db/jobs/repository';
import { JobStatusSchema } from '@/lib/db/jobs/schema';

const STATUS_LABELS: Record<JobStatus, string> = {
    scheduled: 'Scheduled',
    in_progress: 'In progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

type JobFormProps = {
    formAction: (formData: FormData) => void;
    state: State;
    isPending: boolean;
    initialValues?: {
        title?: string;
        description?: string | null;
        scheduledDate?: string | null;
        status?: JobStatus;
    };
};

export function JobForm({
    formAction,
    state,
    isPending,
    initialValues,
}: JobFormProps) {
    const title = state.values?.title ?? initialValues?.title ?? '';
    const description = state.values?.description ?? initialValues?.description ?? '';
    const scheduledDate = state.values?.scheduledDate ?? initialValues?.scheduledDate ?? '';
    const status = state.values?.status ?? initialValues?.status ?? 'scheduled';

    return (
        <form action={formAction} className="max-w-xl space-y-4">
            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-slate-700 mb-1"
                >
                    Title
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    defaultValue={title}
                    required
                    maxLength={255}
                    aria-describedby="title-error"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
                <div id="title-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.title?.map((error) => (
                        <p key={error} className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
                    ))}
                </div>
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-slate-700 mb-1"
                >
                    Description (optional)
                </label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={description}
                    rows={4}
                    aria-describedby="description-error"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
                <div id="description-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.description?.map((error) => (
                        <p key={error} className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
                    ))}
                </div>
            </div>

            <div>
                <label
                    htmlFor="scheduledDate"
                    className="block text-sm font-medium text-slate-700 mb-1"
                >
                    Scheduled date (optional)
                </label>
                <input
                    id="scheduledDate"
                    name="scheduledDate"
                    type="date"
                    defaultValue={scheduledDate}
                    aria-describedby="scheduledDate-error"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
                <div id="scheduledDate-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.scheduledDate?.map((error) => (
                        <p key={error} className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
                    ))}
                </div>
            </div>

            <div>
                <label
                    htmlFor="status"
                    className="block text-sm font-medium text-slate-700 mb-1"
                >
                    Status
                </label>
                <select
                    id="status"
                    name="status"
                    defaultValue={status}
                    required
                    aria-describedby="status-error"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                >
                    {JobStatusSchema.options.map((option) => (
                        <option key={option} value={option}>
                            {STATUS_LABELS[option]}
                        </option>
                    ))}
                </select>
                <div id="status-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.status?.map((error) => (
                        <p key={error} className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
                    ))}
                </div>
            </div>

            {state.message ? (
                <p className="text-sm text-red-600">{state.message}</p>
            ) : null}

            <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isPending ? 'Saving...' : 'Save Job'}
            </button>
        </form>
    );
}