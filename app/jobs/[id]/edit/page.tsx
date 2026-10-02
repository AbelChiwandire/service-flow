import { notFound } from 'next/navigation';
import { getJobById } from '@/lib/db/jobs/repository';
import { IdSchema } from '@/lib/db/jobs/schema';
import { PLACEHOLDER_USER_ID } from '@/lib/auth/placeholder-session';
import UpdateJobForm from './update-job-form';
import { toDateInputValue } from '@/lib/db/jobs/date-utils';

export default async function EditJobPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    if (!IdSchema.safeParse(id).success) {
        notFound();
    }

    const job = await getJobById(PLACEHOLDER_USER_ID, id);
    if (!job) {
        notFound();
    }

    const initialValues = {
        title: job.title,
        description: job.description,
        scheduledDate: toDateInputValue(job.scheduledDate),
        status: job.status,
    };

    return (
        <div className="max-w-xl space-y-4">
            <h1 className="text-xl font-semibold">Edit job</h1>
            <UpdateJobForm
                userId={PLACEHOLDER_USER_ID}
                jobId={job.id}
                initialValues={initialValues}
            />
        </div>
    );
}