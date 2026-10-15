import { NextResponse } from "next/server";
import { handleApiErrors, validateId as validateUuid } from "@/lib/api-helpers";
import { JobCustomerNotFoundError, ActiveJobDeleteError } from "./repository";

export { parseJsonBody } from "@/lib/api-helpers";

export function validateId(id: string): NextResponse | null {
    return validateUuid(id, "Invalid id.");
}

export function withApiErrorHandling(
    logLabel: string,
    handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
    return handleApiErrors(logLabel, handler, (error) => {
        if (error instanceof JobCustomerNotFoundError) return 404;
        if (error instanceof ActiveJobDeleteError) return 409;
        return null;
    });
}
