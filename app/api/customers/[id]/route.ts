import { NextRequest, NextResponse } from 'next/server';
import { CustomerFormSchema, formatValidationErrors } from '@/lib/db/customer/schema';
import {
    getCustomerById,
    updateCustomer,
    deleteCustomer
} from '@/lib/db/customer/repository';
import { PLACEHOLDER_USER_ID } from '@/lib/auth/placeholder-session';
import {
    validateId,
    parseJsonBody,
    withApiErrorHandling
} from '@/lib/db/customer/api-helpers';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const idError = validateId(id);
    if (idError) return idError;

    return withApiErrorHandling('GET /api/customers/[id] failed:', async () => {
        const customer = await getCustomerById(PLACEHOLDER_USER_ID, id);
        if (!customer) {
            return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
        }
        return NextResponse.json({ data: customer });
    });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const idError = validateId(id);
    if (idError) return idError;

    const bodyResult = await parseJsonBody(request);
    if (!bodyResult.ok) return bodyResult.response;

    const validatedData = CustomerFormSchema.partial().safeParse(bodyResult.body);
    if (!validatedData.success) {
        return NextResponse.json(
            {
                error: 'Missing or invalid fields.',
                details: formatValidationErrors(validatedData.error),
            },
            { status: 400 }
        );
    }

    return withApiErrorHandling('PATCH /api/customers/[id] failed:', async () => {
        const customer = await updateCustomer(PLACEHOLDER_USER_ID, id, validatedData.data);
        if (!customer) {
            return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
        }
        return NextResponse.json({ data: customer });
    });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const idError = validateId(id);
    if (idError) return idError;

    return withApiErrorHandling('DELETE /api/customers/[id] failed:', async () => {
        const customer = await deleteCustomer(PLACEHOLDER_USER_ID, id);
        if (!customer) {
            return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
        }
        return NextResponse.json({ data: customer });
    });
}