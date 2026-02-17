export type KPIStatus = 'warning' | 'success' | 'danger' | 'info';

export interface KPI {
    title: string;
    value: string;
    subtitle: string;
    icon: string;
    color: KPIStatus;
}

export interface ActivityLog {
    id: string;
    clientName: string;
    quoteId: string;
    status: string;
    value: string;
    date: string;
}
