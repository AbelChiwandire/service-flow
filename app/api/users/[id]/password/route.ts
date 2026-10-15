import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PasswordChangeFormSchema, formatPasswordChangeErrors } from "@/lib/db/users/schema";
import { getUserAuthById, updatePassword } from "@/lib/db/users/repository";
import { authorizeSelf } from "@/lib/auth/session";
import { validateId, parseJsonBody, withApiErrorHandling } from "@/lib/db/users/api-helpers";

const SALT_ROUNDS = 10;

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const authError = await authorizeSelf(id);
    if (authError) return authError;

    const idError = validateId(id);
    if (idError) return idError;

    const bodyResult = await parseJsonBody(request);
    if (!bodyResult.ok) return bodyResult.response;

    const validatedData = PasswordChangeFormSchema.safeParse(bodyResult.body);
    if (!validatedData.success) {
        return NextResponse.json(
            {
                error: "Missing or invalid fields.",
                details: formatPasswordChangeErrors(validatedData.error),
            },
            { status: 400 },
        );
    }

    return withApiErrorHandling("PATCH /api/users/[id]/password failed:", async () => {
        const user = await getUserAuthById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        const currentPasswordMatches = await bcrypt.compare(
            validatedData.data.currentPassword,
            user.passwordHash,
        );
        if (!currentPasswordMatches) {
            return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
        }

        const newPasswordHash = await bcrypt.hash(validatedData.data.newPassword, SALT_ROUNDS);
        await updatePassword(id, newPasswordHash);

        return NextResponse.json({ data: { message: "Password updated." } });
    });
}
