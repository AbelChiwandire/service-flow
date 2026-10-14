import { AuthenticatedShell } from "@/components/layout/AuthenticatedShell";

export default function AuthenticatedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-surface">
            <AuthenticatedShell>
                <main className="page-main">
                    {children}
                </main>
            </AuthenticatedShell>
        </div>
    );
}
