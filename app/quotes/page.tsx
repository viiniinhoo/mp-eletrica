"use client";

import { motion } from "framer-motion";
import { BottomNav, FloatingActionButton } from "@/components/Navigation";
import Link from "next/link";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { useQuotes } from "@/hooks/useQuotes";
import { useState, useMemo } from "react";
import type { QuoteStatus } from "@/types/quote";

export default function QuotesList() {
    const { quotes, loading } = useQuotes();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<QuoteStatus | "all">("all");

    const filteredQuotes = useMemo(() => {
        return quotes.filter(quote => {
            // Filter by status
            if (activeFilter !== "all" && quote.status !== activeFilter) {
                return false;
            }

            // Filter by search term
            if (!searchTerm) return true;

            const searchLower = searchTerm.toLowerCase();
            return (
                quote.client.name.toLowerCase().includes(searchLower) ||
                quote.id.toLowerCase().includes(searchLower)
            );
        });
    }, [quotes, activeFilter, searchTerm]);

    const getStatusLabel = (status: QuoteStatus) => {
        const labels: Record<QuoteStatus, string> = {
            open: 'Orçado',
            approved: 'Validado',
            completed: 'Concluído',
            cancelled: 'Cancelado',
        };
        return labels[status];
    };

    const getStatusColor = (status: QuoteStatus) => {
        const colors: Record<QuoteStatus, string> = {
            open: 'gray-400',
            approved: 'status-warning',
            completed: 'status-success',
            cancelled: 'status-danger',
        };
        return colors[status];
    };

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

    return (
        <div className="min-h-screen bg-background-light text-text-primary flex flex-col pb-24 max-w-lg mx-auto w-full">
            <header className="bg-primary pt-12 pb-6 px-4 relative overflow-hidden shadow-lg z-10">
                <div className="relative z-10 flex justify-between items-center mb-6">
                    <div>
                        <h1 className="font-display text-white text-3xl tracking-wide uppercase">Orçamentos</h1>
                        <p className="text-gray-300 text-sm mt-1">
                            {loading ? 'Carregando...' : `${filteredQuotes.length} ${filteredQuotes.length === 1 ? 'orçamento' : 'orçamentos'}`}
                        </p>
                    </div>
                    <div className="h-10 w-10 border border-white/20 flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">notifications</span>
                    </div>
                </div>

                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400">search</span>
                    </div>
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border-2 border-gray-600 rounded-none bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-medium shadow-sm h-12"
                        placeholder="Buscar cliente ou ID #..."
                        type="text"
                    />
                </div>

                <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-1">
                    <FilterChip label="Todos" active={activeFilter === "all"} onClick={() => setActiveFilter("all")} />
                    <FilterChip label="Orçados" active={activeFilter === "open"} onClick={() => setActiveFilter("open")} />
                    <FilterChip label="Validados" active={activeFilter === "approved"} onClick={() => setActiveFilter("approved")} />
                    <FilterChip label="Concluídos" active={activeFilter === "completed"} onClick={() => setActiveFilter("completed")} />
                    <FilterChip label="Cancelados" active={activeFilter === "cancelled"} onClick={() => setActiveFilter("cancelled")} />
                </div>
            </header>

            <main className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-surface animate-pulse rounded-none border-2 border-border-color"></div>
                        ))}
                    </div>
                ) : filteredQuotes.length === 0 ? (
                    <div className="p-12 text-center bg-surface border-2 border-dashed border-border-color">
                        <span className="material-symbols-outlined text-5xl text-text-muted mb-3">description</span>
                        <p className="text-text-muted text-sm font-bold uppercase tracking-wider">
                            {searchTerm || activeFilter !== "all" ? 'Nenhum orçamento encontrado' : 'Nenhum orçamento criado'}
                        </p>
                        <p className="text-xs text-text-muted mt-2">
                            {searchTerm || activeFilter !== "all"
                                ? 'Tente ajustar os filtros de busca.'
                                : 'Crie seu primeiro orçamento para começar.'}
                        </p>
                        {!searchTerm && activeFilter === "all" && (
                            <Link
                                href="/quotes/new/step-1"
                                className="inline-block mt-4 bg-primary text-white px-6 py-2 font-bold uppercase text-sm hover:bg-primary-dark transition-colors"
                            >
                                Criar Orçamento
                            </Link>
                        )}
                    </div>
                ) : (
                    filteredQuotes.map((quote) => {
                        const total = quote.items.reduce((sum, item) =>
                            sum + (item.catalogItem.price * item.quantity), 0
                        );

                        // Get first item description or create a summary
                        const description = quote.items.length > 0
                            ? `${quote.items[0].catalogItem.name}${quote.items.length > 1 ? ` e mais ${quote.items.length - 1} ${quote.items.length === 2 ? 'item' : 'itens'}` : ''}`
                            : 'Sem itens';

                        return (
                            <QuoteCard
                                key={quote.id}
                                id={`#${quote.id}`}
                                client={quote.client.name}
                                desc={description}
                                value={`R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                date={formatDate(quote.createdAt)}
                                status={getStatusLabel(quote.status)}
                                color={getStatusColor(quote.status)}
                                cancelled={quote.status === 'cancelled'}
                            />
                        );
                    })
                )}
            </main>

            <FloatingActionButton />
            <BottomNav />
        </div>
    );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex-shrink-0 ${active ? "bg-accent text-primary border-accent" : "bg-transparent text-white border-white/30 hover:bg-white/10"} font-bold px-4 py-1.5 rounded-none text-sm border-2 transition-colors uppercase tracking-wider`}
        >
            {label}
        </button>
    );
}

