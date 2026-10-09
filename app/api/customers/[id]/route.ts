import { NextRequest, NextResponse } from "next/server";
import { CustomerFormSchema, formatValidationErrors } from "@/lib/db/customer/schema";
import { getCustomerById, updateCustomer, deleteCustomer } from "@/lib/db/customer/repository";
import { getSessionUserId, unauthorizedResponse } from "@/lib/auth/session";
import { validateId, parseJsonBody, withApiErrorHandling } from "@/lib/db/customer/api-helpers";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
    const userId = await getSessionUserId();
    if (!userId) return unauthorizedResponse();
    const { id } = await params;
    const idError = validateId(id);
    if (idError) return idError;

    return withApiErrorHandling("GET /api/customers/[id] failed:", async () => {
        const customer = await getCustomerById(userId, id);
        if (!customer) {
            return NextResponse.json({ error: "Customer not found." }, { status: 404 });
        }
        return NextResponse.json({ data: customer });
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

    const validatedData = CustomerFormSchema.partial().safeParse(bodyResult.body);
    if (!validatedData.success) {
        return NextResponse.json(
            {
                error: "Missing or invalid fields.",
                details: formatValidationErrors(validatedData.error),
            },
            { status: 400 },
        );
    }

    return withApiErrorHandling("PATCH /api/customers/[id] failed:", async () => {
        const customer = await updateCustomer(userId, id, validatedData.data);
        if (!customer) {
            return NextResponse.json({ error: "Customer not found." }, { status: 404 });
        }
        return NextResponse.json({ data: customer });
    });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const userId = await getSessionUserId();
    if (!userId) return unauthorizedResponse();
    const { id } = await params;
    const idError = validateId(id);
    if (idError) return idError;

    return withApiErrorHandling("DELETE /api/customers/[id] failed:", async () => {
        const customer = await deleteCustomer(userId, id);
        if (!customer) {
            return NextResponse.json({ error: "Customer not found." }, { status: 404 });
        }
        return NextResponse.json({ data: customer });
    });
}
