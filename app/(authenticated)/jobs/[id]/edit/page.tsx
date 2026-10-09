import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getJob } from "@/lib/db/jobs/queries";
import { IdSchema } from "@/lib/db/jobs/schema";
import { PLACEHOLDER_USER_ID } from "@/lib/auth/placeholder-session";
import UpdateJobForm from "./update-job-form";

export const metadata: Metadata = {
  title: "Edit job",
  description: "Update the details of this job.",
};

export const dynamic = "force-dynamic";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!IdSchema.safeParse(id).success) {
    notFound();
  }

  const job = await getJob(PLACEHOLDER_USER_ID, id);
  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit job" description="Update the details of this job." />

      <div className="max-w-xl">
        <UpdateJobForm
          jobId={job.id}
          initialValues={{
            title: job.title,
            description: job.description,
            scheduledDate: job.scheduledDate,
          }}
        />
      </div>
    </div>
  );
}
