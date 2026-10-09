import type { DashboardJob } from "@/lib/db/dashboard/repository";
import JobPreviewList from "./JobPreviewList";

interface UpcomingJobsProps {
    jobs: DashboardJob[];
    total: number;
}

export default function UpcomingJobs({ jobs, total }: UpcomingJobsProps) {
    return (
        <JobPreviewList
            title="Upcoming jobs"
            jobs={jobs}
            total={total}
            viewAllHref="/jobs?due=upcoming"
            emptyText="No upcoming jobs."
        />
    );
}
