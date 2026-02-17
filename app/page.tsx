import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BottomNav, FloatingActionButton } from "@/components/Navigation";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityItem } from "@/components/dashboard/ActivityItem";
import { useQuotes } from "@/hooks/useQuotes";
import { useMemo } from "react";

export default function Dashboard() {
    const { quotes, loading } = useQuotes();

    // Calculate statistics from real data
    const stats = useMemo(() => {
        if (!quotes || quotes.length === 0) {
            return {
                open: 0,
                approved: 0,
                revenue: 0,
                conversion: 0,
            };
        }

        const openQuotes = quotes.filter(q => q.status === 'open').length;
        const approvedThisWeek = quotes.filter(q => {
            if (q.status !== 'approved') return false;
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(q.createdAt) >= weekAgo;
        }).length;

        // Revenue from completed quotes this month
        const thisMonth = new Date().getMonth();
        const revenue = quotes
            .filter(q => {
                if (q.status !== 'completed') return false;
                return new Date(q.createdAt).getMonth() === thisMonth;
            })
            .reduce((sum, q) => {
                const total = q.items.reduce((itemSum, item) =>
                    itemSum + (item.catalogItem.price * item.quantity), 0
                );
                return sum + total;
            }, 0);

        // Conversion rate (approved + completed / total)
        const converted = quotes.filter(q =>
            q.status === 'approved' || q.status === 'completed'
        ).length;
        const conversion = quotes.length > 0
            ? Math.round((converted / quotes.length) * 100)
            : 0;

        return {
            open: openQuotes,
            approved: approvedThisWeek,
            revenue,
            conversion,
        };
    }, [quotes]);

    // Get recent quotes for activity feed
    const recentQuotes = useMemo(() => {
        return quotes
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 4);
    }, [quotes]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (date.toDateString() === yesterday.toDateString()) {
            return `Ontem, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            open: 'Orçado',
            approved: 'Validado',
            completed: 'Concluído',
            cancelled: 'Cancelado',
        };
        return labels[status] || status;
    };

    return (
        <div className="min-h-screen bg-background-light text-text-primary flex flex-col pb-24 max-w-lg mx-auto w-full">
            {/* Header */}
            <header className="bg-primary text-white pt-10 pb-6 px-5 shadow-md sticky top-0 z-20 overflow-hidden">
                <div className="absolute inset-0 industrial-stripes opacity-30 pointer-events-none"></div>
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-accent" style={{ fontSize: "28px" }}>electric_bolt</span>
                            <h1 className="font-heading text-2xl tracking-wide uppercase font-bold text-white">MP Elétrica</h1>
                        </div>
                        <p className="text-gray-300 text-xs font-mono uppercase tracking-wider">Painel de Controle v2.1</p>
                    </div>
                    <Link to="/profile" className="relative group cursor-pointer border border-white/20 p-0.5">
                        <div className="h-10 w-10 bg-white/10 flex items-center justify-center text-white overflow-hidden">
                            <img
                                alt="Profile"
                                className="h-full w-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuArQkLl7BwmULRlPAQq7s-dCNRRXgHvKEv4hWQ8P7UlwbI2ahsizrH5I8SRnStHpVsaUwRkgkQzx8mgxbeSWWhXg4Shf3Rdz62gb1-9hWOLq0dxd-a_o1jdB3AwyKRjksF6scEgv0GFfcd2zVYgP5ITKuCD4RVNjr63arU-lgBSMAyWqTtOO7X-n1TQFMS-hs29AvhKYoTAStsQB89BFMTeB0XjrNRse1Bm6mOg1hi8WVh4h6XknVer3GZRNzln0uZvtauhxERFMMn3"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-status-success rounded-full border-2 border-primary"></div>
                    </Link>
                </div>
            </header>

            <main className="flex-1 px-4 py-6 space-y-6">
                {/* Welcome Section */}
                <div className="flex justify-between items-end border-l-4 border-accent pl-3">
                    <div>
                        <h2 className="text-text-primary font-heading text-xl font-medium uppercase">Visão Geral</h2>
                        <p className="text-text-muted text-sm mt-0.5">
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                    <button className="text-primary text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1">
                        Filtrar <span className="material-symbols-outlined text-sm">filter_list</span>
                    </button>
                </div>

                {/* KPI Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-surface animate-pulse rounded-none"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <StatCard
                            title="Em Aberto"
                            value={stats.open.toString().padStart(2, '0')}
                            icon="pending_actions"
                            subtitle="Aguardando"
                            color="status-warning"
                        />
                        <StatCard
                            title="Aprovados"
                            value={stats.approved.toString().padStart(2, '0')}
                            icon="check_circle"
                            subtitle="Esta semana"
                            color="status-success"
                        />
                        <StatCard
                            title="Receita (Mês)"
                            value={`R$ ${(stats.revenue / 1000).toFixed(1)}k`}
                            icon="payments"
                            subtitle="Este mês"
                            color="primary"
                        />
                        <StatCard
                            title="Conversão"
                            value={`${stats.conversion}%`}
                            icon="trending_up"
                            subtitle="Meta: 50%"
                            color="primary"
                        />
                    </div>
                )}

                {/* Recent Activity */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-text-primary font-heading text-lg font-medium tracking-wide uppercase">Atividade Recente</h3>
                    <Link to="/quotes" className="text-primary text-xs font-bold hover:underline">Ver Todos</Link>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-16 bg-surface animate-pulse rounded-none"></div>
                        ))}
                    </div>
                ) : recentQuotes.length === 0 ? (
                    <div className="p-8 text-center bg-surface border-2 border-dashed border-border-color">
                        <span className="material-symbols-outlined text-4xl text-text-muted mb-2">description</span>
                        <p className="text-text-muted text-sm font-bold uppercase tracking-wider">Nenhum orçamento criado</p>
                        <p className="text-xs text-text-muted mt-1">Crie seu primeiro orçamento para começar.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentQuotes.map((quote) => {
                            const total = quote.items.reduce((sum, item) =>
                                sum + (item.catalogItem.price * item.quantity), 0
                            );
                            return (
                                <ActivityItem
                                    key={quote.id}
                                    client={quote.client.name}
                                    id={`#${quote.id}`}
                                    status={getStatusLabel(quote.status)}
                                    value={`R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                    date={formatDate(quote.createdAt)}
                                />
                            );
                        })}
                    </div>
                )}
            </main>

            <FloatingActionButton />
            <BottomNav />
        </div>
    );
}

