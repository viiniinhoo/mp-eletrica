import { useNavigate, useParams, Link } from "react-router-dom";

export default function QuoteDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    return (
        <div className="min-h-screen bg-background-light text-text-primary px-0 font-body antialiased flex flex-col max-w-lg mx-auto w-full">
            <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 shadow-sm bg-primary">
                <div className="flex items-center gap-3">
                    <Link to="/quotes" className="flex items-center justify-center p-2 -ml-2 hover:bg-white/10 rounded text-white">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <h1 className="font-display font-medium text-xl tracking-wide text-white uppercase">ORÇAMENTO #{id}</h1>
                </div>
                <button className="p-2 hover:bg-white/10 rounded text-white">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </header>

            <main className="flex-1 flex flex-col w-full pb-48">
                {/* Status Header */}
                <div className="bg-status-warning/15 border-b border-status-warning/30 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-status-warning" style={{ fontSize: "28px" }}>pending_actions</span>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-status-warning/80">Status Atual</span>
                            <span className="font-display font-medium text-lg text-yellow-700 leading-tight uppercase">Aguardando Aprovação</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block text-[10px] text-text-muted font-mono">EMISSÃO</span>
                        <span className="block text-sm font-bold text-primary font-mono">12/OUT</span>
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
                            <p className="font-display text-xl text-primary font-medium">Construtora Silva & Filhos</p>
                            <div className="flex items-center gap-1 mt-1 text-sm text-text-muted">
                                <span className="material-symbols-outlined text-[16px]">id_card</span>
                                <span>CNPJ: 12.345.678/0001-90</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Local do Serviço</h3>
                                <div className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: "18px" }}>location_on</span>
                                    <p className="text-sm text-text-primary leading-snug font-medium">
                                        Rua das Indústrias, 450 - Galpão B<br />
                                        Distrito Industrial, São Paulo - SP
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="px-4 pb-4 flex-1">
                    <div className="bg-surface border-2 border-border-color rounded-none overflow-hidden">
                        <div className="bg-primary/5 border-b border-border-color px-4 py-2 flex justify-between items-center">
                            <h3 className="font-display text-primary text-sm font-medium uppercase tracking-wide">Itens do Orçamento</h3>
                            <span className="text-[10px] font-mono text-text-muted bg-white px-1.5 py-0.5 border border-border-color">5 ITENS</span>
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
                                <TableRow desc="Instalação Padrão Trifásico" details="Mão de obra especializada" qty="1" total="R$ 1.200,00" />
                                <TableRow desc="Cabo 16mm (Metro)" details="Material - Cobrecom" qty="40" total="R$ 800,00" striped />
                                <TableRow desc="Disjuntor DIN 63A" details="Material - Siemens" qty="1" total="R$ 85,00" />
                            </tbody>
                        </table>
                        <div className="bg-gray-50 p-4 border-t border-border-color space-y-2">
                            <summary className="flex justify-between items-center text-xs text-text-muted list-none">
                                <span>Subtotal Materiais</span>
                                <span className="font-mono">R$ 1.030,90</span>
                            </summary>
                            <div className="flex justify-between items-center text-xs text-text-muted font-medium">
                                <span>Desconto (Pagamento à vista)</span>
                                <span className="font-mono text-status-success">- R$ 115,45</span>
                            </div>
                            <div className="h-px bg-border-color my-2"></div>
                            <div className="flex justify-between items-end pt-1">
                                <span className="font-display font-medium text-primary text-xl uppercase">Valor Total</span>
                                <span className="font-mono font-bold text-primary text-2xl tracking-tight">R$ 2.115,45</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-surface border-t-2 border-border-color p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 max-w-lg mx-auto">
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <button className="flex items-center justify-center gap-2 h-12 border-2 border-border-color text-text-primary font-display font-medium uppercase tracking-wide hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>edit</span>
                        <span>Editar</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 h-12 bg-primary text-white font-display font-medium uppercase tracking-wide shadow-sm hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>picture_as_pdf</span>
                        <span>Gerar PDF</span>
                    </button>
                </div>
                <button className="w-full flex items-center justify-center gap-2 h-14 bg-accent text-primary font-display font-bold text-lg uppercase tracking-wider shadow-md hover:bg-accent/90 transition-all border-b-4 border-yellow-500 active:border-b-0 active:translate-y-1">
                    <span className="material-symbols-outlined font-bold">check_circle</span>
                    <span>Aprovar Orçamento</span>
                </button>
            </div>
        </div>
    );
}

function TableRow({ desc, details, qty, total, striped }: any) {
    return (
        <tr className={`border-b border-border-color/50 ${striped ? "bg-background-light" : ""} hover:bg-yellow-50/50`}>
            <td className="py-3 pl-4 pr-2">
                <p className="font-medium text-primary leading-tight">{desc}</p>
                <p className="text-xs text-text-muted mt-0.5">{details}</p>
            </td>
            <td className="py-3 px-2 text-center font-mono text-text-muted">{qty}</td>
            <td className="py-3 pl-2 pr-4 text-right font-mono font-bold text-primary">{total}</td>
        </tr>
    );
}
