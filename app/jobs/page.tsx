// PLACEHOLDER TEST PAGE — just enough to exercise the jobs create/update/delete
// flow end to end before the real UI exists. Not final UI.

import Link from 'next/link';
import { getJobs } from '@/lib/db/jobs/repository';
import { PLACEHOLDER_USER_ID } from '@/lib/auth/placeholder-session';
import DeleteJobButton from './delete-job-button';
import { formatDateDisplay } from '@/lib/db/jobs/date-utils';

export const dynamic = 'force-dynamic';

export default async function JobsPage() {
    const jobs = await getJobs(PLACEHOLDER_USER_ID);

    return (
        <div className="max-w-xl space-y-4">
            <h1 className="text-xl font-semibold">Jobs</h1>

            <ul className="space-y-2">
                {jobs.map((job) => (
                    <li
                        key={job.id}
                        className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
                    >
                        <div>
                            <p className="font-medium">{job.title}</p>
                            <p className="text-sm text-slate-600">
                                {job.status}
                                {formatDateDisplay(job.scheduledDate)}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/jobs/${job.id}/edit`}
                                className="text-sm text-teal-700 hover:underline"
                            >
                                Edit
                            </Link>
                            <DeleteJobButton userId={PLACEHOLDER_USER_ID} jobId={job.id} />
                        </div>
                    </li>
                ))}
            </ul>

            {jobs.length === 0 ? (
                <p className="text-sm text-slate-600">No jobs yet.</p>
            ) : null}
        </div>
    );
}