import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { JobDetails } from "@/components/jobs/JobDetails";
import { JobStatusControl } from "@/components/jobs/JobStatusControl";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { DeleteSection } from "@/components/shared/DeleteSection";
import { DeleteJobButton } from "@/components/jobs/DeleteJobButton";
import { getJobById } from "@/lib/db/jobs/repository";
import { getCustomerById } from "@/lib/db/customer/repository";
import { IdSchema } from "@/lib/db/jobs/schema";
import { requireUserId } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

// Shared by generateMetadata and the page so the job is only loaded once per request.
const loadJob = cache(async (id: string) => {
  if (!IdSchema.safeParse(id).success) return null;
  const userId = await requireUserId();
  const job = await getJobById(userId, id);
  if (!job) return null;

  const customer = await getCustomerById(userId, job.customerId);
  return { ...job, customerName: customer?.name ?? "Unknown customer" };
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
        back={{ href: "/jobs", label: "Back to jobs" }}
        action={
          <ButtonLink href={`/jobs/${job.id}/edit`} variant="secondary">
            Edit job
          </ButtonLink>
        }
      />

      <JobDetails job={job} />

      <section
        aria-labelledby="job-actions-heading"
        className="space-y-4 card-padded"
      >
        <h2 id="job-actions-heading" className="heading-h2">
          Actions
        </h2>

        <JobStatusControl jobId={job.id} status={job.status} />
      </section>

      <DeleteSection>
        {isDeletable ? (
          <DeleteJobButton jobId={job.id} jobTitle={job.title} />
        ) : (
          <p className="small-text">
            Cancel or complete this job before deleting it.
          </p>
        )}
      </DeleteSection>
    </div>
  );
}
