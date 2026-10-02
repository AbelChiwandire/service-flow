import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Job {
    id: string;
    userId: string;
    customerId: string;
    title: string;
    description: string | null;
    scheduledDate: Date;
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
        SELECT *
        FROM jobs
        WHERE "userId" = ${userId}
        AND "isDeleted" = false
    `;
    return rows as unknown as Job[];
}

export async function getJobsByCustomer(userId: string, customerId: string): Promise<Job[]> {
    const rows = await sql`
        SELECT *
        FROM jobs
        WHERE "userId" = ${userId}
        AND "customerId" = ${customerId}
        AND "isDeleted" = false
    `;
    return rows as unknown as Job[];
}

export async function getJobById(userId: string, id: string): Promise<Job | null> {
    const rows = await sql`
        SELECT *
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
        RETURNING *
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
        RETURNING *
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
        RETURNING *
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