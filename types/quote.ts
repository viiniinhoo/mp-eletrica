import { CatalogItem } from './catalog';

export type QuoteStatus = 'open' | 'approved' | 'completed' | 'cancelled';
export type ClientType = 'casa' | 'apartamento' | 'loja' | 'empresa';

export interface ClientData {
    name: string;
    address: string;
    phone: string;
    validUntil: string; // ISO date string
    locationType: ClientType;
}

export interface QuoteItem {
    catalogItem: CatalogItem;
    quantity: number;
}

export interface Quote {
    id: string; // e.g., #2304
    client: ClientData;
    items: QuoteItem[];
    status: QuoteStatus;
    createdAt: string; // ISO date string
}

export interface DraftQuote {
    client?: Partial<ClientData>;
    items: QuoteItem[];
}
