import { motion, AnimatePresence } from "framer-motion";
import { BottomNav, FloatingActionButton } from "@/components/Navigation";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import { CatalogItem as CatalogItemComponent } from "@/components/catalog/CatalogItem";

import { useQuote } from "@/contexts/QuoteContext";
import { CatalogItem, CatalogCategory, UnitOfMeasure } from "@/types/catalog";
import { useCatalog } from "@/hooks/useCatalog";

export default function CatalogList() {
    const [activeTab, setActiveTab] = useState("materials");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we arrived here from the quote creation flow
    const isSelectionMode = location.state?.fromQuote || false;

    const { addItem } = useQuote();
    const { items: catalogItems, loading } = useCatalog();

    const filteredItems = useMemo(() => {
        return catalogItems.filter(item => {
            const isService = item.category === 'servicos';
            if (activeTab === 'materials' && isService) return false;
            if (activeTab === 'services' && !isService) return false;

            if (!searchTerm) return true;

            const searchLower = searchTerm.toLowerCase();
            return (
                item.name.toLowerCase().includes(searchLower) ||
                item.brand.toLowerCase().includes(searchLower) ||
                item.category.toLowerCase().includes(searchLower)
            );
        });
    }, [catalogItems, activeTab, searchTerm]);

    const handleItemClick = (item: CatalogItem) => {
        if (isSelectionMode) {
            addItem({ catalogItem: item, quantity: 1 });
            navigate('/quotes/new/step-2');
        } else {
            // Future: Navigate to item details or edit mode
            alert(`Item: ${item.name}\nPreço: R$ ${item.price.toFixed(2)}\nUnidade: ${item.unit}`);
        }
    };

    return (
        <div className="min-h-screen bg-background-light text-text-primary flex flex-col pb-24 max-w-lg mx-auto w-full">
            <header className="sticky top-0 z-20 bg-primary shadow-lg transition-all">
                {isSelectionMode && (
                    <div className="bg-accent px-4 py-2 flex items-center justify-between border-b border-yellow-600">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">
                            Modo de Seleção Ativado
                        </span>
                        <button
                            onClick={() => navigate(-1)}
                            className="text-[9px] font-black text-primary border border-primary/20 px-2 py-0.5 uppercase"
                        >
                            Cancelar
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between px-4 py-4 text-white">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate("/")} className="flex items-center justify-center p-1 hover:bg-white/10 rounded transition-colors">
                            <span className="material-symbols-outlined text-white" style={{ fontSize: "24px" }}>arrow_back</span>
                        </button>
                        <h1 className="font-display font-medium text-xl tracking-wide uppercase">Catálogo</h1>
                    </div>
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
                            placeholder="Buscar item ou categoria..."
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
                </div>

                <div className="flex flex-col divide-y divide-border-color bg-surface">
                    {loading ? (
                        <div className="space-y-0">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-20 bg-surface border-b border-border-color animate-pulse flex items-center px-4 gap-3">
                                    <div className="w-10 h-10 bg-background-light"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-background-light w-3/4"></div>
                                        <div className="h-3 bg-background-light w-1/2"></div>
                                    </div>
                                </div>
                            ))}
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
                                onClick={() => handleItemClick(item)}
                            />
                        ))
                    )}
                </div>
            </main>

            {!isSelectionMode && <FloatingActionButton to="/catalog/new" />}
            <BottomNav />
        </div>
    );
}
