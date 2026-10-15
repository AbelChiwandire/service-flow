import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
    title: "Sign in",
    description: "Sign in to your ServiceFlow account.",
};

export default function LoginPage() {
    return (
        <div className="page-shell">
            <PublicHeader />

            <main className="auth-main">
                <section className="auth-card">
                    <div className="mb-6 text-center">
                        <h1 className="heading-h1">Sign in to ServiceFlow</h1>

                        <p className="mt-2 small-text">Access your service business workspace.</p>
                    </div>

                    <LoginForm />
                </section>
            </main>
        </div>
    );
}
