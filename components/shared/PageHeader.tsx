import type { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {title}
                </h1>

                {description ? (
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                        {description}
                    </p>
                ) : null}
            </div>

            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
    );
}
