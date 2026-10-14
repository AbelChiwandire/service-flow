import type { ReactNode } from "react";
import { BackLink } from "./BackLink";

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
    back?: { href: string; label: string };
}

export function PageHeader({ title, description, action, back }: PageHeaderProps) {
    return (
        <>
            {back ? <BackLink href={back.href} label={back.label} /> : null}

            <div className="page-header">
                <div>
                    <h1 className="heading-h1">
                        {title}
                    </h1>

                    {description ? (
                        <p className="mt-2 max-w-2xl lead-text">
                            {description}
                        </p>
                    ) : null}
                </div>

                {action ? <div className="shrink-0">{action}</div> : null}
            </div>
        </>
    );
}