
import { Link, useNavigate } from "react-router-dom";
import { useQuote } from "@/contexts/QuoteContext";
import { QuoteItem } from "@/types/quote";

export default function NewQuoteStep2() {
    const navigate = useNavigate();
    const { items, removeItem, updateQuantity, totalValue } = useQuote();

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

    return (
        <div className="min-h-screen bg-background-light text-text-primary flex flex-col max-w-lg mx-auto w-full border-x border-border-color pb-32">
            <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
                <div className="flex items-center p-4 justify-between w-full">
                    <button onClick={() => navigate(-1)} className="text-white flex size-10 shrink-0 items-center justify-start">
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </button>
                    <h1 className="text-white text-base font-black tracking-widest uppercase flex-1 text-center font-heading">Novo Orçamento</h1>
                    <button onClick={() => navigate("/quotes")} className="flex w-14 items-center justify-end">
                        <span className="hover:text-red-400 text-[10px] font-black tracking-widest transition-colors text-white/80">CANCELAR</span>
                    </button>
                </div>
                <div className="px-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white text-xs font-black tracking-widest uppercase font-heading opacity-80">Itens do Orçamento</p>
                        <p className="text-white/70 text-[10px] font-black font-mono">PASSO 2/3</p>
                    </div>
                    <div className="w-full bg-white/20 h-1.5 rounded-none overflow-hidden">
                        <div className="bg-accent h-full w-2/3"></div>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                <section>
                    <h2 className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 font-heading">
                        <span className="material-symbols-outlined text-primary text-xl">list_alt</span>
                        Itens Selecionados
                    </h2>
                    <div className="space-y-3">
                        {items.length === 0 ? (
                            <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-none bg-gray-50">
                                <p className="text-text-muted text-sm font-bold uppercase tracking-wider">Nenhum item adicionado</p>
                            </div>
                        ) : (
                            items.map((item, index) => (
                                <SelectedEntry
                                    key={`${item.catalogItem.id}-${index}`}
                                    type={item.catalogItem.category === 'servicos' ? 'Serviço' : 'Material'}
                                    name={item.catalogItem.name}
                                    quantity={item.quantity}
                                    unit={item.catalogItem.unit}
                                    unitPrice={item.catalogItem.price}
                                    totalPrice={item.catalogItem.price * item.quantity}
                                    border={item.catalogItem.category === 'servicos'}
                                    onIncrease={() => handleQuantityChange(item.catalogItem.id, item.quantity, 1)}
                                    onDecrease={() => handleQuantityChange(item.catalogItem.id, item.quantity, -1)}
                                    onRemove={() => removeItem(item.catalogItem.id)}
                                />
                            ))
                        )}

                        <button
                            onClick={() => navigate('/catalog', { state: { fromQuote: true } })}
                            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 bg-white/50 rounded-none p-4 text-text-muted hover:border-primary hover:text-primary transition-all group"
                        >
                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_circle</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Adicionar Item do Catálogo</span>
                        </button>
                    </div>
                </section>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border-color shadow-[0_-10px_20px_rgba(0,0,0,0.05)] max-w-lg mx-auto">
                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-text-muted">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] font-heading">Subtotal Materiais</span>
                            <span className="font-mono text-sm font-bold">R$ {subtotalMaterials.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-text-muted">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] font-heading">Subtotal Serviços</span>
                            <span className="font-mono text-sm font-bold">R$ {subtotalServices.toFixed(2)}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-100 flex justify-between items-center gap-2">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em] font-heading">Total Estimado</span>
                            <span className="font-mono text-xl font-black text-primary">R$ {totalValue.toFixed(2)}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/quotes/new/step-3")}
                        className="w-full bg-safety-yellow hover:bg-yellow-400 text-primary flex items-center justify-center gap-3 h-14 rounded-none font-black text-sm uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all border-b-4 border-yellow-600 active:border-b-0"
                    >
                        <span className="material-symbols-outlined font-bold">visibility</span>
                        Revisar e Finalizar
                    </button>
                </div>
            </footer>
        </div>
    );
}

interface SelectedEntryProps {
    type: string;
    name: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    border?: boolean;
    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;
}

function SelectedEntry({ type, name, quantity, unit, unitPrice, totalPrice, border, onIncrease, onDecrease, onRemove }: SelectedEntryProps) {
    return (
        <div className={`group relative flex flex-col gap-3 rounded-none bg-white p-4 border ${border ? "border-l-4 border-l-primary border-slate-200" : "border-slate-200"} hover:border-primary/50 transition-all shadow-sm`}>
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest font-heading">{type}</span>
                    <p className="text-text-primary text-base font-bold leading-tight uppercase font-heading">{name}</p>
                    <p className="text-text-muted text-[10px] font-bold uppercase tracking-tighter">R$ {unitPrice.toFixed(2)}/{unit}</p>
                </div>
                <button
                    onClick={onRemove}
                    className="flex h-8 w-8 items-center justify-center rounded-none bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors self-start"
                >
                    <span className="material-symbols-outlined text-lg">delete</span>
                </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
                <div className="flex items-center border border-border-color bg-white h-8">
                    <button
                        onClick={onDecrease}
                        className="w-8 h-full flex items-center justify-center text-primary hover:bg-gray-100 active:bg-gray-200 transition-colors border-r border-border-color"
                    >
                        <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <div className="px-3 min-w-[3rem] h-full flex items-center justify-center bg-gray-50">
                        <span className="text-xs font-mono font-bold">{quantity}</span>
                        <span className="text-[9px] text-text-muted ml-1 font-bold uppercase">{unit}</span>
                    </div>
                    <button
                        onClick={onIncrease}
                        className="w-8 h-full flex items-center justify-center text-primary hover:bg-gray-100 active:bg-gray-200 transition-colors border-l border-border-color"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                </div>
                <p className="font-mono font-black text-primary text-lg">R$ {totalPrice.toFixed(2)}</p>
            </div>
        </div>
    );
}
