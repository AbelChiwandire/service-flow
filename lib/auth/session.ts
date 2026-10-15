import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function getSessionUserId(): Promise<string | null> {
    const session = await auth();
    return session?.user?.id ?? null;
}

// For pages and server components: redirects to the login page when signed out.
export async function requireUserId(): Promise<string> {
    const userId = await getSessionUserId();
    if (!userId) redirect("/login");
    return userId;
}

export function unauthorizedResponse(): NextResponse {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

// For user routes: 401 when signed out, 403 when the session is not the user at id.
export async function authorizeSelf(id: string): Promise<NextResponse | null> {
    const userId = await getSessionUserId();
    if (!userId) return unauthorizedResponse();
    if (userId !== id) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    return null;
}
