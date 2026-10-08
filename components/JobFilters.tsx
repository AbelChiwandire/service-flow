"use client";

import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const fieldClassName =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#2667FF] focus:outline-none focus:ring-1 focus:ring-[#2667FF]";

export function JobFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function updateParam(name: "query" | "status", value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    // Any filter change should go back to the first page of results.
    params.delete("page");

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function handleSearchChange(value: string) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => updateParam("query", value.trim()), 300);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <label htmlFor="job-search" className="sr-only">
          Search jobs
        </label>
        <input
          id="job-search"
          type="search"
          placeholder="Search by job title or customer"
          defaultValue={searchParams.get("query") ?? ""}
          onChange={(event) => handleSearchChange(event.target.value)}
          className={fieldClassName}
        />
      </div>

      <div className="sm:w-48">
        <label htmlFor="job-status" className="sr-only">
          Filter by status
        </label>
        <select
          id="job-status"
          defaultValue={searchParams.get("status") ?? ""}
          onChange={(event) => updateParam("status", event.target.value)}
          className={fieldClassName}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
