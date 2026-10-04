// PLACEHOLDER — real login lives on the auth branch. This page exists only so signupAction's
// redirect('/login') has somewhere to land during testing.

export default function LoginPage() {
    return (
        <div className="max-w-xl space-y-2">
            <h1 className="text-xl font-semibold">Log in</h1>
            <p className="text-sm text-slate-600">
                Login isn&apos;t implemented yet — this page only confirms signup redirected
                correctly.
            </p>
        </div>
    );
}