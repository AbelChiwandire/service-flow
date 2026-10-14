import Link from "next/link";

interface SummaryCardProps {
    label: string;
    value: number;
    href: string;
    // 'alert' highlights a number that needs attention, but only while it is above zero.
    tone?: "default" | "alert";
}

export default function SummaryCard({ label, value, href, tone = "default" }: SummaryCardProps) {
    const highlight = tone === "alert" && value > 0;

    return (
        <Link
            href={href}
            className={`group summary-card ${highlight ? "summary-card-alert" : "summary-card-default"}`}
        >
            <p className={`label-text ${highlight ? "text-maroon" : ""}`}>
                {label}
            </p>

            <p
                className={`mt-1 stat-value ${highlight ? "text-maroon" : "group-hover:text-navy-hover"}`}
            >
                {value}
            </p>
        </Link>
    );
}
