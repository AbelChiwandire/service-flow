import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getUserById } from "@/lib/db/users/repository";
import { requireUserId } from "@/lib/auth/session";
import { PageHeader } from "@/components/shared/PageHeader";
import { DeleteSection } from "@/components/shared/DeleteSection";
import { DeleteAccountButton } from "@/components/profile/DeleteAccountButton";
import { UpdateProfileForm } from "@/components/profile/UpdateProfileForm";
import { ChangePasswordFormWrapper } from "@/components/auth/ChangePasswordFormWrapper";

export const metadata: Metadata = {
    title: "Account",
    description: "Update your profile, change your password or delete your account.",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
    const userId = await requireUserId();
    const user = await getUserById(userId);
    if (!user) {
        notFound();
    }

    return (
        <div>
            <PageHeader
                title="Account"
                description="Update your profile, change your password or delete your account."
            />

            <div className="max-w-xl space-y-6">
                <UpdateProfileForm
                    initialValues={{
                        name: user.name,
                        businessName: user.businessName,
                        email: user.email,
                    }}
                />
                <div className="section-divider">
                    <h2 className="mb-2 heading-h2">Change password</h2>
                    <ChangePasswordFormWrapper />
                </div>
                <DeleteSection>
                    <DeleteAccountButton email={user.email} />
                </DeleteSection>
            </div>
        </div>
    );
}