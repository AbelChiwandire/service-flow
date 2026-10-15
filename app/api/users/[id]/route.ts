import { NextRequest, NextResponse } from "next/server";
import { UserProfileFormSchema, formatValidationErrors } from "@/lib/db/users/schema";
import { getUserById, updateUser, deleteUser } from "@/lib/db/users/repository";
import { authorizeSelf } from "@/lib/auth/session";
import { validateId, parseJsonBody, withApiErrorHandling } from "@/lib/db/users/api-helpers";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const authError = await authorizeSelf(id);
    if (authError) return authError;

    const idError = validateId(id);
    if (idError) return idError;

    return withApiErrorHandling("GET /api/users/[id] failed:", async () => {
        const user = await getUserById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }
        return NextResponse.json({ data: user });
    });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const authError = await authorizeSelf(id);
    if (authError) return authError;

    const idError = validateId(id);
    if (idError) return idError;

    const bodyResult = await parseJsonBody(request);
    if (!bodyResult.ok) return bodyResult.response;

    const validatedData = UserProfileFormSchema.partial().safeParse(bodyResult.body);
    if (!validatedData.success) {
        return NextResponse.json(
            {
                error: "Missing or invalid fields.",
                details: formatValidationErrors(validatedData.error),
            },
            { status: 400 },
        );
    }

    return withApiErrorHandling("PATCH /api/users/[id] failed:", async () => {
        const user = await updateUser(id, validatedData.data);
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }
        return NextResponse.json({ data: user });
    });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const authError = await authorizeSelf(id);
    if (authError) return authError;

    const idError = validateId(id);
    if (idError) return idError;

    return withApiErrorHandling("DELETE /api/users/[id] failed:", async () => {
        const user = await deleteUser(id);
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }
        return NextResponse.json({ data: user });
    });
}
