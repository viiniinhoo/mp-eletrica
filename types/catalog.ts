export type UnitOfMeasure = 'metro' | 'unid' | 'rolo' | 'ponto' | 'visita';

export type CatalogCategory =
    | 'fios_cabos'
    | 'iluminacao'
    | 'disjuntores'
    | 'ferramentas'
    | 'servicos';

export interface CatalogItem {
    id: string;
    name: string;
    brand: string;
    price: number;
    unit: UnitOfMeasure;
    category: CatalogCategory;
    icon?: string;
}

export type CatalogTab = 'materials' | 'services';
