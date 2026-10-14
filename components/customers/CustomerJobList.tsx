"use client";

import { useCallback, useEffect, useState } from "react";
import { DataRow, DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { LoadingState } from "@/components/shared/LoadingState";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { formatDate } from "@/lib/format-date";
import type { JobStatus } from "@/lib/db/jobs/repository";
import Link from "next/link";

type Job = {
  id: string;
  customerId: string;
  title: string;
  description: string | null;
  scheduledDate: string;
  status: JobStatus;
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
    (typeof value.description === "string" || value.description === null) &&
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

const columns: DataTableColumn[] = [
  { label: "Job", className: "col-span-6" },
  { label: "Scheduled", className: "col-span-3" },
  { label: "Status", className: "col-span-3" },
];

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
      const response = await fetch(`/api/jobs?customerId=${customer.id}&due=upcoming`, {
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
    <section aria-labelledby="customer-jobs-heading" className="space-y-4">
      <div>
        <h2 id="customer-jobs-heading" className="heading-h2">
          Upcoming jobs
        </h2>
        <p className="mt-1 small-text">
          A list of upcoming jobs for this customer.
        </p>
      </div>

      {isLoading ? (
        <LoadingState message="Loading jobs..." />
      ) : error ? (
        <ErrorMessage title="Jobs couldn't be loaded." message={error} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No upcoming jobs"
          message="There are no upcoming jobs for this customer."
          action={
            <ButtonLink href={`/jobs/new?customerId=${customer.id}`}>New job</ButtonLink>
          }
        />
      ) : (
        <DataTable columns={columns}>
          {jobs.map((job) => (
            <DataRow key={job.id}>
              <div className="min-w-0 md:col-span-6">
                <Link
                  href={`/jobs/${job.id}`}
                  className="link-subtle"
                >
                  {job.title}
                </Link>
              </div>

              <p className="md:col-span-3 small-text">
                <span className="text-foreground md:hidden">Scheduled: </span>
                {formatDate(job.scheduledDate)}
              </p>

              <div className="md:col-span-3">
                <JobStatusBadge status={job.status} />
              </div>
            </DataRow>
          ))}
        </DataTable>
      )}
    </section>
  );
}