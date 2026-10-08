import { NextResponse } from 'next/server';
import { getJobs } from '@/lib/db/jobs/repository';
import { getSessionUserId, unauthorizedResponse } from '@/lib/auth/session';
import { withApiErrorHandling } from '@/lib/db/jobs/api-helpers';

export async function GET() {
    const userId = await getSessionUserId();
    if (!userId) return unauthorizedResponse();
    return withApiErrorHandling('GET /api/jobs failed:', async () => {
        const jobs = await getJobs(userId);
        return NextResponse.json({ data: jobs });
    });
}