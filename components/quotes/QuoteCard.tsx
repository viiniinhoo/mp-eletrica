import Link from "next/link";

interface QuoteCardProps {
    id: string;
    client: string;
    desc: string;
    value: string;
    date: string;
    status: string;
    color: string;
    cancelled?: boolean;
}

export function QuoteCard({ id, client, desc, value, date, status, color, cancelled }: QuoteCardProps) {
    const statusColors: Record<string, string> = {
        "status-warning": "bg-status-warning text-status-warning border-status-warning",
        "status-success": "bg-status-success text-status-success border-status-success",
        "status-danger": "bg-status-danger text-status-danger border-status-danger",
        "gray-400": "bg-gray-400 text-gray-400 border-gray-400",
    };

    // Helper to get raw color name for border-l-
    const rawColor = color.replace('text-', '').replace('bg-', '').replace('border-', '');

    return (
        <Link href={`/quotes/${id.replace('#', '')}`} className={`group bg-surface border-l-4 rounded-none shadow-card p-4 relative active:scale-[0.99] transition-transform duration-100 cursor-pointer border border-gray-200 block`} style={{ borderLeftColor: `var(--${rawColor}, ${color})` }}>
            <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-primary font-bold text-sm bg-gray-100 px-2 py-0.5 rounded-none">{id}</span>
                <span className="text-xs text-text-muted font-medium uppercase tracking-wide">{date}</span>
            </div>
            <h3 className="font-display text-lg text-text-primary font-medium leading-tight mb-1">{client}</h3>
            <p className="text-sm text-text-muted mb-3 line-clamp-1">{desc}</p>
            <div className="flex justify-between items-end border-t border-gray-100 pt-3 mt-1">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Valor Total</span>
                    <span className={`font-mono text-primary font-bold text-lg ${cancelled ? "line-through" : ""}`}>{value}</span>
                </div>
                {/* Simplified status badge logic for reliable styling */}
                <span className={`inline-flex items-center px-2.5 py-1 rounded-none text-xs font-bold uppercase tracking-wider border bg-opacity-10 ${statusColors[color] || "bg-gray-100 text-gray-500 border-gray-200"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 bg-current`}></span>
                    {status}
                </span>
            </div>
            <div className="absolute right-4 top-4 text-gray-300">
                <span className="material-symbols-outlined">chevron_right</span>
            </div>
        </Link>
    );
}
