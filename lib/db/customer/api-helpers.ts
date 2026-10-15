import { NextResponse } from "next/server";
import { handleApiErrors, validateId as validateUuid } from "@/lib/api-helpers";
import { CustomerHasActiveJobsError } from "./repository";

export { parseJsonBody } from "@/lib/api-helpers";

export function validateId(id: string): NextResponse | null {
    return validateUuid(id, "Invalid customer id.");
}

export function withApiErrorHandling(
    logLabel: string,
    handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
    return handleApiErrors(logLabel, handler, (error) =>
        error instanceof CustomerHasActiveJobsError ? 409 : null,
    );
}
