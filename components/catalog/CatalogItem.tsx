interface CatalogItemProps {
    name: string;
    brand: string;
    price: string;
    unit: string;
    icon: string;
    onClick?: () => void;
}

export function CatalogItem({ name, brand, price, unit, icon, onClick }: CatalogItemProps) {
    return (
        <div
            onClick={onClick}
            className="group relative flex items-center p-4 hover:bg-gray-50 transition-colors active:bg-gray-100 cursor-pointer border-b border-border-color last:border-0"
        >
            <div className="h-10 w-10 shrink-0 bg-primary/5 border border-primary/10 flex items-center justify-center mr-4">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>{icon}</span>
            </div>
            <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-text-primary font-bold text-sm truncate leading-tight uppercase font-heading">{name}</h3>
                <p className="text-text-muted text-[10px] font-bold mt-0.5 uppercase tracking-tighter">{brand}</p>
            </div>
            <div className="text-right shrink-0">
                <span className="block font-mono font-bold text-text-primary text-sm tracking-tight">{price}</span>
                <span className="block text-[10px] text-text-muted uppercase font-black tracking-tighter">/{unit}</span>
            </div>
        </div>
    );
}
