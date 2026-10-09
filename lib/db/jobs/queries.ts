import type {
  Job,
  JobListFilters,
  JobListResult,
  JobUpdate,
  NewJob,
} from "./repository";
import {
  MOCK_CUSTOMERS,
  createMockJob,
  deleteMockJob,
  getMockJob,
  getMockJobs,
  updateMockJob,
} from "./mock-data";

// In development, with no DATABASE_URL, serve mock data. Never in production:
// a missing DATABASE_URL there should fail loudly, not show fake jobs.
const useMockData =
  process.env.NODE_ENV !== "production" && !process.env.DATABASE_URL;

if (useMockData) {
  console.warn("[jobs] DATABASE_URL not set: using in-memory mock data.");
}

export type MutationResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

export interface CustomerOption {
  id: string;
  name: string;
}

export type JobDetail = Job & { customerName: string };

const JOB_NOT_FOUND = "Job not found.";

// The repository is imported lazily so the database client is never loaded in mock mode.

export async function getJobsPage(
  userId: string,
  filters: JobListFilters
): Promise<JobListResult> {
  if (useMockData) return getMockJobs(filters);

  const { getFilteredJobs } = await import("./repository");
  return getFilteredJobs(userId, filters);
}

export async function getJob(userId: string, id: string): Promise<Job | null> {
  if (useMockData) return getMockJob(id);

  const { getJobById } = await import("./repository");
  return getJobById(userId, id);
}

export async function getJobDetail(
  userId: string,
  id: string
): Promise<JobDetail | null> {
  if (useMockData) return getMockJob(id);

  const { getJobById, getJobCustomer } = await import("./repository");
  const job = await getJobById(userId, id);
  if (!job) return null;

  const customer = await getJobCustomer(userId, job.customerId);
  return { ...job, customerName: customer?.name ?? "Unknown customer" };
}

export async function getCustomerOptions(userId: string): Promise<CustomerOption[]> {
  if (useMockData) return MOCK_CUSTOMERS;

  const { getCustomers } = await import("../customer/repository");
  const customers = await getCustomers(userId);
  return customers.map(({ id, name }) => ({ id, name }));
}

export async function createJobRecord(
  userId: string,
  input: Omit<NewJob, "userId">
): Promise<MutationResult<Job>> {
  if (useMockData) {
    const job = createMockJob(input);
    return job
      ? { ok: true, data: job }
      : { ok: false, message: "Customer not found." };
  }

  const { createJob, JobCustomerNotFoundError } = await import("./repository");
  try {
    return { ok: true, data: await createJob({ userId, ...input }) };
  } catch (error) {
    if (error instanceof JobCustomerNotFoundError) {
      return { ok: false, message: error.message };
    }
    throw error;
  }
}

export async function updateJobRecord(
  userId: string,
  id: string,
  patch: JobUpdate
): Promise<MutationResult<Job>> {
  if (useMockData) {
    const job = updateMockJob(id, patch);
    return job ? { ok: true, data: job } : { ok: false, message: JOB_NOT_FOUND };
  }

  const { updateJob } = await import("./repository");
  const job = await updateJob(userId, id, patch);
  return job ? { ok: true, data: job } : { ok: false, message: JOB_NOT_FOUND };
}

export async function deleteJobRecord(
  userId: string,
  id: string
): Promise<MutationResult<null>> {
  if (useMockData) {
    const outcome = deleteMockJob(id);
    if (outcome === "deleted") return { ok: true, data: null };
    return {
      ok: false,
      message:
        outcome === "active"
          ? "Cannot delete a scheduled or in-progress job. Cancel it first."
          : JOB_NOT_FOUND,
    };
  }

  const { deleteJob, ActiveJobDeleteError } = await import("./repository");
  try {
    const job = await deleteJob(userId, id);
    return job ? { ok: true, data: null } : { ok: false, message: JOB_NOT_FOUND };
  } catch (error) {
    if (error instanceof ActiveJobDeleteError) {
      return { ok: false, message: error.message };
    }
    throw error;
  }
}