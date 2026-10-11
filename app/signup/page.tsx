import { Header } from "@/components/Header";
import SignupForm from "./signup-form";

export default function SignupPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <Header />

            <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Create your ServiceFlow account
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Get started managing your service business in one workspace.
                        </p>
                    </div>

                    <SignupForm />
                </section>
            </main>
        </div>
    );
}