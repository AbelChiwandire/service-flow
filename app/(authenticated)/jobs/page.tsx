import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { JobList } from "@/components/JobList";
import { JobFilters } from "@/components/JobFilters";
import { Pagination } from "@/components/Pagination";
import {
  ITEMS_PER_PAGE,
  countJobs,
  getJobs,
  type JobListParams,
} from "@/lib/db/jobs/repository";
import {
  parseDue,
  parsePage,
  parseQuery,
  parseSort,
  parseStatus,
} from "@/lib/db/dashboard/search-params";
import { requireUserId } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Jobs",
  description: "Schedule work, track progress, and find any job quickly.",
};

// Jobs depend on the signed-in user and the URL, so never prerender at build time.
export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

const primaryLinkClassName =
  "inline-flex h-10 items-center justify-center rounded-md bg-[#2667FF] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC]";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const filters: JobListParams = {
    query: parseQuery(params.query).slice(0, 100) || undefined,
    page: parsePage(params.page),
    status: parseStatus(params.status),
    due: parseDue(params.due),
    sort: parseSort(params.sort),
  };
  const page = filters.page ?? 1;

  function getPageHref(targetPage: number): string {
    const search = new URLSearchParams();
    if (filters.query) search.set("query", filters.query);
    if (filters.status) search.set("status", filters.status);
    if (filters.due) search.set("due", filters.due);
    if (filters.sort === "desc") search.set("sort", "desc");
    if (targetPage > 1) search.set("page", String(targetPage));

    const queryString = search.toString();
    return queryString ? `/jobs?${queryString}` : "/jobs";
  }

  const userId = await requireUserId();
  const [jobs, totalCount] = await Promise.all([
    getJobs(userId, filters),
    countJobs(userId, filters),
  ]);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // A stale link (for example page 9 after filtering) goes to the last real page.
  const lastPage = Math.max(1, totalPages);
  if (page > lastPage) {
    redirect(getPageHref(lastPage));
  }
  const hasFilters = Boolean(filters.query || filters.status || filters.due);

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
