import type { ReactNode } from "react";

// Every page puts its delete action here, at the bottom.
export function DeleteSection({ children }: { children: ReactNode }) {
    return <section className="mt-8 section-divider">{children}</section>;
}
