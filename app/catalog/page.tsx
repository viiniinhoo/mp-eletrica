"use client";

import { motion } from "framer-motion";
import { BottomNav, FloatingActionButton } from "@/components/Navigation";
import Link from "next/link";
import { useState, useMemo } from "react";
import { CatalogItem as CatalogItemComponent } from "@/components/catalog/CatalogItem";

import { useQuote } from "@/contexts/QuoteContext";
import { useRouter } from "next/navigation";
import { CatalogItem, CatalogCategory, UnitOfMeasure } from "@/types/catalog";
import { QuoteItem } from "@/types/quote";
import { useCatalog } from "@/hooks/useCatalog";

export default function CatalogList() {
    const [activeTab, setActiveTab] = useState("materials");
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();
    const { addItem } = useQuote();
    const { items: catalogItems, loading } = useCatalog();

    const filteredItems = useMemo(() => {
        return catalogItems.filter(item => {
            // Filter by tab
            const isService = item.category === 'servicos';
            if (activeTab === 'materials' && isService) return false;
            if (activeTab === 'services' && !isService) return false;

            // Filter by search term
            if (!searchTerm) return true;

            const searchLower = searchTerm.toLowerCase();
            return (
                item.name.toLowerCase().includes(searchLower) ||
                item.brand.toLowerCase().includes(searchLower) ||
                item.category.toLowerCase().includes(searchLower)
            );
        });
    }, [catalogItems, activeTab, searchTerm]);


    const handleAdd = (item: CatalogItem) => {
        addItem({ catalogItem: item, quantity: 1 });
        // Optional: Show toast or feedback
        // alert(`Item "${item.name}" adicionado ao orçamento!`);
        router.push('/quotes/new/step-2');
    };

    return (
        <div className="min-h-screen bg-background-light text-text-primary flex flex-col pb-24 max-w-lg mx-auto w-full">
            <header className="sticky top-0 z-20 bg-primary shadow-lg">
                <div className="flex items-center justify-between px-4 py-4 text-white">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center justify-center p-1 hover:bg-white/10 rounded">
                            <span className="material-symbols-outlined text-white" style={{ fontSize: "24px" }}>arrow_back</span>
                        </Link>
                        <h1 className="font-display font-medium text-xl tracking-wide uppercase">Catálogo</h1>
                    </div>
                    <button className="flex items-center justify-center p-1 hover:bg-white/10 rounded">
                        <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>filter_list</span>
                    </button>
                </div>

                <div className="px-4 pb-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-white/70" style={{ fontSize: "20px" }}>search</span>
                        </div>
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border-2 border-white/20 rounded-none focus:outline-none focus:border-accent font-body text-sm bg-white/10 text-white placeholder-white/70"
                            placeholder="Buscar item, código ou SKU..."
                            type="text"
                        />
                    </div>
                </div>

                <div className="flex w-full">
                    <button
                        onClick={() => setActiveTab("materials")}
                        className={`flex-1 py-3 text-center border-b-[3px] transition-colors relative group ${activeTab === "materials" ? "border-accent" : "border-transparent"}`}
                    >
                        <span className={`font-display font-medium text-sm tracking-widest uppercase ${activeTab === "materials" ? "text-white" : "text-white/60"}`}>Materiais</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("services")}
                        className={`flex-1 py-3 text-center border-b-[3px] transition-colors relative group ${activeTab === "services" ? "border-accent" : "border-transparent"}`}
                    >
                        <span className={`font-display font-medium text-sm tracking-widest uppercase ${activeTab === "services" ? "text-white" : "text-white/60"}`}>Serviços</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 pb-4">
                <div className="px-4 py-2 bg-background-light flex justify-between items-center border-b border-border-color">
                    <span className="text-xs font-display font-medium text-text-muted uppercase tracking-wider">
                        Elétrica Geral • {loading ? '...' : `${filteredItems.length} Itens`}
                    </span>
                    <button className="text-xs font-bold text-primary flex items-center gap-1 uppercase">
                        Ordenar <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>sort</span>
                    </button>
                </div>

                <div className="flex flex-col divide-y divide-border-color bg-surface">
                    {loading ? (
                        <div className="space-y-0">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-20 bg-surface border-b border-border-color animate-pulse flex items-center px-4 gap-3">
                                    <div className="w-10 h-10 bg-background-light rounded-none"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-background-light rounded-none w-3/4"></div>
                                        <div className="h-3 bg-background-light rounded-none w-1/2"></div>
                                    </div>
                                    <div className="w-16 h-6 bg-background-light rounded-none"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="p-8 text-center">
                            <span className="material-symbols-outlined text-4xl text-text-muted mb-2">search_off</span>
                            <p className="text-text-muted text-sm font-bold uppercase tracking-wider">Nenhum item encontrado</p>
                            <p className="text-xs text-text-muted mt-1">Tente buscar por outro termo.</p>
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <CatalogItemComponent
                                key={item.id}
                                name={item.name}
                                brand={item.brand}
                                price={`R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                unit={item.unit}
                                icon={item.icon || "package_2"}
                                onClick={() => handleAdd(item)}
                            />
                        ))
                    )}
                </div>
            </main>


            <FloatingActionButton href="/catalog/new" />
            <BottomNav />
        </div >
    );
}

// function CatalogItem is now imported
