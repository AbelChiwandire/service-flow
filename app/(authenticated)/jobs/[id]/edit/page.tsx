import { notFound } from "next/navigation";
import { getJobById } from "@/lib/db/jobs/repository";
import { IdSchema } from "@/lib/db/jobs/schema";
import { requireUserId } from "@/lib/auth/session";
import UpdateJobForm from "./update-job-form";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const userId = await requireUserId();
    const { id } = await params;

    if (!IdSchema.safeParse(id).success) {
        notFound();
    }

    const job = await getJobById(userId, id);
    if (!job) {
        notFound();
    }

    const initialValues = {
        title: job.title,
        description: job.description,
        scheduledDate: job.scheduledDate,
        status: job.status,
    };

    return (
        <div className="max-w-xl space-y-4">
            <h1 className="text-xl font-semibold">Edit job</h1>
            <UpdateJobForm jobId={job.id} initialValues={initialValues} />
        </div>
    );
}
