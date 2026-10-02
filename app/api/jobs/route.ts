import { NextResponse } from 'next/server';
import { getJobs } from '@/lib/db/jobs/repository';
import { PLACEHOLDER_USER_ID } from '@/lib/auth/placeholder-session';
import { withApiErrorHandling } from '@/lib/db/jobs/api-helpers';

export async function GET() {
    return withApiErrorHandling('GET /api/jobs failed:', async () => {
        const jobs = await getJobs(PLACEHOLDER_USER_ID);
        return NextResponse.json({ data: jobs });
    });
}