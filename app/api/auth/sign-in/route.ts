import { NextResponse } from "next/server";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn } from "@/auth";

const bodySchema = z.object({ email: z.email(), password: z.string().min(8) });

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
    }

    try {
        await signIn("credentials", { ...parsed.data, redirect: false });
        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === "CredentialsSignin") {
                return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
            }
            return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
        }
        throw error;
    }
}
