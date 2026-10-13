import { NextRequest, NextResponse } from "next/server";
import { JobFormSchema, formatValidationErrors } from "@/lib/db/jobs/schema";
import { getJobById, updateJob, deleteJob } from "@/lib/db/jobs/repository";
import { getSessionUserId, unauthorizedResponse } from "@/lib/auth/session";
import { validateId, parseJsonBody, withApiErrorHandling } from "@/lib/db/jobs/api-helpers";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
    const userId = await getSessionUserId();
    if (!userId) return unauthorizedResponse();
    const { id } = await params;
    const idError = validateId(id);
    if (idError) return idError;

    return withApiErrorHandling("GET /api/jobs/[id] failed:", async () => {
        const job = await getJobById(userId, id);
        if (!job) {
            return NextResponse.json({ error: "Job not found." }, { status: 404 });
        }
        return NextResponse.json({ data: job });
    });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    const userId = await getSessionUserId();
    if (!userId) return unauthorizedResponse();
    const { id } = await params;
    const idError = validateId(id);
    if (idError) return idError;

    const bodyResult = await parseJsonBody(request);
    if (!bodyResult.ok) return bodyResult.response;

    const validatedData = JobFormSchema.partial().safeParse(bodyResult.body);
    if (!validatedData.success) {
        return NextResponse.json(
            {
                error: "Missing or invalid fields.",
                details: formatValidationErrors(validatedData.error),
            },
            { status: 400 },
        );
    }

    return withApiErrorHandling("PATCH /api/jobs/[id] failed:", async () => {
        const job = await updateJob(userId, id, validatedData.data);
        if (!job) {
            return NextResponse.json({ error: "Job not found." }, { status: 404 });
        }
        return NextResponse.json({ data: job });
    });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const userId = await getSessionUserId();
    if (!userId) return unauthorizedResponse();
    const { id } = await params;
    const idError = validateId(id);
    if (idError) return idError;

    return withApiErrorHandling("DELETE /api/jobs/[id] failed:", async () => {
        const job = await deleteJob(userId, id);
        if (!job) {
            return NextResponse.json({ error: "Job not found." }, { status: 404 });
        }
        return NextResponse.json({ data: job });
    });
}
