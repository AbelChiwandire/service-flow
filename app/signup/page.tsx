import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import SignupForm from "./signup-form";

export const metadata: Metadata = {
    title: "Create account",
    description: "Create a ServiceFlow account to manage your customers and jobs.",
};

export default function SignupPage() {
    return (
        <div className="page-shell">
            <PublicHeader />

            <main className="auth-main">
                <section className="auth-card">
                    <div className="mb-6 text-center">
                        <h1 className="heading-h1">
                            Create your ServiceFlow account
                        </h1>
                        <p className="mt-2 small-text">
                            Get started managing your service business in one workspace.
                        </p>
                    </div>

                    <SignupForm />
                </section>
            </main>
        </div>
    );
}
