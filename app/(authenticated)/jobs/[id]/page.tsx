import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { JobDetails } from "@/components/JobDetails";
import { JobStatusControl } from "@/components/JobStatusControl";
import { DeleteJobButton } from "@/components/DeleteJobButton";
import { getJobDetail } from "@/lib/db/jobs/queries";
import { IdSchema } from "@/lib/db/jobs/schema";
import { PLACEHOLDER_USER_ID } from "@/lib/auth/placeholder-session";

export const dynamic = "force-dynamic";

// Shared by generateMetadata and the page so the job is only loaded once per request.
const loadJob = cache(async (id: string) => {
  if (!IdSchema.safeParse(id).success) return null;
  return getJobDetail(PLACEHOLDER_USER_ID, id);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await loadJob(id);

  return { title: job ? job.title : "Job not found" };
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await loadJob(id);

  if (!job) {
    notFound();
  }

  const isDeletable = job.status === "completed" || job.status === "cancelled";

  return (
    <div className="space-y-6">
      <PageHeader
        title={job.title}
        description={`Job for ${job.customerName}`}
        action={
          <Link
            href={`/jobs/${job.id}/edit`}
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:border-[#2667FF] hover:text-[#2667FF]"
          >
            Edit job
          </Link>
        }
      />

      <JobDetails job={job} />

      <section
        aria-labelledby="job-actions-heading"
        className="space-y-4 rounded-lg border border-slate-200 bg-white p-6"
      >
        <h2 id="job-actions-heading" className="text-lg font-semibold text-slate-900">
          Actions
        </h2>

        <JobStatusControl jobId={job.id} status={job.status} />

        <div className="border-t border-slate-200 pt-4">
          {isDeletable ? (
            <DeleteJobButton jobId={job.id} />
          ) : (
            <p className="text-sm text-slate-600">
              Cancel or complete this job before deleting it.
            </p>
          )}
        </div>
      </section>

      <Link
        href="/jobs"
        className="inline-block text-sm font-medium text-slate-600 transition-colors hover:text-[#2667FF]"
      >
        &larr; Back to jobs
      </Link>
    </div>
  );
}
