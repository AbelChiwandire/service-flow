import type { JobWithCustomer } from "@/lib/db/jobs/repository";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { JobItem } from "./JobItem";

const columns: DataTableColumn[] = [
    { label: "Job", className: "col-span-4" },
    { label: "Customer", className: "col-span-3" },
    { label: "Scheduled", className: "col-span-3" },
    { label: "Status", className: "col-span-2" },
];

export function JobList({ jobs }: { jobs: JobWithCustomer[] }) {
    return (
        <DataTable columns={columns}>
            {jobs.map((job) => (
                <JobItem key={job.id} job={job} />
            ))}
        </DataTable>
    );
}
