
import { Link, useNavigate } from "react-router-dom";
import { useQuote } from "@/contexts/QuoteContext";
import { useState } from "react";
import { ClientType } from "@/types/quote";

export default function NewQuoteStep1() {
    const navigate = useNavigate();
    const { updateClientData, clientData } = useQuote();

    // Local state for form inputs, defaulting to context data if available
    const [name, setName] = useState(clientData?.name || "");
    const [address, setAddress] = useState(clientData?.address || "");
    const [phone, setPhone] = useState(clientData?.phone || "");
    const [validUntil, setValidUntil] = useState(clientData?.validUntil || "");
    const [locationType, setLocationType] = useState<ClientType>(clientData?.locationType || "casa");

    const handleNext = () => {
        if (!name || !address || !phone || !validUntil) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        updateClientData({
            name,
            address,
            phone,
            validUntil,
            locationType
        });

        navigate("/quotes/new/step-2");
    };

    return (
        <div className="min-h-screen bg-background-light text-text-primary flex flex-col max-w-lg mx-auto w-full border-x border-border-color">
            <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
                <div className="flex items-center p-4">
                    <Link to="/quotes" className="flex items-center justify-center p-2 hover:bg-white/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <h1 className="ml-4 text-xl font-bold font-heading tracking-widest uppercase">Novo Orçamento</h1>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto pb-32">
                <div className="p-4 bg-white border-b border-border-color/30">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-text-primary text-xs font-bold uppercase tracking-widest font-heading">Progresso do Orçamento</p>
                        <p className="text-primary text-[10px] font-black font-mono">Passo 1 de 3 (33%)</p>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-none overflow-hidden">
                        <div className="bg-primary h-full w-1/3"></div>
                    </div>
                </div>

                <div className="px-4 py-6 space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-primary text-lg font-black font-heading border-l-4 border-primary pl-3 uppercase">Dados do Cliente</h3>
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Nome do Cliente</label>
                                <input
                                    className="w-full h-12 px-4 border border-border-color bg-white focus:ring-2 focus:ring-primary focus:border-primary rounded-none transition-all outline-none text-sm font-semibold"
                                    placeholder="Digite o nome completo"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <div className="flex justify-between items-end mb-1">
                                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Endereço</label>
                                    <button className="text-[9px] font-black text-primary flex items-center hover:underline uppercase tracking-tighter">
                                        <span className="material-symbols-outlined text-[14px] mr-1">my_location</span>
                                        Usar Local Atual
                                    </button>
                                </div>
                                <div className="relative flex">
                                    <input
                                        className="w-full h-12 pl-4 pr-12 border border-border-color bg-white focus:ring-2 focus:ring-primary focus:border-primary rounded-none transition-all outline-none text-sm font-semibold"
                                        placeholder="Rua, número, bairro e cidade"
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                    <div className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-primary/60">
                                        <span className="material-symbols-outlined">map</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Telefone</label>
                                    <input
                                        className="w-full h-12 px-4 border border-border-color bg-white focus:ring-2 focus:ring-primary focus:border-primary rounded-none transition-all outline-none text-sm font-mono font-bold"
                                        placeholder="(00) 00000-0000"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Validade</label>
                                    <input
                                        className="w-full h-12 px-4 border border-border-color bg-white focus:ring-2 focus:ring-primary focus:border-primary rounded-none transition-all outline-none text-sm font-mono font-bold"
                                        type="date"
                                        value={validUntil}
                                        onChange={(e) => setValidUntil(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-primary text-lg font-black font-heading border-l-4 border-primary pl-3 uppercase">Tipo de Local</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <TypeOption id="casa" label="Casa" icon="home" active={locationType === 'casa'} onClick={() => setLocationType('casa')} />
                            <TypeOption id="apartamento" label="Apartamento" icon="apartment" active={locationType === 'apartamento'} onClick={() => setLocationType('apartamento')} />
                            <TypeOption id="loja" label="Loja" icon="storefront" active={locationType === 'loja'} onClick={() => setLocationType('loja')} />
                            <TypeOption id="empresa" label="Empresa" icon="business" active={locationType === 'empresa'} onClick={() => setLocationType('empresa')} />
                        </div>
                    </section>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white p-4 border-t border-border-color shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-[60]">
                <button
                    onClick={handleNext}
                    className="w-full bg-accent hover:bg-yellow-400 active:scale-[0.98] transition-all text-primary py-4 rounded-none font-black font-heading text-lg tracking-widest flex items-center justify-center uppercase shadow-md border-b-4 border-yellow-600 active:border-b-0"
                >
                    Próximo Passo
                    <span className="material-symbols-outlined ml-2">chevron_right</span>
                </button>
            </footer>
        </div>
    );
}

interface TypeOptionProps {
    label: string;
    icon: string;
    active: boolean;
    id: ClientType;
    onClick: () => void;
}

function TypeOption({ label, icon, active, onClick }: TypeOptionProps) {
    return (
        <label className="cursor-pointer group" onClick={onClick}>
            <input type="radio" name="local_type" className="hidden peer" checked={active} readOnly />
            <div className={`flex flex-col items-center justify-center p-4 border transition-all hover:bg-gray-50 rounded-none ${active ? 'border-primary/40 bg-primary/5' : 'border-gray-200 bg-white'}`}>
                <span className="material-symbols-outlined text-3xl mb-1.5 text-primary/80 group-hover:scale-110 transition-transform">{icon}</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{label}</span>
            </div>
        </label>
    );
}
