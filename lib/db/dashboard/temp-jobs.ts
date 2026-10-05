import { neon } from '@neondatabase/serverless';
import { getToday } from './date-utils';

const sql = neon(process.env.DATABASE_URL!);

const ITEMS_PER_PAGE = 10;

export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type DueFilter = 'upcoming' | 'overdue';

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

// A job plus the name of the customer it belongs to (from the join).
export type JobWithCustomer = Job & { customerName: string };

export interface JobListParams {
    query?: string;
    page?: number;
    pageSize?: number;
    status?: JobStatus;
    due?: DueFilter;
    sort?: 'asc' | 'desc';
}

// "upcoming" and "overdue" both mean: still scheduled, split by today's date.
function dueFilter(due: DueFilter | undefined, today: string) {
    if (due === 'upcoming') {
        return sql`AND jobs.status = 'scheduled' AND jobs."scheduledDate" >= ${today}`;
    }
    if (due === 'overdue') {
        return sql`AND jobs.status = 'scheduled' AND jobs."scheduledDate" < ${today}`;
    }
    return sql``;
}

function jobsFrom() {
    return sql`FROM jobs JOIN customers ON customers.id = jobs."customerId"`;
}

// The single definition of "which jobs match". Used by the list, the count and the page count.
function jobFilters(userId: string, params: JobListParams, today: string) {
    const { query = '', status, due } = params;
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
function orderBy(sort: 'asc' | 'desc') {
    return sort === 'desc'
        ? sql`ORDER BY jobs."scheduledDate" DESC, jobs."createdAt" DESC, jobs.id DESC`
        : sql`ORDER BY jobs."scheduledDate" ASC, jobs."createdAt" ASC, jobs.id ASC`;
}

export async function getJobs(
    userId: string,
    params: JobListParams = {}
): Promise<JobWithCustomer[]> {
    const { page = 1, pageSize = ITEMS_PER_PAGE, sort = 'asc' } = params;
    const offset = (Math.max(1, page) - 1) * pageSize;

    const rows = await sql`
        SELECT jobs.*, customers.name AS "customerName"
        ${jobsFrom()}
        WHERE ${jobFilters(userId, params, getToday())}
        ${orderBy(sort)}
        LIMIT ${pageSize} OFFSET ${offset}
    `;
    return rows as unknown as JobWithCustomer[];
}

export async function countJobs(
    userId: string,
    params: JobListParams = {}
): Promise<number> {
    const rows = await sql`
        SELECT COUNT(*)
        ${jobsFrom()}
        WHERE ${jobFilters(userId, params, getToday())}
    `;
    return Number(rows[0].count);
}

export async function getJobsTotalPages(
    userId: string,
    params: JobListParams = {}
): Promise<number> {
    const { pageSize = ITEMS_PER_PAGE } = params;
    return Math.ceil((await countJobs(userId, params)) / pageSize);
}