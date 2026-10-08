import { NextRequest, NextResponse } from 'next/server';
import { CustomerFormSchema, formatValidationErrors } from '@/lib/db/customer/schema';
import { getCustomers, createCustomer } from '@/lib/db/customer/repository';
import { getSessionUserId, unauthorizedResponse } from '@/lib/auth/session';
import { parseJsonBody, withApiErrorHandling } from '@/lib/db/customer/api-helpers';

export async function GET() {
    const userId = await getSessionUserId();
    if (!userId) return unauthorizedResponse();
    return withApiErrorHandling('GET /api/customers failed:', async () => {
        const customers = await getCustomers(userId);
        return NextResponse.json({ data: customers });
    });
}

export async function POST(request: NextRequest) {
    const userId = await getSessionUserId();
    if (!userId) return unauthorizedResponse();
    const bodyResult = await parseJsonBody(request);
    if (!bodyResult.ok) return bodyResult.response;

    const validatedData = CustomerFormSchema.safeParse(bodyResult.body);
    if (!validatedData.success) {
        return NextResponse.json(
            {
                error: 'Missing or invalid fields.',
                details: formatValidationErrors(validatedData.error),
            },
            { status: 400 }
        );
    }

    return withApiErrorHandling('POST /api/customers failed:', async () => {
        const customer = await createCustomer({
            userId,
            ...validatedData.data,
        });
        return NextResponse.json({ data: customer }, { status: 201 });
    });
}