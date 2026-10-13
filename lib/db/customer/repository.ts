import { neon } from "@neondatabase/serverless";

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

export class CustomerHasActiveJobsError extends Error {
    constructor() {
        super("Cannot delete customer with active jobs");
        this.name = "CustomerHasActiveJobsError";
    }
}

export interface CustomerListParams {
    query?: string;
    page?: number;
    pageSize?: number;
    // 'leads' = customers with no scheduled or in-progress jobs
    filter?: "leads";
}

// The single definition of "which customers match". Used by the list, the count and the page count.
function customerFilters(userId: string, params: CustomerListParams) {
    const { query = "", filter } = params;
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
            filter === "leads"
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
    params: CustomerListParams = {},
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
    params: CustomerListParams = {},
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
    params: CustomerListParams = {},
): Promise<number> {
    const { pageSize = ITEMS_PER_PAGE } = params;
    return Math.ceil((await countCustomers(userId, params)) / pageSize);
}

export async function getCustomerById(userId: string, id: string): Promise<Customer | null> {
    const rows = await sql`
        SELECT *
        FROM customers
        WHERE id = ${id}
        AND "userId" = ${userId}
        AND "isDeleted" = false
    `;
    return (rows[0] as unknown as Customer) ?? null;
}

export async function createCustomer(
    customer: Omit<Customer, "id" | "createdAt" | "updatedAt" | "isDeleted" | "deletedAt">,
): Promise<Customer> {
    const rows = await sql`
        INSERT INTO customers ("userId", name, email, phone, address)
        VALUES (${customer.userId}, ${customer.name}, ${customer.email}, ${customer.phone}, ${customer.address})
        RETURNING *
    `;
    return rows[0] as unknown as Customer;
}

export async function updateCustomer(
    userId: string,
    id: string,
    customer: Partial<
        Omit<Customer, "id" | "userId" | "createdAt" | "updatedAt" | "isDeleted" | "deletedAt">
    >,
): Promise<Customer | null> {
    const rows = await sql`
        UPDATE customers
        SET
            name = COALESCE(${customer.name}, name),
            email = COALESCE(${customer.email}, email),
            phone = COALESCE(${customer.phone}, phone),
            address = COALESCE(${customer.address}, address),
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${id}
        AND "userId" = ${userId}
        AND "isDeleted" = false
        RETURNING *
    `;
    return (rows[0] as unknown as Customer) ?? null;
}

export async function deleteCustomer(userId: string, id: string): Promise<Customer | null> {
    const activeJobs = await sql`
        SELECT COUNT(*) AS job_count
        FROM jobs
        WHERE "customerId" = ${id}
        AND "userId" = ${userId}
        AND status IN ('scheduled', 'in_progress')
    `;

    if (parseInt(activeJobs[0].job_count) > 0) {
        throw new CustomerHasActiveJobsError();
    }

    const rows = await sql`
        UPDATE customers
        SET
            "isDeleted" = true,
            "deletedAt" = CURRENT_TIMESTAMP,
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${id}
        AND "userId" = ${userId}
        AND "isDeleted" = false
        RETURNING *
    `;
    return (rows[0] as unknown as Customer) ?? null;
}
