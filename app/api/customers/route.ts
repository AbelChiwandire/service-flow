import { NextRequest, NextResponse } from "next/server";
import { CustomerFormSchema, formatValidationErrors } from "@/lib/db/customer/schema";
import { getCustomers, createCustomer } from "@/lib/db/customer/repository";
import { parseCustomerFilter, parsePage, parseQuery } from "@/lib/db/dashboard/search-params";
import { getSessionUserId, unauthorizedResponse } from "@/lib/auth/session";
import { parseJsonBody, withApiErrorHandling } from "@/lib/db/customer/api-helpers";

// GET /api/customers -> the user's customers. Supports query, filter (leads) and page.
export async function GET(request: NextRequest) {
    const userId = await getSessionUserId();
    if (!userId) return unauthorizedResponse();
    return withApiErrorHandling("GET /api/customers failed:", async () => {
        const searchParams = request.nextUrl.searchParams;
        const customers = await getCustomers(userId, {
            query: parseQuery(searchParams.get("query") ?? undefined).slice(0, 100) || undefined,
            filter: parseCustomerFilter(searchParams.get("filter") ?? undefined),
            page: parsePage(searchParams.get("page") ?? undefined),
        });
        return NextResponse.json({ data: customers });
    });
}

export async function POST(request: NextRequest) {
    const userId = await getSessionUserId();
    if (!userId) return unauthorizedResponse();
    const bodyResult = await parseJsonBody(request);
    if (!bodyResult.ok) return bodyResult.response;

    const validatedData = CustomerFormSchema.safeParse(bodyResult.body);
    if (!validatedData.success) {
        return NextResponse.json(
            {
                error: "Missing or invalid fields.",
                details: formatValidationErrors(validatedData.error),
            },
            { status: 400 },
        );
    }

    return withApiErrorHandling("POST /api/customers failed:", async () => {
        const customer = await createCustomer({
            userId,
            ...validatedData.data,
        });
        return NextResponse.json({ data: customer }, { status: 201 });
    });
}
