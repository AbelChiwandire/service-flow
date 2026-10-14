import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";

const features = [
    {
        title: "Manage customers",
        description: "Keep customer information organized and accessible from one workspace.",
    },
    {
        title: "Track jobs",
        description:
            "Create jobs, schedule work, and keep track of progress from start to completion.",
    },
];

export default function Home() {
    return (
        <div className="page-shell bg-white">
            <PublicHeader />

            <main className="flex-1">
                <section className="relative overflow-hidden bg-surface">
                    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-32">
                        <div>
                            <span className="inline-flex rounded-full bg-navy-tint px-4 py-1 text-sm font-semibold text-navy">
                                Simple business management
                            </span>

                            <h1 className="mt-6 max-w-3xl heading-display">
                                Run your service business with{" "}
                                <span className="text-navy">less complexity.</span>
                            </h1>

                            <p className="mt-6 max-w-2xl lead-text">
                                ServiceFlow helps small service businesses manage customers and jobs
                                efficiently.
                            </p>

                            <div className="mt-8 row-responsive">
                                <Link
                                    href="/signup"
                                    className="btn-primary btn-lg"
                                >
                                    Get started
                                </Link>

                                <Link
                                    href="/login"
                                    className="btn-secondary btn-lg"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="card-elevated">
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <div>
                                        <h2 className="mt-1 heading-h2">
                                            Business overview
                                        </h2>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    <div className="card-muted">
                                        <p className="small-text">Total Customers</p>
                                        <p className="mt-2 stat-value">24</p>
                                    </div>

                                    <div className="card-muted">
                                        <p className="small-text">Total jobs</p>
                                        <p className="mt-2 stat-value">12</p>
                                    </div>
                                </div>

                                <div className="mt-4 card-outline">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="item-title">
                                                Kitchen maintenance
                                            </p>
                                            <p className="mt-1 caption-text">
                                                Scheduled for tomorrow
                                            </p>
                                        </div>

                                        <span className="badge badge-navy">
                                            Scheduled
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 card-outline">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="item-title">
                                                Office cleaning
                                            </p>
                                            <p className="mt-1 caption-text">
                                                Ready for completion
                                            </p>
                                        </div>

                                        <span className="badge badge-navy">
                                            In progress
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                        <div className="max-w-2xl">
                            <p className="eyebrow-text">
                                Everything you need
                            </p>

                            <h2 className="mt-4 heading-h1">
                                Keep your day-to-day work organized.
                            </h2>

                            <p className="mt-4 lead-text">
                                ServiceFlow focuses on the workflows small service businesses use
                                most, without adding unnecessary complexity.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-6 md:grid-cols-2">
                            {features.map((feature) => (
                                <article
                                    key={feature.title}
                                    className="card-feature"
                                >
                                    <div className="h-10 w-10 rounded-lg font-bold icon-tile">
                                        ✓
                                    </div>

                                    <h3 className="mt-6 heading-h3">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-2 body-text">
                                        {feature.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-navy">
                    <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
                        <h2 className="text-white heading-h1">
                            Spend less time organizing and more time serving customers.
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-white lead-text">
                            Start building a clearer workflow for your service business with
                            ServiceFlow.
                        </p>

                        <Link
                            href="/signup"
                            className="mt-8 btn-inverse btn-lg"
                        >
                            Create your account
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-border bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <p>© 2026 ServiceFlow. All rights reserved.</p>

                    <p>Simple tools for small service businesses.</p>
                </div>
            </footer>
        </div>
    );
}
