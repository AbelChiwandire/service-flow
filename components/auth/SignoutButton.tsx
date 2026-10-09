import { signOutAction } from '@/lib/auth/actions';

export function SignOutButton(
    { onClick, className, role }
        : { onClick?: () => void; className?: string; role?: string })
{
    return (
        <form 
            action={signOutAction}
        >
            <button
                type="submit"
                className={className}
                role={role}
            >
                Sign out
            </button>
        </form>
    )
}