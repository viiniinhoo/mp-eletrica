
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NewCatalogItem() {
    const navigate = useNavigate();
    const [type, setType] = useState("material");

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
                {/* Toggle Tabs */}
                <div className="flex w-full bg-gray-100 p-1 border border-border-color">
                    <button
                        onClick={() => setType("material")}
                        className={`flex-1 flex h-12 items-center justify-center text-xs font-black tracking-[0.2em] transition-all uppercase ${type === "material" ? "bg-primary text-white shadow-md" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        Material
                    </button>
                    <button
                        onClick={() => setType("service")}
                        className={`flex-1 flex h-12 items-center justify-center text-xs font-black tracking-[0.2em] transition-all uppercase ${type === "service" ? "bg-primary text-white shadow-md" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        Serviço
                    </button>
                </div>

                {/* Registration Form */}
                <div className="flex flex-col space-y-5">
                    <InputGroup label="Nome do Item" placeholder="Ex: Cabo Flexível 2.5mm" />

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Categoria</label>
                        <div className="relative">
                            <select id="category" name="category" defaultValue="" className="w-full h-14 border border-border-color bg-white px-4 text-sm font-bold uppercase tracking-tight appearance-none focus:border-primary rounded-none pr-12 outline-none">
                                <option value="" disabled>Selecione a categoria</option>
                                <option value="fios_cabos">Fios e Cabos</option>
                                <option value="iluminacao">Iluminação</option>
                                <option value="disjuntores">Disjuntores e Proteção</option>
                                <option value="ferramentas">Ferramentas Elétricas</option>
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
                            <select id="unit" name="unit" defaultValue="unid" className="w-full h-14 border border-border-color bg-white px-4 text-sm font-bold uppercase tracking-tight appearance-none focus:border-primary rounded-none outline-none">
                                <option value="metro">Metro</option>
                                <option value="unid">Unid</option>
                                <option value="rolo">Rolo</option>
                                <option value="ponto">Ponto</option>
                                <option value="visita">Visita</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Preço Unitário</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none bg-gray-50 border-r border-border-color pr-3">
                                    <span className="text-xs font-black text-primary">R$</span>
                                </div>
                                <input className="w-full h-14 border border-border-color bg-white pl-14 pr-4 text-sm font-black focus:border-primary rounded-none outline-none font-mono" placeholder="0,00" type="number" step="0.01" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Descrição Técnica</label>
                        <textarea className="w-full border border-border-color bg-white p-4 text-sm font-bold focus:border-primary rounded-none resize-none outline-none uppercase tracking-tight" placeholder="Insira detalhes como cor, marca ou especificações..." rows={4}></textarea>
                    </div>

                    <div className="flex flex-col gap-2 pb-8">
                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Foto do Item</label>
                        <div className="border-2 border-dashed border-gray-300 h-32 flex flex-col items-center justify-center bg-gray-50 rounded-none cursor-pointer group hover:bg-gray-100 transition-colors">
                            <span className="material-symbols-outlined text-gray-400 text-4xl group-hover:text-primary mb-1">add_a_photo</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Adicionar Imagem Técnica</span>
                        </div>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 border-t border-border-color z-[60] max-w-lg mx-auto">
                <button
                    onClick={() => navigate("/catalog")}
                    className="w-full h-16 bg-safety-yellow hover:bg-yellow-400 flex items-center justify-center gap-2 rounded-none shadow-lg active:scale-[0.98] transition-all border-b-4 border-yellow-600 active:border-b-0"
                >
                    <span className="material-symbols-outlined text-primary font-black">save</span>
                    <span className="text-primary text-lg font-black font-heading tracking-[0.2em] uppercase">Salvar no Catálogo</span>
                </button>
            </div>
        </div>
    );
}

function InputGroup({ label, placeholder }: any) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{label}</label>
            <input
                className="w-full h-14 border border-border-color bg-white px-4 text-sm font-bold uppercase tracking-tight focus:border-primary rounded-none transition-all outline-none"
                placeholder={placeholder}
                type="text"
            />
        </div>
    );
}
