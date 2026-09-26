import { NextRequest, NextResponse } from 'next/server';
import { IdSchema } from './schema';
import { CustomerHasActiveJobsError } from './repository';

export function validateId(id: string): NextResponse | null {
    if (!IdSchema.safeParse(id).success) {
        return NextResponse.json({ error: 'Invalid customer id.' }, { status: 400 });
    }
    return null;
}

type JsonBodyResult =
    | { ok: true; body: unknown }
    | { ok: false; response: NextResponse };

export async function parseJsonBody(request: NextRequest): Promise<JsonBodyResult> {
    const body = await request.json().catch(() => null);
    if (body === null) {
        return {
            ok: false,
            response: NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 }),
        };
    }
    return { ok: true, body };
}

export async function withApiErrorHandling(
    logLabel: string,
    handler: () => Promise<NextResponse>
): Promise<NextResponse> {
    try {
        return await handler();
    } catch (error) {
        if (error instanceof CustomerHasActiveJobsError) {
            return NextResponse.json({ error: error.message }, { status: 409 });
        }
        console.error(logLabel, error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}