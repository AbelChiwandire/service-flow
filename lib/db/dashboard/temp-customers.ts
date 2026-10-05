import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const ITEMS_PER_PAGE = 10;

export interface Customer {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    deletedAt: string | null;
}

export interface CustomerListParams {
    query?: string;
    page?: number;
    pageSize?: number;
    // 'leads' = customers with no scheduled or in-progress jobs
    filter?: 'leads';
}

// The single definition of "which customers match". Used by the list, the count and the page count.
function customerFilters(userId: string, params: CustomerListParams) {
    const { query = '', filter } = params;
    const searchTerm = `%${query}%`;

    return sql`
        customers."userId" = ${userId}
        AND customers."isDeleted" = false
        AND (
            customers.name ILIKE ${searchTerm}
            OR customers.email ILIKE ${searchTerm}
            OR customers.phone ILIKE ${searchTerm}
            OR customers.address ILIKE ${searchTerm}
        )
        ${
            filter === 'leads'
                ? sql`AND NOT EXISTS (
                    SELECT 1 FROM jobs
                    WHERE jobs."customerId" = customers.id
                    AND jobs."isDeleted" = false
                    AND jobs.status IN ('scheduled', 'in_progress')
                )`
                : sql``
        }
    `;
}

// Newest first, with id as a tiebreaker so pagination stays stable.
export async function getCustomers(
    userId: string,
    params: CustomerListParams = {}
): Promise<Customer[]> {
    const { page = 1, pageSize = ITEMS_PER_PAGE } = params;
    const offset = (Math.max(1, page) - 1) * pageSize;

    const rows = await sql`
        SELECT customers.*
        FROM customers
        WHERE ${customerFilters(userId, params)}
        ORDER BY customers."createdAt" DESC, customers.id DESC
        LIMIT ${pageSize} OFFSET ${offset}
    `;
    return rows as unknown as Customer[];
}

export async function countCustomers(
    userId: string,
    params: CustomerListParams = {}
): Promise<number> {
    const rows = await sql`
        SELECT COUNT(*)
        FROM customers
        WHERE ${customerFilters(userId, params)}
    `;
    return Number(rows[0].count);
}

export async function getCustomersTotalPages(
    userId: string,
    params: CustomerListParams = {}
): Promise<number> {
    const { pageSize = ITEMS_PER_PAGE } = params;
    return Math.ceil((await countCustomers(userId, params)) / pageSize);
}