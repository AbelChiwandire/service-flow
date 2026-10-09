import { neon } from "@neondatabase/serverless";
import { getTodayForRequest } from "../dashboard/date-utils";

const sql = neon(process.env.DATABASE_URL!);

const ITEMS_PER_PAGE = 10;

export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type DueFilter = "upcoming" | "overdue";

export interface Job {
    id: string;
    userId: string;
    customerId: string;
    title: string;
    description: string | null;
    scheduledDate: string;
    status: JobStatus;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    deletedAt: string | null;
}

export interface NewJob {
    userId: string;
    customerId: string;
    title: string;
    description?: string | null;
    scheduledDate: string;
    status?: JobStatus;
}

// A job plus the name of the customer it belongs to (from the join).
export type JobWithCustomer = Job & { customerName: string };

export interface JobListParams {
    query?: string;
    page?: number;
    pageSize?: number;
    status?: JobStatus;
    due?: DueFilter;
    sort?: "asc" | "desc";
}

export type JobUpdate = Partial<Pick<Job, "title" | "description" | "status">> & {
    scheduledDate?: string;
};

export class JobCustomerNotFoundError extends Error {
    constructor() {
        super("Customer not found.");
        this.name = "JobCustomerNotFoundError";
    }
}

export class ActiveJobDeleteError extends Error {
    constructor() {
        super("Cannot delete a scheduled or in-progress job. Cancel it first.");
        this.name = "ActiveJobDeleteError";
    }
}

// "upcoming" and "overdue" both mean: still scheduled, split by today's date.
function dueFilter(due: DueFilter | undefined, today: string) {
    if (due === "upcoming") {
        return sql`AND jobs.status = 'scheduled' AND jobs."scheduledDate" >= ${today}`;
    }
    if (due === "overdue") {
        return sql`AND jobs.status = 'scheduled' AND jobs."scheduledDate" < ${today}`;
    }
    return sql``;
}

function jobsFrom() {
    return sql`FROM jobs JOIN customers ON customers.id = jobs."customerId"`;
}

// The single definition of "which jobs match". Used by the list, the count and the page count.
function jobFilters(userId: string, params: JobListParams, today: string) {
    const { query = "", status, due } = params;
    const searchTerm = `%${query}%`;

    return sql`
        jobs."userId" = ${userId}
        AND jobs."isDeleted" = false
        AND customers."isDeleted" = false
        AND (
            jobs.title ILIKE ${searchTerm}
            OR jobs.description ILIKE ${searchTerm}
            OR customers.name ILIKE ${searchTerm}
        )
        ${status ? sql`AND jobs.status = ${status}` : sql``}
        ${dueFilter(due, today)}
    `;
}

// jobs.id is the last tiebreaker so jobs on the same date always come back in the
// same order, which keeps pagination stable between pages.
function orderBy(sort: "asc" | "desc") {
    return sort === "desc"
        ? sql`ORDER BY jobs."scheduledDate" DESC, jobs."createdAt" DESC, jobs.id DESC`
        : sql`ORDER BY jobs."scheduledDate" ASC, jobs."createdAt" ASC, jobs.id ASC`;
}

export async function getJobs(
    userId: string,
    params: JobListParams = {},
): Promise<JobWithCustomer[]> {
    const { page = 1, pageSize = ITEMS_PER_PAGE, sort = "asc" } = params;
    const offset = (Math.max(1, page) - 1) * pageSize;

    const rows = await sql`
        SELECT jobs.id, jobs."userId", jobs."customerId", jobs.title, jobs.description,
            jobs."scheduledDate"::text AS "scheduledDate", jobs.status,
            jobs."createdAt", jobs."updatedAt", jobs."isDeleted", jobs."deletedAt",
            customers.name AS "customerName"
        ${jobsFrom()}
        WHERE ${jobFilters(userId, params, await getTodayForRequest())}
        ${orderBy(sort)}
        LIMIT ${pageSize} OFFSET ${offset}
    `;
    return rows as unknown as JobWithCustomer[];
}

