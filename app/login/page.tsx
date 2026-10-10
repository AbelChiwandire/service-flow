import Link from "next/link";
import { Header } from "@/components/Header";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <Header />

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

                    <form className="space-y-5">
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
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-700"
                                >
                                    Password
                                </label>
                                <Link
                                    href="#"
                                    className="text-sm font-medium text-[#2667FF] hover:text-[#3F8EFC]"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2667FF] focus:ring-2 focus:ring-blue-100"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-md bg-[#2667FF] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] focus:outline-none focus:ring-2 focus:ring-[#2667FF] focus:ring-offset-2"
                        >
                            Sign in
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/signup"
                            className="font-semibold text-[#2667FF] hover:text-[#3F8EFC]"
                        >
                            Create an account
                        </Link>
                    </p>
                </section>
            </main>
        </div>
    );
}
