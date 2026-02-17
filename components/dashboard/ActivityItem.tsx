import { Link } from "react-router-dom";

interface ActivityItemProps {
    client: string;
    id: string;
    status: string;
    value: string;
    date: string;
}

export function ActivityItem({ client, id, status, value, date }: ActivityItemProps) {
    return (
        <Link to={`/quotes/${id.replace("#", "")}`} className="flex items-center justify-between p-3 bg-white border border-border-color shadow-sm hover:border-primary/30 transition-all group active:scale-[0.99]">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-background-light flex items-center justify-center border border-border-color group-hover:border-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-colors">description</span>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-text-primary leading-none mb-1 group-hover:text-primary transition-colors">{client}</h4>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-gray-100 px-1 py-0.5 rounded-none text-text-muted">{id}</span>
                        <span className="text-[10px] text-text-muted uppercase tracking-wider font-medium">{date}</span>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <span className="block font-mono font-bold text-sm text-text-primary">{value}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-status-success">{status}</span>
            </div>
        </Link>
    );
}
