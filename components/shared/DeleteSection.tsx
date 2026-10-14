import type { ReactNode } from "react";

// Every page puts its delete action here, at the bottom.
export function DeleteSection({ children }: { children: ReactNode }) {
  return <section className="mt-8 border-t border-slate-200 pt-6">{children}</section>;
}