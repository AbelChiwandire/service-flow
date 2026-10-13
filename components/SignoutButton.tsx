import { signOut } from "@/auth";

export default function SignoutButton() {
    return (
        <form
            action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
            }}
        >
            <button
                type="submit"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2667FF] focus:ring-offset-2"
            >
                Sign out
            </button>
        </form>
    );
}