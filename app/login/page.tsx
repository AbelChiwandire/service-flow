import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import LoginForm from "./login-form";

export const metadata: Metadata = {
    title: "Sign in",
    description: "Sign in to your ServiceFlow account.",
};

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <PublicHeader />

            <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Sign in to ServiceFlow
                        </h1>

                        <p className="mt-2 text-sm text-slate-600">
                            Access your service business workspace.
                        </p>
                    </div>

                    <LoginForm />
                </section>
            </main>
        </div>
    );
}
