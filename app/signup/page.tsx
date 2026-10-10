import Link from "next/link";
import { Header } from "@/components/Header";

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

                    <form className="space-y-5">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Full name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2667FF] focus:ring-2 focus:ring-blue-100"
                                placeholder="Your full name"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2667FF] focus:ring-2 focus:ring-blue-100"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2667FF] focus:ring-2 focus:ring-blue-100"
                                placeholder="Create a password"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Confirm password
                            </label>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2667FF] focus:ring-2 focus:ring-blue-100"
                                placeholder="Confirm your password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-md bg-[#2667FF] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] focus:outline-none focus:ring-2 focus:ring-[#2667FF] focus:ring-offset-2"
                        >
                            Create account
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-[#2667FF] hover:text-[#3F8EFC]"
                        >
                            Sign in
                        </Link>
                    </p>
                </section>
            </main>
        </div>
    );
}