"use client";

import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const fieldClassName =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#2667FF] focus:outline-none focus:ring-1 focus:ring-[#2667FF]";

export type FilterSelect = {
  // The URL param this select controls, for example "status".
  param: string;
  label: string;
  options: { value: string; label: string }[];
};

type ListFiltersProps = {
  searchLabel: string;
  searchPlaceholder: string;
  select?: FilterSelect;
};

export function ListFilters({ searchLabel, searchPlaceholder, select }: ListFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function updateParam(name: string, value: string) {
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
        <label htmlFor="list-search" className="sr-only">
          {searchLabel}
        </label>
        <input
          id="list-search"
          type="search"
          placeholder={searchPlaceholder}
          defaultValue={searchParams.get("query") ?? ""}
          onChange={(event) => handleSearchChange(event.target.value)}
          className={fieldClassName}
        />
      </div>

      {select ? (
        <div className="sm:w-48">
          <label htmlFor="list-select" className="sr-only">
            {select.label}
          </label>
          <select
            id="list-select"
            defaultValue={searchParams.get(select.param) ?? ""}
            onChange={(event) => updateParam(select.param, event.target.value)}
            className={fieldClassName}
          >
            {select.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}