export async function countJobs(userId: string, params: JobListParams = {}): Promise<number> {
    const rows = await sql`
        SELECT COUNT(*)
        ${jobsFrom()}
        WHERE ${jobFilters(userId, params, await getTodayForRequest())}
    `;
    return Number(rows[0].count);
}

export async function getJobsTotalPages(
    userId: string,
    params: JobListParams = {},
): Promise<number> {
    const { pageSize = ITEMS_PER_PAGE } = params;
    return Math.ceil((await countJobs(userId, params)) / pageSize);
}

export async function getJobsByCustomer(userId: string, customerId: string): Promise<Job[]> {
    const rows = await sql`
        SELECT id, "userId", "customerId", title, description, "scheduledDate"::text AS "scheduledDate", status, "createdAt", "updatedAt", "isDeleted", "deletedAt"
        FROM jobs
        WHERE "userId" = ${userId}
        AND "customerId" = ${customerId}
        AND "isDeleted" = false
    `;
    return rows as unknown as Job[];
}

export async function getJobById(userId: string, id: string): Promise<Job | null> {
    const rows = await sql`
        SELECT id, "userId", "customerId", title, description, "scheduledDate"::text AS "scheduledDate", status, "createdAt", "updatedAt", "isDeleted", "deletedAt"
        FROM jobs
        WHERE id = ${id}
        AND "userId" = ${userId}
        AND "isDeleted" = false
    `;
    return (rows[0] as unknown as Job) ?? null;
}

export async function createJob(job: NewJob): Promise<Job> {
    const rows = await sql`
        INSERT INTO jobs ("userId", "customerId", title, description, "scheduledDate", status)
        SELECT
            ${job.userId},
            c.id,
            ${job.title},
            ${job.description ?? null},
            ${job.scheduledDate}::date,
            COALESCE(${job.status ?? null}::job_status, 'scheduled')
        FROM customers c
        WHERE c.id = ${job.customerId}
        AND c."userId" = ${job.userId}
        AND c."isDeleted" = false
        RETURNING id, "userId", "customerId", title, description, "scheduledDate"::text AS "scheduledDate", status, "createdAt", "updatedAt", "isDeleted", "deletedAt"
    `;

    if (rows.length === 0) {
        throw new JobCustomerNotFoundError();
    }

    return rows[0] as unknown as Job;
}

export async function updateJob(userId: string, id: string, job: JobUpdate): Promise<Job | null> {
    const rows = await sql`
        UPDATE jobs
        SET
            title = COALESCE(${job.title ?? null}, title),
            description = CASE
                WHEN ${job.description !== undefined}::boolean THEN ${job.description ?? null}
                ELSE description
            END,
            "scheduledDate" = COALESCE(${job.scheduledDate ?? null}::date, "scheduledDate"),
            status = COALESCE(${job.status ?? null}::job_status, status),
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${id}
        AND "userId" = ${userId}
        AND "isDeleted" = false
        RETURNING id, "userId", "customerId", title, description, "scheduledDate"::text AS "scheduledDate", status, "createdAt", "updatedAt", "isDeleted", "deletedAt"
    `;
    return (rows[0] as unknown as Job) ?? null;
}

export async function deleteJob(userId: string, id: string): Promise<Job | null> {
    const rows = await sql`
        UPDATE jobs
        SET
            "isDeleted" = true,
            "deletedAt" = CURRENT_TIMESTAMP,
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${id}
        AND "userId" = ${userId}
        AND "isDeleted" = false
        AND status IN ('completed', 'cancelled')
        RETURNING id, "userId", "customerId", title, description, "scheduledDate"::text AS "scheduledDate", status, "createdAt", "updatedAt", "isDeleted", "deletedAt"
    `;

    if (rows.length > 0) {
        return rows[0] as unknown as Job;
    }

    const existing = await getJobById(userId, id);
    if (existing) {
        throw new ActiveJobDeleteError();
    }
    return null;
}
