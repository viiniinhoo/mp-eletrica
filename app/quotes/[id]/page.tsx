import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuotes } from "@/hooks/useQuotes";
import { useEffect, useState } from "react";
import type { Quote } from "@/types/quote";
import { QuoteItem } from "@/types/quote";

interface QuoteWithItems extends Quote {
    items: QuoteItem[];
}

export default function QuoteDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { fetchQuoteDetails, loading: quotesLoading, updateQuoteStatus } = useQuotes();
    const [quote, setQuote] = useState<QuoteWithItems | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const loadQuote = async () => {
            if (!id) return;

            console.log("Iniciando carregamento do orçamento:", id);
            setLoading(true);
            try {
                const data = await fetchQuoteDetails(id);
                if (isMounted) {
                    console.log("Dados do orçamento recebidos:", data);
                    setQuote(data);
                }
            } catch (err) {
                console.error("Erro ao carregar detalhes do orçamento:", err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadQuote();
        return () => { isMounted = false; };
    }, [id, fetchQuoteDetails]);

    const handleApprove = async () => {
        if (!id || !quote) return;
        if (confirm("Deseja aprovar este orçamento?")) {
            const result = await updateQuoteStatus(id, "approved");
            if (result.success) {
                // Refresh data
                const data = await fetchQuoteDetails(id);
                setQuote(data);
            } else {
                alert("Erro ao aprovar: " + result.error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center">
                <div className="animate-spin material-symbols-outlined text-4xl text-primary">sync</div>
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="min-h-screen bg-background-light flex flex-col items-center justify-center p-8 text-center">
                <span className="material-symbols-outlined text-6xl text-text-muted mb-4">search_off</span>
                <h1 className="text-xl font-bold text-primary uppercase mb-2">Orçamento não encontrado</h1>
                <p className="text-text-muted mb-6">Não conseguimos localizar os detalhes deste orçamento.</p>
                <Link to="/quotes" className="bg-primary text-white px-6 py-2 uppercase font-bold text-sm">Voltar para Lista</Link>
            </div>
        );
    }

    const subtotalMaterials = quote.items
        .filter(i => i.catalogItem.category !== 'servicos')
        .reduce((acc, i) => acc + (i.catalogItem.price * i.quantity), 0);

    const subtotalServices = quote.items
        .filter(i => i.catalogItem.category === 'servicos')
        .reduce((acc, i) => acc + (i.catalogItem.price * i.quantity), 0);

    const totalValue = subtotalMaterials + subtotalServices;

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'open':
                return { label: 'Aguardando Aprovação', color: 'status-warning', icon: 'pending_actions', textColor: 'yellow-700' };
            case 'approved':
                return { label: 'Aprovado / Validado', color: 'status-success', icon: 'check_circle', textColor: 'green-700' };
            case 'completed':
                return { label: 'Concluído', color: 'primary', icon: 'task_alt', textColor: 'primary' };
            case 'cancelled':
                return { label: 'Cancelado', color: 'status-danger', icon: 'cancel', textColor: 'red-700' };
            default:
                return { label: status, color: 'gray-400', icon: 'help', textColor: 'gray-600' };
        }
    };

    const statusInfo = getStatusInfo(quote.status);

    return (
        <div className="min-h-screen bg-background-light text-text-primary px-0 font-body antialiased flex flex-col max-w-lg mx-auto w-full">
            <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 shadow-sm bg-primary">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/quotes")} className="flex items-center justify-center p-2 -ml-2 hover:bg-white/10 rounded text-white">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="font-display font-medium text-xl tracking-wide text-white uppercase">ORÇAMENTO #{id}</h1>
                </div>
                <button className="p-2 hover:bg-white/10 rounded text-white">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </header>

            <main className="flex-1 flex flex-col w-full pb-48">
                {/* Status Header */}
                <div className={`bg-${statusInfo.color}/15 border-b border-${statusInfo.color}/30 px-6 py-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-${statusInfo.color}`} style={{ fontSize: "28px" }}>{statusInfo.icon}</span>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Status Atual</span>
                            <span className={`font-display font-medium text-lg text-${statusInfo.textColor} leading-tight uppercase`}>{statusInfo.label}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block text-[10px] text-text-muted font-mono uppercase">EMISSÃO</span>
                        <span className="block text-sm font-bold text-primary font-mono uppercase">
                            {new Date(quote.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                    </div>
                </div>

                {/* Client Card */}
                <div className="p-4">
                    <div className="bg-surface border-2 border-border-color rounded-none p-4 relative shadow-[0_4px_0_0_rgba(19,39,79,0.1)]">
                        <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                            <span className="material-symbols-outlined text-4xl">business</span>
                        </div>
                        <div className="mb-4 border-b border-border-color pb-3">
                            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Cliente</h2>
                            <p className="font-display text-xl text-primary font-medium uppercase font-heading">{quote.client.name}</p>
                            <div className="flex items-center gap-1 mt-1 text-sm text-text-muted">
                                <span className="material-symbols-outlined text-[16px]">phone</span>
                                <span className="font-mono">{quote.client.phone}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Local do Serviço</h3>
                                <div className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: "18px" }}>location_on</span>
                                    <p className="text-sm text-text-primary leading-snug font-medium uppercase">
                                        {quote.client.address}
                                    </p>
                                </div>
                            </div>
                            {quote.client.locationType && (
                                <div className="inline-block self-start px-2 py-0.5 bg-gray-100 text-[10px] font-black uppercase tracking-widest text-text-muted border border-gray-200">
                                    {quote.client.locationType}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="px-4 pb-4 flex-1">
                    <div className="bg-surface border-2 border-border-color rounded-none overflow-hidden">
                        <div className="bg-primary/5 border-b border-border-color px-4 py-2 flex justify-between items-center">
                            <h3 className="font-display text-primary text-sm font-medium uppercase tracking-wide">Itens do Orçamento</h3>
                            <span className="text-[10px] font-mono text-text-muted bg-white px-1.5 py-0.5 border border-border-color uppercase">{quote.items.length} ITENS</span>
                        </div>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border-color bg-gray-50 text-[10px] uppercase tracking-wider text-text-muted font-semibold">
                                    <th className="py-2 pl-4 pr-2 w-1/2">Descrição</th>
                                    <th className="py-2 px-2 text-center w-1/6">Qtd</th>
                                    <th className="py-2 pl-2 pr-4 text-right w-1/3">Total</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {quote.items.map((item, index) => (
                                    <TableRow
                                        key={`${item.catalogItem.id}-${index}`}
                                        desc={item.catalogItem.name}
                                        details={`${item.catalogItem.category === 'servicos' ? 'Serviço' : 'Material'} - ${item.catalogItem.brand}`}
                                        qty={item.quantity}
                                        unit={item.catalogItem.unit}
                                        total={`R$ ${(item.catalogItem.price * item.quantity).toFixed(2)}`}
                                        striped={index % 2 !== 0}
                                    />
                                ))}
                            </tbody>
                        </table>
                        <div className="bg-gray-50 p-4 border-t border-border-color space-y-2">
                            <div className="flex justify-between items-center text-xs text-text-muted font-bold uppercase tracking-wider">
                                <span>Subtotal Materiais</span>
                                <span className="font-mono">R$ {subtotalMaterials.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-text-muted font-bold uppercase tracking-wider">
                                <span>Subtotal Serviços</span>
                                <span className="font-mono">R$ {subtotalServices.toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-border-color my-2"></div>
                            <div className="flex justify-between items-end pt-1">
                                <span className="font-display font-medium text-primary text-xl uppercase">Valor Total</span>
                                <span className="font-mono font-black text-primary text-2xl tracking-tight">R$ {totalValue.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-border-color p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] z-40 max-w-lg mx-auto">
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                        onClick={() => navigate(`/quotes/new/step-1`)} // Assuming edit starts here or we'd need an edit context
                        className="flex items-center justify-center gap-2 h-12 border-2 border-border-color text-text-primary font-display font-medium uppercase tracking-wide hover:bg-gray-50 transition-colors"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>edit</span>
                        <span>Editar</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 h-12 bg-primary text-white font-display font-medium uppercase tracking-wide shadow-sm hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>picture_as_pdf</span>
                        <span>Gerar PDF</span>
                    </button>
                </div>
                {quote.status === 'open' && (
                    <button
                        onClick={handleApprove}
                        className="w-full flex items-center justify-center gap-2 h-14 bg-accent text-primary font-display font-bold text-lg uppercase tracking-wider shadow-md hover:bg-yellow-400 transition-all border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1"
                    >
                        <span className="material-symbols-outlined font-bold">check_circle</span>
                        <span>Aprovar Orçamento</span>
                    </button>
                )}
            </div>
        </div>
    );
}

function TableRow({ desc, details, qty, unit, total, striped }: any) {
    return (
        <tr className={`border-b border-border-color/50 ${striped ? "bg-background-light" : ""} hover:bg-yellow-50/50`}>
            <td className="py-3 pl-4 pr-2">
                <p className="font-bold text-primary leading-tight uppercase font-heading">{desc}</p>
                <p className="text-[10px] text-text-muted mt-0.5 uppercase font-bold tracking-tighter">{details}</p>
            </td>
            <td className="py-3 px-2 text-center">
                <span className="font-mono text-xs font-bold text-text-primary block">{qty}</span>
                <span className="text-[9px] text-text-muted uppercase font-bold">{unit}</span>
            </td>
            <td className="py-3 pl-2 pr-4 text-right font-mono font-black text-primary">{total}</td>
        </tr>
    );
}
