import { NextResponse } from "next/server";
import { handleApiErrors, validateId as validateUuid } from "@/lib/api-helpers";
import { EmailAlreadyExistsError } from "./repository";

export { parseJsonBody } from "@/lib/api-helpers";

export function validateId(id: string): NextResponse | null {
    return validateUuid(id, "Invalid user id.");
}

export function withApiErrorHandling(
    logLabel: string,
    handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
    return handleApiErrors(logLabel, handler, (error) =>
        error instanceof EmailAlreadyExistsError ? 409 : null,
    );
}
