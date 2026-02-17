"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: "Início", icon: "home", href: "/" },
        { label: "Orçamentos", icon: "description", href: "/quotes" },
        { label: "Catálogo", icon: "inventory_2", href: "/catalog" },
        { label: "Perfil", icon: "person", href: "/profile" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-surface border-t border-border-color flex justify-between px-6 pb-4 pt-2 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center ${isActive ? "text-primary" : "text-text-muted"} group`}>
                        <div className={`flex h-8 items-center justify-center ${isActive ? "" : "group-hover:text-primary"} transition-colors`}>
                            <span className={`material-symbols-outlined text-2xl ${isActive ? "filled" : ""}`}>{item.icon}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

export function FloatingActionButton({ href = "/quotes/new/step-1" }: { href?: string }) {
    return (
        <Link href={href} className="fixed bottom-24 right-4 h-14 w-14 bg-accent rounded-full shadow-fab flex items-center justify-center text-primary z-20 hover:scale-105 active:scale-95 transition-transform border-2 border-primary/10">
            <span className="material-symbols-outlined text-3xl font-bold">add</span>
        </Link>
    );
}
