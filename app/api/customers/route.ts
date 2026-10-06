import { NextRequest, NextResponse } from 'next/server';
import { CustomerFormSchema, formatValidationErrors } from '@/lib/db/customer/schema';
import { getCustomers, createCustomer } from '@/lib/db/customer/repository';
import { PLACEHOLDER_USER_ID } from '@/lib/auth/placeholder-session';
import { parseJsonBody, withApiErrorHandling } from '@/lib/db/customer/api-helpers';

export async function GET() {
    return withApiErrorHandling('GET /api/customers failed:', async () => {
        const customers = await getCustomers(PLACEHOLDER_USER_ID);
        return NextResponse.json({ data: customers });
    });
}

export async function POST(request: NextRequest) {
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
            userId: PLACEHOLDER_USER_ID,
            ...validatedData.data,
        });
        return NextResponse.json({ data: customer }, { status: 201 });
    });
}