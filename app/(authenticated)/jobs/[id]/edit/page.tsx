import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { getJobById } from "@/lib/db/jobs/repository";
import { IdSchema } from "@/lib/db/jobs/schema";
import { requireUserId } from "@/lib/auth/session";
import { UpdateJobForm } from "@/components/jobs/UpdateJobForm";

export const metadata: Metadata = {
    title: "Edit job",
    description: "Update the details of this job.",
};

export const dynamic = "force-dynamic";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!IdSchema.safeParse(id).success) {
        notFound();
    }

    const userId = await requireUserId();
    const job = await getJobById(userId, id);
    if (!job) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit job"
                description="Update the details of this job."
                back={{ href: `/jobs/${job.id}`, label: "Back to job" }}
            />

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
