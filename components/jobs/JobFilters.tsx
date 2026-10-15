"use client";

import { ListFilters, type FilterSelect } from "@/components/shared/ListFilters";

const statusSelect: FilterSelect = {
    param: "status",
    label: "Filter by status",
    options: [
        { value: "", label: "All statuses" },
        { value: "scheduled", label: "Scheduled" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
    ],
};

export function JobFilters() {
    return (
        <ListFilters
            searchLabel="Search jobs"
            searchPlaceholder="Search by job title or customer"
            select={statusSelect}
        />
    );
}
