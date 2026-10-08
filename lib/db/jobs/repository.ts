import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

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

export type JobUpdate = Partial<Pick<Job, 'title' | 'description' | 'status'>> & {
    scheduledDate?: string;
};

export class JobCustomerNotFoundError extends Error {
    constructor() {
        super('Customer not found.');
        this.name = 'JobCustomerNotFoundError';
    }
}

export class ActiveJobDeleteError extends Error {
    constructor() {
        super('Cannot delete a scheduled or in-progress job. Cancel it first.');
        this.name = 'ActiveJobDeleteError';
    }
}

export async function getJobs(userId: string): Promise<Job[]> {
    const rows = await sql`
        SELECT id, "userId", "customerId", title, description, "scheduledDate"::text AS "scheduledDate", status, "createdAt", "updatedAt", "isDeleted", "deletedAt"
        FROM jobs
        WHERE "userId" = ${userId}
        AND "isDeleted" = false
    `;
    return rows as unknown as Job[];
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

export async function updateJob(
    userId: string,
    id: string,
    job: JobUpdate
): Promise<Job | null> {
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

// TEMPORARY stand-in for the customer branch's getCustomerById.
// Reads only what the jobs pages need (404 check + heading).
// Remove or replace once the customer branch is merged.
export interface JobCustomer {
    id: string;
    name: string;
}

export async function getJobCustomer(
    userId: string,
    customerId: string
): Promise<JobCustomer | null> {
    const rows = await sql`
        SELECT id, name
        FROM customers
        WHERE id = ${customerId}
        AND "userId" = ${userId}
        AND "isDeleted" = false
    `;
    return (rows[0] as unknown as JobCustomer) ?? null;
}

export const JOBS_PER_PAGE = 10;
 
export interface JobListItem {
    id: string;
    customerId: string;
    customerName: string;
    title: string;
    scheduledDate: string;
    status: JobStatus;
}
 
export interface JobListFilters {
    query?: string;
    status?: JobStatus;
    page: number;
}
 
export interface JobListResult {
    jobs: JobListItem[];
    totalCount: number;
}
 
// Escape LIKE wildcards so a search for "50%" matches literally.
function escapeLike(value: string): string {
    return value.replace(/[\\%_]/g, '\\$&');
}
 
export async function getFilteredJobs(
    userId: string,
    { query, status, page }: JobListFilters
): Promise<JobListResult> {
    const search = query ? `%${escapeLike(query)}%` : null;
    const statusFilter = status ?? null;
    const offset = (page - 1) * JOBS_PER_PAGE;
 
    const [rows, countRows] = await Promise.all([
        sql`
            SELECT
                j.id,
                j."customerId",
                c.name AS "customerName",
                j.title,
                j."scheduledDate"::text AS "scheduledDate",
                j.status
            FROM jobs j
            JOIN customers c ON c.id = j."customerId"
            WHERE j."userId" = ${userId}
            AND j."isDeleted" = false
            AND (${search}::text IS NULL OR j.title ILIKE ${search} OR c.name ILIKE ${search})
            AND (${statusFilter}::job_status IS NULL OR j.status = ${statusFilter}::job_status)
            ORDER BY j."scheduledDate" DESC, j."createdAt" DESC
            LIMIT ${JOBS_PER_PAGE} OFFSET ${offset}
        `,
        sql`
            SELECT COUNT(*)::int AS count
            FROM jobs j
            JOIN customers c ON c.id = j."customerId"
            WHERE j."userId" = ${userId}
            AND j."isDeleted" = false
            AND (${search}::text IS NULL OR j.title ILIKE ${search} OR c.name ILIKE ${search})
            AND (${statusFilter}::job_status IS NULL OR j.status = ${statusFilter}::job_status)
        `,
    ]);
 
    return {
        jobs: rows as unknown as JobListItem[],
        totalCount: (countRows[0] as { count: number }).count,
    };
}