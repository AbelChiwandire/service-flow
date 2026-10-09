// PLACEHOLDER: Login page for user authentication
// This is for testing purposes only

import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
            <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
                <div className="mb-7">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Sign in to continue.
                    </h1>
                </div>
                <Suspense>
                    <LoginForm />
                </Suspense>
            </section>
        </main>
    );
}
