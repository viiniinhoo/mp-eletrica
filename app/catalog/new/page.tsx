
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCatalog } from "@/hooks/useCatalog";
import type { CatalogCategory, UnitOfMeasure } from "@/types/catalog";

export default function NewCatalogItem() {
    const navigate = useNavigate();
    const { addCatalogItem } = useCatalog();
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [name, setName] = useState("");
    const [category, setCategory] = useState<CatalogCategory>("geral");
    const [unit, setUnit] = useState<UnitOfMeasure>("unid");
    const [price, setPrice] = useState("");
    const [brand, setBrand] = useState("");
    const [icon, setIcon] = useState("package_2");

    const handleSave = async () => {
        if (!name || !price || !category) {
            alert("Por favor, preencha o nome, categoria e preço.");
            return;
        }

        setIsSaving(true);
        try {
            const result = await addCatalogItem({
                name,
                brand,
                price: parseFloat(price.replace(',', '.')),
                unit,
                category,
                icon,
                is_active: true
            });

            if (result.success) {
                navigate("/catalog");
            } else {
                alert("Erro ao salvar: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Ocorreu um erro inesperado.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-text-primary flex flex-col max-w-lg mx-auto w-full border-x border-border-color">
            <header className="bg-primary flex items-center px-4 py-5 shadow-lg sticky top-0 z-50">
                <button onClick={() => navigate(-1)} className="text-white flex size-10 shrink-0 items-center justify-center hover:bg-white/10 rounded-full transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-white text-xl font-bold tracking-[0.2em] flex-1 text-center font-heading uppercase pr-10">
                    Novo Item
                </h1>
            </header>

            <main className="flex-1 flex flex-col p-4 space-y-6 pb-28">
                {/* Registration Form */}
                <div className="flex flex-col space-y-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Nome do Item</label>
                        <input
                            className="w-full h-14 border border-border-color bg-white px-4 text-sm font-bold uppercase tracking-tight focus:border-primary rounded-none transition-all outline-none"
                            placeholder="Ex: Cabo Flexível 2.5mm"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Marca / Fabricante</label>
                        <input
                            className="w-full h-14 border border-border-color bg-white px-4 text-sm font-bold uppercase tracking-tight focus:border-primary rounded-none transition-all outline-none"
                            placeholder="Ex: Sil, Schneider, etc"
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Categoria</label>
                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as CatalogCategory)}
                                className="w-full h-14 border border-border-color bg-white px-4 text-sm font-bold uppercase tracking-tight appearance-none focus:border-primary rounded-none pr-12 outline-none"
                            >
                                <option value="geral">Geral / Diversos</option>
                                <option value="fios_cabos">Fios e Cabos</option>
                                <option value="iluminacao">Iluminação</option>
                                <option value="disjuntores">Disjuntores e Proteção</option>
                                <option value="infra_eletrodutos">Infra / Eletrodutos</option>
                                <option value="ferramentas">Ferramentas</option>
                                <option value="servicos">Serviços Técnicos</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Unid. Medida</label>
                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value as UnitOfMeasure)}
                                className="w-full h-14 border border-border-color bg-white px-4 text-sm font-bold uppercase tracking-tight appearance-none focus:border-primary rounded-none outline-none"
                            >
                                <option value="metro">Metro</option>
                                <option value="unid">Unid</option>
                                <option value="rolo">Rolo</option>
                                <option value="ponto">Ponto</option>
                                <option value="visita">Visita</option>
                                <option value="barra">Barra</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Preço Unitário</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none bg-gray-50 border-r border-border-color pr-3">
                                    <span className="text-xs font-black text-primary">R$</span>
                                </div>
                                <input
                                    className="w-full h-14 border border-border-color bg-white pl-14 pr-4 text-sm font-black focus:border-primary rounded-none outline-none font-mono"
                                    placeholder="0,00"
                                    type="number"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Ícone</label>
                        <select
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            className="w-full h-14 border border-border-color bg-white px-4 text-sm font-bold uppercase tracking-tight appearance-none focus:border-primary rounded-none outline-none"
                        >
                            <option value="package_2">Padrão</option>
                            <option value="bolt">Eletricidade</option>
                            <option value="lightbulb">Iluminação</option>
                            <option value="settings">Técnico</option>
                            <option value="build">Ferramenta</option>
                            <option value="cable">Cabo / Fio</option>
                        </select>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 border-t border-border-color z-[60] max-w-lg mx-auto">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full h-16 bg-safety-yellow hover:bg-yellow-400 flex items-center justify-center gap-2 rounded-none shadow-lg active:scale-[0.98] transition-all border-b-4 border-yellow-600 active:border-b-0 disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-primary font-black">
                        {isSaving ? "sync" : "save"}
                    </span>
                    <span className="text-primary text-lg font-black font-heading tracking-[0.2em] uppercase">
                        {isSaving ? "SALVANDO..." : "Salvar no Catálogo"}
                    </span>
                </button>
            </div>
        </div>
    );
}
