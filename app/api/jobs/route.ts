import { NextRequest, NextResponse } from 'next/server';
import { JobFormSchema, IdSchema, formatValidationErrors } from '@/lib/db/jobs/schema';
import {
    getJobs,
    getJobsByCustomer,
    getJobCustomer,
    createJob,
} from '@/lib/db/jobs/repository';
import { PLACEHOLDER_USER_ID } from '@/lib/auth/placeholder-session';
import { validateId, parseJsonBody, withApiErrorHandling } from '@/lib/db/jobs/api-helpers';

// GET /api/jobs                    -> all of the user's jobs
// GET /api/jobs?customerId=<uuid>  -> only that customer's jobs
export async function GET(request: NextRequest) {
    const customerId = request.nextUrl.searchParams.get('customerId');

    if (customerId !== null) {
        const idError = validateId(customerId);
        if (idError) return idError;
    }

    return withApiErrorHandling('GET /api/jobs failed:', async () => {
        if (customerId !== null) {
            const customer = await getJobCustomer(PLACEHOLDER_USER_ID, customerId);
            if (!customer) {
                return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
            }

            const jobs = await getJobsByCustomer(PLACEHOLDER_USER_ID, customerId);
            return NextResponse.json({ data: jobs });
        }

        const jobs = await getJobs(PLACEHOLDER_USER_ID);
        return NextResponse.json({ data: jobs });
    });
}

// POST /api/jobs: the customer is part of the body ({ customerId, title, ... }).
export async function POST(request: NextRequest) {
    const bodyResult = await parseJsonBody(request);
    if (!bodyResult.ok) return bodyResult.response;

    const validatedData = JobFormSchema.safeParse(bodyResult.body);
    const customerIdResult = IdSchema.safeParse(
        (bodyResult.body as { customerId?: unknown }).customerId
    );

    if (!validatedData.success || !customerIdResult.success) {
        return NextResponse.json(
            {
                error: 'Missing or invalid fields.',
                details: {
                    ...(validatedData.success ? {} : formatValidationErrors(validatedData.error)),
                    ...(customerIdResult.success
                        ? {}
                        : { customerId: ['A valid customer id is required.'] }),
                },
            },
            { status: 400 }
        );
    }

    return withApiErrorHandling('POST /api/jobs failed:', async () => {
        const job = await createJob({
            userId: PLACEHOLDER_USER_ID,
            customerId: customerIdResult.data,
            ...validatedData.data,
        });
        return NextResponse.json({ data: job }, { status: 201 });
    });
}