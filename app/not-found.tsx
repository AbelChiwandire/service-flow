import { PublicHeader } from "@/components/layout/PublicHeader";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";

export default function NotFound() {
    return (
        <div className="page-shell">
            <PublicHeader />

            <main className="page-main-centered">
                <EmptyState
                    icon="?"
                    title="Page not found"
                    message="The page you are looking for does not exist or may have been moved."
                    action={<ButtonLink href="/">Go to home page</ButtonLink>}
                />
            </main>
        </div>
    );
}
