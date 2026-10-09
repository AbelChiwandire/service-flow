import type { DashboardJob } from "@/lib/db/dashboard/repository";
import JobPreviewList from "./JobPreviewList";

interface OverdueJobsProps {
    jobs: DashboardJob[];
    total: number;
}

export default function OverdueJobs({ jobs, total }: OverdueJobsProps) {
    return (
        <JobPreviewList
            title="Overdue jobs"
            jobs={jobs}
            total={total}
            viewAllHref="/jobs?due=overdue"
            emptyText="Nothing overdue."
        />
    );
}
