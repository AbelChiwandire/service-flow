import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
};

type ButtonLinkProps = {
    href: string;
    variant?: keyof typeof variants;
    children: ReactNode;
};

export function ButtonLink({ href, variant = "primary", children }: ButtonLinkProps) {
    return (
        <Link href={href} className={variants[variant]}>
            {children}
        </Link>
    );
}
