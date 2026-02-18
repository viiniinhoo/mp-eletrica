
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuote } from "@/contexts/QuoteContext";
import { useQuotes } from "@/hooks/useQuotes";

export default function NewQuoteStep3() {
    const navigate = useNavigate();
    const { clientData, items, totalValue, updateQuantity, removeItem, clearQuote } = useQuote();
    const { createQuote } = useQuotes();
    const [isSaving, setIsSaving] = useState(false);

    const subtotalMaterials = items
        .filter(i => i.catalogItem.category !== 'servicos')
        .reduce((acc, i) => acc + (i.catalogItem.price * i.quantity), 0);

    const subtotalServices = items
        .filter(i => i.catalogItem.category === 'servicos')
        .reduce((acc, i) => acc + (i.catalogItem.price * i.quantity), 0);

    const handleQuantityChange = (id: string, currentQty: number, change: number) => {
        const newQty = currentQty + change;
        if (newQty < 1) {
            if (confirm('Deseja remover este item do orçamento?')) {
                removeItem(id);
            }
        } else {
            updateQuantity(id, newQty);
        }
    };

    const handleFinalize = async () => {
        if (!clientData || items.length === 0) {
            alert("Erro: Dados do cliente ou itens ausentes.");
            return;
        }

        setIsSaving(true);

        try {
            const result = await createQuote(clientData, items);

            if (result.success) {
                clearQuote();
                navigate("/quotes");
            } else {
                alert(`Erro ao salvar orçamento: ${result.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("Erro inesperado ao salvar orçamento.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light text-text-primary flex flex-col max-w-lg mx-auto w-full border-x border-border-color pb-24">
            <header className="bg-primary text-white pt-6 pb-4 px-4 sticky top-0 z-50 shadow-md">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate(-1)} className="material-symbols-outlined cursor-pointer text-white">arrow_back</button>
                            <h1 className="font-heading text-xl font-bold tracking-widest uppercase">REVISÃO DO ORÇAMENTO</h1>
                        </div>
                        <div className="text-[10px] font-mono font-black opacity-80 uppercase">Passo 3 de 3</div>
                    </div>
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-1 text-[9px] font-mono uppercase tracking-[0.2em] opacity-80">
                            <span>Status: Finalizado</span>
                            <span>100%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/20 rounded-none overflow-hidden">
                            <div className="h-full bg-accent" style={{ width: "100%" }}></div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-4 flex flex-col gap-6">
                {/* Client Data Card */}
                <section className="bg-white border border-border-color rounded-none shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-border-color flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl">factory</span>
                            <h2 className="font-heading text-lg font-bold text-primary uppercase tracking-tight">DADOS DO CLIENTE</h2>
                        </div>
                        <button
                            onClick={() => navigate('/quotes/new/step-1')}
                            className="flex items-center gap-1 text-primary hover:bg-primary/10 px-2 py-1 transition-colors text-xs font-black uppercase"
                        >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            <span>Editar</span>
                        </button>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1">Razão Social / Nome</label>
                            <p className="font-bold text-primary text-lg font-heading uppercase">{clientData?.name || "Cliente não informado"}</p>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1">Endereço de Execução</label>
                            <p className="text-text-muted text-xs font-bold leading-relaxed uppercase">
                                {clientData?.address || "Endereço não informado"}
                            </p>
                        </div>
                        <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase">
                            Tipo: {clientData?.locationType || "N/A"}
                        </div>
                    </div>
                </section>

                {/* Budget Items Card */}
                <section className="bg-white border border-border-color rounded-none shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-border-color flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl">list_alt</span>
                            <h2 className="font-heading text-lg font-bold text-primary uppercase tracking-tight">ITENS DO ORÇAMENTO</h2>
                        </div>
                        <button
                            onClick={() => navigate('/catalog', { state: { fromQuote: true } })}
                            className="flex items-center gap-1 text-primary hover:bg-primary/10 px-2 py-1 transition-colors text-xs font-black uppercase"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span>Adicionar</span>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-[10px] uppercase font-bold text-text-muted tracking-widest border-b border-gray-100">
                                    <th className="px-4 py-3">Descrição do Item</th>
                                    <th className="px-4 py-3 text-center">Qtd</th>
                                    <th className="px-4 py-3 text-right">Unitário (R$)</th>
                                    <th className="px-4 py-3 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-xs text-text-muted font-bold uppercase">Nenhum item adicionado</td>
                                    </tr>
                                ) : (
                                    items.map((item, index) => (
                                        <ReviewRow
                                            key={`${item.catalogItem.id}-${index}`}
                                            type={item.catalogItem.category === 'servicos' ? 'Serviço' : 'Material'}
                                            name={item.catalogItem.name}
                                            qty={item.quantity}
                                            unitName={item.catalogItem.unit}
                                            unitPrice={item.catalogItem.price.toFixed(2)}
                                            sub={(item.catalogItem.price * item.quantity).toFixed(2)}
                                            isService={item.catalogItem.category === 'servicos'}
                                            onIncrease={() => handleQuantityChange(item.catalogItem.id, item.quantity, 1)}
                                            onDecrease={() => handleQuantityChange(item.catalogItem.id, item.quantity, -1)}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Financial Summary */}
                <section className="bg-primary text-white p-6 shadow-xl border-t-8 border-accent">
                    <h2 className="font-heading text-xl font-bold mb-6 border-b border-white/20 pb-2 uppercase tracking-tight">Resumo Financeiro</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs opacity-70 uppercase font-black tracking-widest">Subtotal Materiais</span>
                            <span className="font-mono text-lg font-bold tracking-tight text-blue-200">R$ {subtotalMaterials.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs opacity-70 uppercase font-black tracking-widest">Subtotal Serviços</span>
                            <span className="font-mono text-lg font-bold tracking-tight text-blue-200">R$ {subtotalServices.toFixed(2)}</span>
                        </div>
                        <div className="pt-4 border-t border-white/30 flex flex-col gap-2">
                            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-accent block">Valor Final do Projeto</span>
                            <div className="flex justify-between items-end">
                                <span className="font-heading text-2xl font-bold uppercase leading-none">TOTAL DO ORÇAMENTO</span>
                                <span className="font-mono text-3xl font-black text-accent leading-none">R$ {totalValue.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <p className="text-[9px] text-text-muted uppercase leading-relaxed text-center font-black tracking-tighter px-4">
                    Este orçamento tem validade de 7 dias úteis. Os valores estão sujeitos a alteração conforme disponibilidade de estoque dos fornecedores. A execução dos serviços segue as normas NBR-5410.
                </p>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-color p-4 z-50 max-w-lg mx-auto">
                <button
                    onClick={handleFinalize}
                    disabled={isSaving}
                    className="w-full bg-accent hover:bg-yellow-400 text-primary font-heading text-lg font-bold py-4 px-6 rounded-none shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all border-b-4 border-yellow-600 active:border-b-0 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined font-black">
                        {isSaving ? "sync" : "picture_as_pdf"}
                    </span>
                    {isSaving ? "SALVANDO..." : "FINALIZAR E SALVAR"}
                </button>
            </footer>
        </div>
    );
}

interface ReviewRowProps {
    type: string;
    name: string;
    qty: number;
    unitName: string;
    unitPrice: string;
    sub: string;
    isService: boolean;
    onIncrease: () => void;
    onDecrease: () => void;
}

function ReviewRow({ type, name, qty, unitName, unitPrice, sub, isService, onIncrease, onDecrease }: ReviewRowProps) {
    return (
        <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-4">
                <span className={`text-[9px] font-black uppercase block mb-0.5 tracking-widest ${isService ? 'text-status-success' : 'text-primary'}`}>{type}</span>
                <span className="text-sm font-bold text-primary uppercase font-heading leading-tight">{name}</span>
            </td>
            <td className="px-2 py-4 text-center">
                <div className="flex items-center justify-center border border-border-color bg-white w-24 h-8 mx-auto">
                    <button
                        onClick={onDecrease}
                        className="w-8 h-full flex items-center justify-center text-primary hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="flex-1 text-center font-mono text-xs font-bold">{qty}</span>
                    <button
                        onClick={onIncrease}
                        className="w-8 h-full flex items-center justify-center text-primary hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                </div>
                <span className="text-[9px] text-text-muted font-bold uppercase tracking-tighter block mt-1">{unitName}</span>
            </td>
            <td className="px-4 py-4 text-right">
                <span className="font-mono text-xs font-bold text-gray-500">{unitPrice}</span>
            </td>
            <td className="px-4 py-4 text-right">
                <span className="font-mono text-sm font-black text-primary">{sub}</span>
            </td>
        </tr>
    );
}
