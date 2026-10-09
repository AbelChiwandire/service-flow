// DEV-ONLY mock data so the jobs UI can be built and tested without DATABASE_URL.
// Used automatically by lib/db/jobs/queries.ts when DATABASE_URL is not set
// (never in production). Safe to delete once everyone has a database connection.
// Changes made through the forms live in memory and reset when the dev server restarts.

import type {
  Job,
  JobListFilters,
  JobListItem,
  JobListResult,
  JobStatus,
  JobUpdate,
  NewJob,
} from "./repository";
import { JOBS_PER_PAGE } from "./constants";

type MockJob = Job & { customerName: string };

const USER_ID = "00000000-0000-0000-0000-000000000001";

// Valid v4-style UUIDs, so they pass IdSchema (z.uuid()) on detail/edit pages.
const id = (n: number) =>
  `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

const adaeze = { id: id(901), name: "Adaeze Okafor" };
const tunde = { id: id(902), name: "Tunde Bakare" };
const cafe = { id: id(903), name: "Green Leaf Cafe" };
const sunrise = { id: id(904), name: "Sunrise Apartments" };

export const MOCK_CUSTOMERS = [adaeze, tunde, cafe, sunrise];

type SeedRow = [number, { id: string; name: string }, string, string, JobStatus];

function seed(): MockJob[] {
  const rows: SeedRow[] = [
    [1, adaeze, "Fix leaky kitchen faucet", "2026-10-15", "scheduled"],
    [2, cafe, "Deep clean dining area", "2026-10-14", "in_progress"],
    [3, sunrise, "Lawn maintenance", "2026-10-12", "completed"],
    [4, tunde, "AC servicing", "2026-10-11", "completed"],
    [5, adaeze, "Replace bathroom tiles", "2026-10-20", "scheduled"],
    [6, sunrise, "Hallway repainting", "2026-10-18", "scheduled"],
    [7, cafe, "Window cleaning", "2026-10-09", "in_progress"],
    [8, tunde, "Electrical rewiring", "2026-10-08", "cancelled"],
    [9, adaeze, "Garden trimming", "2026-10-07", "completed"],
    [10, sunrise, "Generator inspection", "2026-10-22", "scheduled"],
    [11, cafe, "Pest control treatment", "2026-10-05", "completed"],
    [12, tunde, "Fix gate lock", "2026-10-03", "cancelled"],
    [13, adaeze, "Install ceiling fans", "2026-10-25", "scheduled"],
    [14, sunrise, "Roof leak repair", "2026-10-01", "completed"],
  ];

  return rows.map(([n, customer, title, scheduledDate, status]) => ({
    id: id(n),
    userId: USER_ID,
    customerId: customer.id,
    customerName: customer.name,
    title,
    description: n === 1 ? "Kitchen sink is dripping constantly." : null,
    scheduledDate,
    status,
    createdAt: "2026-10-01T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
    isDeleted: false,
    deletedAt: null,
  }));
}

// Kept on globalThis so hot reloads in `next dev` don't wipe the data.
const globalForMock = globalThis as unknown as { __mockJobs?: MockJob[] };
const store: MockJob[] = (globalForMock.__mockJobs ??= seed());

function toListItem(job: MockJob): JobListItem {
  return {
    id: job.id,
    customerId: job.customerId,
    customerName: job.customerName,
    title: job.title,
    scheduledDate: job.scheduledDate,
    status: job.status,
  };
}

export function getMockJobs({ query, status, page }: JobListFilters): JobListResult {
  const search = query?.toLowerCase();

  const filtered = store
    .filter((job) => !job.isDeleted)
    .filter((job) => !status || job.status === status)
    .filter(
      (job) =>
        !search ||
        job.title.toLowerCase().includes(search) ||
        job.customerName.toLowerCase().includes(search)
    )
    .sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate));

  const start = (page - 1) * JOBS_PER_PAGE;

  return {
    jobs: filtered.slice(start, start + JOBS_PER_PAGE).map(toListItem),
    totalCount: filtered.length,
  };
}

export function getMockJob(jobId: string): MockJob | null {
  return store.find((job) => job.id === jobId && !job.isDeleted) ?? null;
}

export function createMockJob(input: Omit<NewJob, "userId">): MockJob | null {
  const customer = MOCK_CUSTOMERS.find((c) => c.id === input.customerId);
  if (!customer) return null;

  const now = new Date().toISOString();
  const job: MockJob = {
    id: crypto.randomUUID(),
    userId: USER_ID,
    customerId: customer.id,
    customerName: customer.name,
    title: input.title,
    description: input.description ?? null,
    scheduledDate: input.scheduledDate,
    status: input.status ?? "scheduled",
    createdAt: now,
    updatedAt: now,
    isDeleted: false,
    deletedAt: null,
  };

  store.unshift(job);
  return job;
}

export function updateMockJob(jobId: string, patch: JobUpdate): MockJob | null {
  const job = getMockJob(jobId);
  if (!job) return null;

  if (patch.title !== undefined) job.title = patch.title;
  if (patch.description !== undefined) job.description = patch.description;
  if (patch.scheduledDate !== undefined) job.scheduledDate = patch.scheduledDate;
  if (patch.status !== undefined) job.status = patch.status;
  job.updatedAt = new Date().toISOString();

  return job;
}

export function deleteMockJob(jobId: string): "deleted" | "active" | "not_found" {
  const job = getMockJob(jobId);
  if (!job) return "not_found";
  if (job.status === "scheduled" || job.status === "in_progress") return "active";

  job.isDeleted = true;
  job.deletedAt = new Date().toISOString();
  return "deleted";
}