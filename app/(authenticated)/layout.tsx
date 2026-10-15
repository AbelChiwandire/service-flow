import { AuthenticatedShell } from "@/components/layout/AuthenticatedShell";
import { auth } from "@/auth";

export default async function AuthenticatedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = (await auth())?.user;
    const initial = (user?.name?.trim() || user?.email || "").charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-surface">
            <AuthenticatedShell userInitial={initial}>
                <main className="page-main">{children}</main>
            </AuthenticatedShell>
        </div>
    );
}
