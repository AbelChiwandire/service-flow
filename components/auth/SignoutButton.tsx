import { signOutAction } from "@/lib/auth/actions";

export function SignOutButton({
    className,
    role,
}: {
    className?: string;
    role?: string;
}) {
    return (
        <form action={signOutAction}>
            <button type="submit" className={className} role={role}>
                Sign out
            </button>
        </form>
    );
}
