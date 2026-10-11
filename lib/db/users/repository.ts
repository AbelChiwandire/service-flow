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

export class EmailAlreadyExistsError extends Error {
    constructor() {
        super("An account with this email already exists.");
        this.name = "EmailAlreadyExistsError";
    }
}

export async function getUserByEmail(
    email: string,
): Promise<User | null> {
    const rows = await sql`
        SELECT *
        FROM users
        WHERE email = ${email}
    `;

    return (rows[0] as unknown as User) ?? null;
}

export async function createUser(
    user: NewUser,
): Promise<PublicUser> {
    try {
        const rows = await sql`
            INSERT INTO users (
                name,
                "businessName",
                email,
                "passwordHash"
            )
            VALUES (
                ${user.name},
                ${user.businessName},
                ${user.email},
                ${user.passwordHash}
            )
            RETURNING
                id,
                name,
                "businessName",
                email,
                "createdAt",
                "updatedAt"
        `;

        return rows[0] as unknown as PublicUser;
    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code?: string }).code === "23505"
        ) {
            throw new EmailAlreadyExistsError();
        }

        throw error;
    }
}