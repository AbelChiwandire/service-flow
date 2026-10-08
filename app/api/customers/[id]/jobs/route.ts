import { NextRequest, NextResponse } from 'next/server';
import { JobFormSchema, formatValidationErrors } from '@/lib/db/jobs/schema';
import { getJobsByCustomer, getJobCustomer, createJob } from '@/lib/db/jobs/repository';
import { PLACEHOLDER_USER_ID } from '@/lib/auth/placeholder-session';
import { validateId, parseJsonBody, withApiErrorHandling } from '@/lib/db/jobs/api-helpers';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
    const { id: customerId } = await params;
    const idError = validateId(customerId);
    if (idError) return idError;

    return withApiErrorHandling('GET /api/customers/[id]/jobs failed:', async () => {
        const customer = await getJobCustomer(PLACEHOLDER_USER_ID, customerId);
        if (!customer) {
            return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
        }
        const jobs = await getJobsByCustomer(PLACEHOLDER_USER_ID, customerId);
        return NextResponse.json({ data: jobs });
    });
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    const { id: customerId } = await params;
    const idError = validateId(customerId);
    if (idError) return idError;

    const bodyResult = await parseJsonBody(request);
    if (!bodyResult.ok) return bodyResult.response;

    const validatedData = JobFormSchema.safeParse(bodyResult.body);
    if (!validatedData.success) {
        return NextResponse.json(
            {
                error: 'Missing or invalid fields.',
                details: formatValidationErrors(validatedData.error),
            },
            { status: 400 }
        );
    }

    return withApiErrorHandling('POST /api/customers/[id]/jobs failed:', async () => {
        const job = await createJob({
            userId: PLACEHOLDER_USER_ID,
            customerId,
            ...validatedData.data,
        });
        return NextResponse.json({ data: job }, { status: 201 });
    });
}