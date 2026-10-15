"use client";

import { ListFilters, type FilterSelect } from "@/components/shared/ListFilters";

const customerSelect: FilterSelect = {
    param: "filter",
    label: "Filter customers",
    options: [
        { value: "", label: "All customers" },
        { value: "leads", label: "Leads (no active jobs)" },
    ],
};

export function CustomerFilters() {
    return (
        <ListFilters
            searchLabel="Search customers"
            searchPlaceholder="Search by name, email, phone or address"
            select={customerSelect}
        />
    );
}
