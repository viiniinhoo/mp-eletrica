"use client";

import { motion } from "framer-motion";
import { BottomNav } from "@/components/Navigation";
import Link from "next/link";

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-background-light text-text-primary flex flex-col pb-24 max-w-lg mx-auto w-full border-x border-border-color shadow-xl">
            <header className="sticky top-0 z-10 flex items-center bg-white border-b border-gray-200 px-4 py-4 justify-between">
                <Link href="/" className="text-primary flex size-10 shrink-0 items-center cursor-pointer">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-primary text-sm font-bold leading-tight tracking-widest uppercase flex-1 text-center font-heading">Ajustes e Perfil</h1>
                <div className="size-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto">
                <section className="flex flex-col items-center py-8 px-6 bg-white border-b border-gray-100">
                    <div className="relative group">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full border-4 border-primary/10 w-28 h-28 overflow-hidden"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuArQkLl7BwmULRlPAQq7s-dCNRRXgHvKEv4hWQ8P7UlwbI2ahsizrH5I8SRnStHpVsaUwRkgkQzx8mgxbeSWWhXg4Shf3Rdz62gb1-9hWOLq0dxd-a_o1jdB3AwyKRjksF6scEgv0GFfcd2zVYgP5ITKuCD4RVNjr63arU-lgBSMAyWqTtOO7X-n1TQFMS-hs29AvhKYoTAStsQB89BFMTeB0XjrNRse1Bm6mOg1hi8WVh4h6XknVer3GZRNzln0uZvtauhxERFMMn3")' }}
                        >
                        </div>
                        <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">edit</span>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <h2 className="text-primary text-2xl font-black font-heading tracking-tight uppercase">Carlos Eduardo</h2>
                        <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mt-1">Engenheiro Elétrico</p>
                    </div>
                </section>

                <ProfileGroup title="Conta">
                    <ProfileLink icon="person" label="Editar Perfil" />
                    <ProfileLink icon="lock" label="Alterar Senha" />
                </ProfileGroup>

                <ProfileGroup title="Negócios">
                    <ProfileLink icon="business" label="Dados da Empresa" />
                    <ProfileLink icon="inventory_2" label="Itens de Serviço (Catálogo)" href="/catalog" />
                </ProfileGroup>

                <ProfileGroup title="Preferências">
                    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0 bg-white">
                        <span className="material-symbols-outlined text-primary">notifications</span>
                        <span className="flex-1 font-bold text-gray-700 text-sm uppercase tracking-tight">Notificações</span>
                        <div className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer">
                            <div className="absolute right-0.5 top-0.5 bg-primary w-4 h-4 rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0 bg-white">
                        <span className="material-symbols-outlined text-primary">dark_mode</span>
                        <span className="flex-1 font-bold text-gray-700 text-sm uppercase tracking-tight">Modo Escuro</span>
                        <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                            <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full border border-gray-300"></div>
                        </div>
                    </div>
                    <ProfileLink icon="language" label="Idioma" sublabel="Português (Brasil)" />
                </ProfileGroup>

                <div className="px-6 py-8">
                    <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-danger text-danger font-black font-heading uppercase tracking-widest hover:bg-danger/5 transition-colors">
                        <span className="material-symbols-outlined">logout</span>
                        Sair da Conta
                    </button>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}

function ProfileGroup({ title, children }: any) {
    return (
        <div className="pt-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 pb-2 font-heading">{title}</h3>
            <div className="flex flex-col border-y border-gray-100 bg-white shadow-sm">
                {children}
            </div>
        </div>
    );
}

function ProfileLink({ icon, label, sublabel, href = "#" }: any) {
    return (
        <Link href={href} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
            <span className="material-symbols-outlined text-primary">{icon}</span>
            <div className="flex-1">
                <p className="font-bold text-gray-700 text-sm uppercase tracking-tight">{label}</p>
                {sublabel && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{sublabel}</p>}
            </div>
            <span className="material-symbols-outlined text-gray-300">chevron_right</span>
        </Link>
    );
}
