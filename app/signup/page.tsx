import SignupFormWrapper from './signup-form';

export default function SignupPage() {
    return (
        <div className="max-w-xl space-y-4">
            <h1 className="text-xl font-semibold">Sign up</h1>
            <SignupFormWrapper />
        </div>
    );
}