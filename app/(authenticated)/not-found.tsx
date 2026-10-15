import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";

export default function AuthenticatedNotFound() {
    return (
        <EmptyState
            icon="?"
            title="Page not found"
            message="The page you are looking for does not exist or may have been deleted."
            action={<ButtonLink href="/dashboard">Go to dashboard</ButtonLink>}
        />
    );
}
