import { AuthenticatedShell } from "@/components/layout/AuthenticatedShell";

export default function AuthenticatedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-slate-50">
            <AuthenticatedShell>
                <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {children}
                </main>
            </AuthenticatedShell>
        </div>
    );
}
