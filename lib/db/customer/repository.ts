import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

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
        super('Cannot delete customer with active jobs');
        this.name = 'CustomerHasActiveJobsError';
    }
}

export async function getCustomers(userId: string): Promise<Customer[]> {
    const rows = await sql`
        SELECT *
        FROM customers
        WHERE "userId" = ${userId}
        AND "isDeleted" = false
    `;
    return rows as unknown as Customer[];
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
    customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'>
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
    customer: Partial<Omit<Customer, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'>>
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