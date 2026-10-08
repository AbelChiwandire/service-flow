// PLACEHOLDER: This repository is already implemented in the users branch.

import { neon } from '@neondatabase/serverless';

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

export async function getUserByEmail(email: string): Promise<User | null> {
  const rows = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return (rows[0] as unknown as User) ?? null;
}