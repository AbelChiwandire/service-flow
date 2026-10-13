import { NextRequest, NextResponse } from 'next/server';
import {
    parseDue,
    parsePage,
    parseQuery,
    parseSort,
    parseStatus,
} from '@/lib/db/dashboard/search-params';
import { JobFormSchema, IdSchema, formatValidationErrors } from '@/lib/db/jobs/schema';
import {
    getJobs,
    getJobsByCustomer,
    type JobListParams,
    createJob,
} from '@/lib/db/jobs/repository';
import { getCustomerById } from '@/lib/db/customer/repository';
import { validateId, parseJsonBody, withApiErrorHandling } from '@/lib/db/jobs/api-helpers';
import { requireUserId } from '@/lib/auth/session';

// GET /api/jobs                    -> the user's jobs (supports query, status, due, sort, page)
// GET /api/jobs?customerId=<uuid>  -> only that customer's jobs
export async function GET(request: NextRequest) {
    const customerId = request.nextUrl.searchParams.get('customerId');

    if (customerId !== null) {
        const idError = validateId(customerId);
        if (idError) return idError;
    }

    return withApiErrorHandling('GET /api/jobs failed:', async () => {
        const userId = await requireUserId();
        if (customerId !== null) {
            const customer = await getCustomerById(userId, customerId);
            if (!customer) {
                return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
            }

            const jobs = await getJobsByCustomer(userId, customerId);
            return NextResponse.json({ data: jobs });
        }

        const searchParams = request.nextUrl.searchParams;
        const params: JobListParams = {
            query: parseQuery(searchParams.get('query') ?? undefined).slice(0, 100) || undefined,
            page: parsePage(searchParams.get('page') ?? undefined),
            status: parseStatus(searchParams.get('status') ?? undefined),
            due: parseDue(searchParams.get('due') ?? undefined),
            sort: parseSort(searchParams.get('sort') ?? undefined),
        };
        const jobs = await getJobs(userId, params);
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
        const userId = await requireUserId();
        const job = await createJob({
            userId: userId,
            customerId: customerIdResult.data,
            ...validatedData.data,
        });
        return NextResponse.json({ data: job }, { status: 201 });
    });
}
