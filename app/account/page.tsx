import { notFound } from 'next/navigation';
import { getUserById } from '@/lib/db/users/repository';
import { PLACEHOLDER_USER_ID } from '@/lib/auth/placeholder-session';
import UpdateProfileForm from './update-profile-form';
import DeleteAccountButton from './delete-account-button';
import ChangePasswordFormWrapper from './change-password-form';

export default async function AccountPage() {
    const user = await getUserById(PLACEHOLDER_USER_ID);
    if (!user) {
        notFound();
    }

    return (
        <div className="max-w-xl space-y-6">
            <h1 className="text-xl font-semibold">Account</h1>
            <UpdateProfileForm
                userId={user.id}
                initialValues={{
                    name: user.name,
                    businessName: user.businessName,
                    email: user.email,
                }}
            />
            <div className="border-t border-slate-200 pt-6">
                <h2 className="text-lg font-semibold mb-2">Change password</h2>
                <ChangePasswordFormWrapper userId={user.id} />
            </div>
            <div className="border-t border-slate-200 pt-4">
                <DeleteAccountButton userId={user.id} />
            </div>
        </div>
    );
}