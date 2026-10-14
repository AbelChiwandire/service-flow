import type { ReactNode } from "react";

interface EmptyStateProps {
    icon?: string;
    title?: string;
    message: string;
    action?: ReactNode;
}

export function EmptyState({ icon = "+", title = "Nothing here yet", message, action }: EmptyStateProps) {
    return (
        <div className="empty-panel">
            <div className="h-12 w-12 rounded-full icon-tile">
                <span className="text-xl" aria-hidden="true">
                    {icon}
                </span>
            </div>

            <h2 className="mt-4 heading-h2">{title}</h2>

            <p className="mt-2 max-w-md body-text">{message}</p>

            {action ? <div className="mt-4">{action}</div> : null}
        </div>
    );
}
