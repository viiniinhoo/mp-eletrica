import { KPIStatus } from "@/types/dashboard";

interface StatCardProps {
    title: string;
    value: string;
    icon: string;
    subtitle: string;
    color: string;
}

export function StatCard({ title, value, icon, subtitle, color }: StatCardProps) {
    const colorClasses: Record<string, string> = {
        "status-warning": "text-status-warning bg-status-warning/10 border-status-warning/20",
        "status-success": "text-status-success bg-status-success/10 border-status-success/20",
        "status-danger": "text-status-danger bg-status-danger/10 border-status-danger/20",
        "primary": "text-primary bg-primary/10 border-primary/20",
    };

    const colorClass = colorClasses[color] || colorClasses.primary;

    return (
        <div className={`bg-surface p-4 border border-l-4 shadow-industrial flex flex-col justify-between h-32 relative overflow-hidden group hover:bg-gray-50 transition-colors ${colorClass.replace("text-", "border-")}`}>
            <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <span className="material-symbols-outlined text-4xl">{icon}</span>
            </div>
            <div className={`flex items-center gap-2 mb-2 ${colorClass.split(" ")[0]}`}>
                <span className="material-symbols-outlined text-xl">{icon}</span>
                <h3 className="text-xs font-bold uppercase tracking-wider">{title}</h3>
            </div>
            <div>
                <span className="font-display text-3xl font-medium text-text-primary block">{value}</span>
                <p className="text-[10px] text-text-muted mt-1 font-medium uppercase tracking-tight">{subtitle}</p>
            </div>
        </div>
    );
}
