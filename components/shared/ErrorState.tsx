import { ButtonLink } from "./ButtonLink";
import { EmptyState } from "./EmptyState";

interface ErrorStateProps {
    onRetry: () => void;
    homeHref: string;
    homeLabel: string;
}

export function ErrorState({ onRetry, homeHref, homeLabel }: ErrorStateProps) {
    return (
        <div role="alert">
            <EmptyState
                icon="!"
                title="Something went wrong"
                message="We could not load this page. Please try again."
                action={
                    <div className="row-responsive">
                        <button type="button" onClick={onRetry} className="btn-primary">
                            Try again
                        </button>

                        <ButtonLink href={homeHref} variant="secondary">
                            {homeLabel}
                        </ButtonLink>
                    </div>
                }
            />
        </div>
    );
}
