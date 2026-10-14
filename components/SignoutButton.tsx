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
                className="btn-secondary"
            >
                Sign out
            </button>
        </form>
    );
}