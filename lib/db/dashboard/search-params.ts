import type { DueFilter, JobStatus } from "../jobs/repository";
import type { CustomerListParams } from "../customer/repository";

// What Next.js gives us for a single query param.
type RawParam = string | string[] | undefined;

const JOB_STATUSES: readonly JobStatus[] = ["scheduled", "in_progress", "completed", "cancelled"];
const DUE_FILTERS: readonly DueFilter[] = ["upcoming", "overdue"];

// ?x=1&x=2 arrives as an array; we only ever want the first value.
function first(value: RawParam): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

export function parseQuery(value: RawParam): string {
    return first(value)?.trim() ?? "";
}

export function parsePage(value: RawParam): number {
    const n = Number(first(value));
    return Number.isInteger(n) && n >= 1 ? n : 1;
}

export function parseStatus(value: RawParam): JobStatus | undefined {
    const v = first(value);
    return JOB_STATUSES.find((s) => s === v);
}

export function parseDue(value: RawParam): DueFilter | undefined {
    const v = first(value);
    return DUE_FILTERS.find((d) => d === v);
}

export function parseSort(value: RawParam): "asc" | "desc" {
    return first(value) === "desc" ? "desc" : "asc";
}

export function parseCustomerFilter(value: RawParam): CustomerListParams["filter"] {
    return first(value) === "leads" ? "leads" : undefined;
}
