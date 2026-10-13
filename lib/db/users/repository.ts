import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export interface User {
    id: string;
    name: string;
    businessName: string;
    email: string;
    passwordHash: string;
    createdAt: string;
    updatedAt: string;
}

export type PublicUser = Omit<User, "passwordHash">;

export interface NewUser {
    name: string;
    businessName: string;
    email: string;
    passwordHash: string;
}

export type UserUpdate = Partial<Pick<User, "name" | "businessName" | "email">>;

export class EmailAlreadyExistsError extends Error {
    constructor() {
        super("An account with this email already exists.");
        this.name = "EmailAlreadyExistsError";
    }
}

const PUBLIC_USER_COLUMNS = sql`id, name, "businessName", email, "createdAt", "updatedAt"`;

export async function getUserById(id: string): Promise<PublicUser | null> {
    const rows = await sql`
        SELECT ${PUBLIC_USER_COLUMNS}
        FROM users
        WHERE id = ${id}
    `;
    return (rows[0] as unknown as PublicUser) ?? null;
}

// Internal use only (password verification) — the only other function
// that returns passwordHash, alongside getUserByEmail
export async function getUserAuthById(id: string): Promise<User | null> {
    const rows = await sql`
        SELECT *
        FROM users
        WHERE id = ${id}
    `;
    return (rows[0] as unknown as User) ?? null;
}

// Internal use only (auth/login) — the only function that returns passwordHash
export async function getUserByEmail(email: string): Promise<User | null> {
    const rows = await sql`
        SELECT *
        FROM users
        WHERE email = ${email}
    `;
    return (rows[0] as unknown as User) ?? null;
}

export async function createUser(user: NewUser): Promise<PublicUser> {
    try {
        const rows = await sql`
            INSERT INTO users (name, "businessName", email, "passwordHash")
            VALUES (${user.name}, ${user.businessName}, ${user.email}, ${user.passwordHash})
            RETURNING ${PUBLIC_USER_COLUMNS}
        `;
        return rows[0] as unknown as PublicUser;
    } catch (error) {
        if (isUniqueViolation(error, "users_email_key")) {
            throw new EmailAlreadyExistsError();
        }
        throw error;
    }
}

export async function updateUser(id: string, user: UserUpdate): Promise<PublicUser | null> {
    try {
        const rows = await sql`
            UPDATE users
            SET
                name = COALESCE(${user.name ?? null}, name),
                "businessName" = COALESCE(${user.businessName ?? null}, "businessName"),
                email = COALESCE(${user.email ?? null}, email),
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING ${PUBLIC_USER_COLUMNS}
        `;
        return (rows[0] as unknown as PublicUser) ?? null;
    } catch (error) {
        if (isUniqueViolation(error, "users_email_key")) {
            throw new EmailAlreadyExistsError();
        }
        throw error;
    }
}

export async function updatePassword(id: string, passwordHash: string): Promise<PublicUser | null> {
    const rows = await sql`
        UPDATE users
        SET
            "passwordHash" = ${passwordHash},
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING ${PUBLIC_USER_COLUMNS}
    `;
    return (rows[0] as unknown as PublicUser) ?? null;
}

export async function deleteUser(id: string): Promise<PublicUser | null> {
    const rows = await sql`
        DELETE FROM users
        WHERE id = ${id}
        RETURNING ${PUBLIC_USER_COLUMNS}
    `;
    return (rows[0] as unknown as PublicUser) ?? null;
}

function isUniqueViolation(error: unknown, constraintHint: string): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "23505" &&
        "constraint" in error &&
        typeof (error as { constraint?: string }).constraint === "string" &&
        (error as { constraint: string }).constraint.includes(constraintHint)
    );
}
