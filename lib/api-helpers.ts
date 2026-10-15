import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const IdSchema = z.uuid();

export function validateId(id: string, message: string): NextResponse | null {
    if (!IdSchema.safeParse(id).success) {
        return NextResponse.json({ error: message }, { status: 400 });
    }
    return null;
}

type JsonBodyResult = { ok: true; body: unknown } | { ok: false; response: NextResponse };

export async function parseJsonBody(request: NextRequest): Promise<JsonBodyResult> {
    const body = await request.json().catch(() => null);
    if (body === null) {
        return {
            ok: false,
            response: NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }),
        };
    }
    return { ok: true, body };
}

// Maps an expected domain error to an HTTP status; anything else is logged and returned as a 500.
export async function handleApiErrors(
    logLabel: string,
    handler: () => Promise<NextResponse>,
    statusFor: (error: unknown) => number | null,
): Promise<NextResponse> {
    try {
        return await handler();
    } catch (error) {
        const status = statusFor(error);
        if (status !== null) {
            return NextResponse.json({ error: (error as Error).message }, { status });
        }
        console.error(logLabel, error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
