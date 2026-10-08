import { signOut } from '@/auth';

export function SignOutButton() {
    return (
        <form 
            action={async () => {
                'use server'
                await signOut({ redirectTo: '/' });
            }}
        >
            <button
                type="submit"
                className="rounded cursor-pointer border border-slate-300 px-3 py-1 text-sm text-white bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
                Sign out
            </button>
        </form>
    )
}