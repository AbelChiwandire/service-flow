"use client";

import { useCallback, useEffect, useState } from "react";

type Job = {
  id: string;
  customerId: string;
  title: string;
  description: string;
  scheduledDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
};

type JobsResponse = {
  data: Job[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isJob(value: unknown): value is Job {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.customerId === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.scheduledDate === "string" &&
    typeof value.status === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    typeof value.isDeleted === "boolean" &&
    (typeof value.deletedAt === "string" || value.deletedAt === null)
  );
}

function isJobsResponse(value: unknown): value is JobsResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.data) &&
    value.data.every(isJob)
  );
}

function formatScheduledDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function statusClassName(status: string) {
  switch (status) {
    case "scheduled":
      return "bg-sky-100 text-sky-900";
    case "in_progress":
      return "bg-amber-100 text-amber-950";
    case "completed":
      return "bg-emerald-100 text-emerald-900";
    case "cancelled":
      return "bg-rose-100 text-rose-900";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export default function CustomerJobList({
  customer,
}: {
  customer: { id: string };
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = useCallback(async (signal: AbortSignal) => {
    try {
      const response = await fetch("/api/jobs", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
        signal,
      });

      if (!response.ok) {
        throw new Error(
          `We couldn't load jobs for this customer (request failed with status ${response.status}).`,
        );
      }

      const payload: unknown = await response.json();
      if (!isJobsResponse(payload)) {
        throw new Error("The job service returned an unexpected response.");
      }

      setJobs(payload.data.filter((job) => job.customerId === customer.id));
    } catch (loadError: unknown) {
      if (!signal.aborted) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "We couldn't load jobs for this customer. Please try again.",
        );
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [customer.id]);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      void loadJobs(controller.signal);
    });

    return () => controller.abort();
  }, [loadJobs]);

  return (
    <section aria-labelledby="customer-jobs-heading" className="mt-8">
      <div className="mb-4">
        <h2
          id="customer-jobs-heading"
          className="text-xl font-semibold text-slate-950"
        >
          Jobs
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Service work associated with this customer.
        </p>
      </div>

      {isLoading ? (
        <div
          aria-busy="true"
          className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm"
        >
          <div
            aria-hidden="true"
            className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#2667FF]"
          />
          <p role="status" className="mt-4 text-sm font-medium text-slate-600">
            Loading jobs…
          </p>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-xl border border-rose-300 bg-white p-5 text-sm text-rose-950 shadow-sm"
        >
          <p className="font-semibold">Jobs couldn&apos;t be loaded.</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
          <h3 className="font-semibold text-slate-950">No jobs yet</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            There are no jobs associated with this customer.
          </p>
        </div>
      ) : (
        <ul className="grid list-none gap-4 p-0 md:grid-cols-2">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="break-words font-semibold text-slate-950">
                  {job.title}
                </h3>
                <span
                  className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClassName(job.status)}`}
                >
                  {formatStatus(job.status)}
                </span>
              </div>
              <dl className="mt-4 border-t border-slate-100 pt-3 text-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <dt className="font-medium text-slate-500">Scheduled</dt>
                  <dd className="text-slate-800">
                    {formatScheduledDate(job.scheduledDate)}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
