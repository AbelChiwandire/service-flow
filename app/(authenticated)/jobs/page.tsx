import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { JobList } from "@/components/JobList";
import { JobFilters } from "@/components/JobFilters";
import { Pagination } from "@/components/Pagination";
import { getJobsPage } from "@/lib/db/jobs/queries";
import { JOBS_PER_PAGE } from "@/lib/db/jobs/constants";
import { JobStatusSchema } from "@/lib/db/jobs/schema";
import { PLACEHOLDER_USER_ID } from "@/lib/auth/placeholder-session";

export const metadata: Metadata = {
  title: "Jobs",
  description: "Schedule work, track progress, and find any job quickly.",
};

// Jobs depend on the signed-in user and the URL, so never prerender at build time.
export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const primaryLinkClassName =
  "inline-flex h-10 items-center justify-center rounded-md bg-[#2667FF] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC]";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const query = firstValue(params.query)?.trim().slice(0, 100) || undefined;

  const statusResult = JobStatusSchema.safeParse(firstValue(params.status));
  const status = statusResult.success ? statusResult.data : undefined;

  const requestedPage = Number.parseInt(firstValue(params.page) ?? "1", 10);
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  function getPageHref(targetPage: number): string {
    const search = new URLSearchParams();
    if (query) search.set("query", query);
    if (status) search.set("status", status);
    if (targetPage > 1) search.set("page", String(targetPage));

    const queryString = search.toString();
    return queryString ? `/jobs?${queryString}` : "/jobs";
  }

  const { jobs, totalCount } = await getJobsPage(PLACEHOLDER_USER_ID, {
    query,
    status,
    page,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / JOBS_PER_PAGE));

  // A stale link (for example page 9 after filtering) goes to the last real page.
  if (page > totalPages) {
    redirect(getPageHref(totalPages));
  }

  const hasFilters = Boolean(query || status);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        description="Schedule work, track progress, and find any job quickly."
        action={
          <Link href="/jobs/new" className={primaryLinkClassName}>
            New job
          </Link>
        }
      />

      <JobFilters />

      {jobs.length === 0 ? (
        hasFilters ? (
          <EmptyState
            title="No matching jobs"
            message="Try a different search term or status filter."
          />
        ) : (
          <EmptyState
            title="No jobs yet"
            message="Schedule your first job to start tracking work for your customers."
            action={
              <Link href="/jobs/new" className={primaryLinkClassName}>
                New job
              </Link>
            }
          />
        )
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {totalCount} {totalCount === 1 ? "job" : "jobs"}
          </p>

          <JobList jobs={jobs} />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            getPageHref={getPageHref}
          />
        </div>
      )}
    </div>
  );
}
