import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { SignupFormSchema, formatValidationErrors } from '@/lib/db/users/schema';
import { createUser } from '@/lib/db/users/repository';
import { parseJsonBody, withApiErrorHandling } from '@/lib/db/users/api-helpers';

const SALT_ROUNDS = 10;

export async function POST(request: NextRequest) {
    const bodyResult = await parseJsonBody(request);
    if (!bodyResult.ok) return bodyResult.response;

    const validatedData = SignupFormSchema.safeParse(bodyResult.body);
    if (!validatedData.success) {
        return NextResponse.json(
            {
                error: 'Missing or invalid fields.',
                details: formatValidationErrors(validatedData.error),
            },
            { status: 400 }
        );
    }

    const { name, businessName, email, password } = validatedData.data;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    return withApiErrorHandling('POST /api/users failed:', async () => {
        const user = await createUser({ name, businessName, email, passwordHash });
        return NextResponse.json({ data: user }, { status: 201 });
    });
}