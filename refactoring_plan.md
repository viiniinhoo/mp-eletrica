# Plano de Implementação: Refatoração e Fluxo de Orçamento

Este plano aborda a refatoração do sistema para eliminar `any`, criar um contexto para o fluxo de orçamento e extrair componentes reutilizáveis.

## 1. Refatoração de Tipos (Type Safety)

**Objetivo**: Eliminar o uso de `any` e garantir segurança de tipos em todo o projeto.

- [ ] **Criar pasta `types/`**:
    - [ ] `types/quote.ts`: Definir interfaces `Quote`, `QuoteItem`, `Client`, `QuoteStatus`.
    - [ ] `types/catalog.ts`: Definir interfaces `CatalogItem`, `CatalogCategory`, `UnitOfMeasure`.
    - [ ] `types/dashboard.ts`: Definir interfaces `KPI`, `ActivityLog`.
- [ ] **Atualizar Componentes**:
    - [ ] `StatCard` (Dashboard)
    - [ ] `ActivityItem` (Dashboard)
    - [ ] `QuoteCard` (Quotes List)
    - [ ] `CatalogItem` (Catalog List)
    - [ ] `SelectedEntry` (Quote Step 2)
    - [ ] `ReviewRow` (Quote Step 3)

## 2. Contexto de Orçamento (State Management)

**Objetivo**: Persistir dados entre os passos do orçamento (1 -> 2 -> 3) sem perder informações.

- [ ] **Criar `contexts/QuoteContext.tsx`**:
    - [ ] Definir estado inicial: `clientData`, `items`, `totalValue`.
    - [ ] Criar Provider e Hook personalizados (`useQuote`).
    - [ ] Implementar funções: `updateClientData`, `addItem`, `removeItem`, `clearQuote`.
- [ ] **Integrar nas Páginas**:
    - [ ] `app/layout.tsx`: Envolver a aplicação com `QuoteProvider` (ou apenas nas rotas `/quotes/new`).
    - [ ] `app/quotes/new/step-1`: Ler/Escrever `clientData`.
    - [ ] `app/quotes/new/step-2`: Ler/Escrever `items` (Adicionar/Remover do catálogo).
    - [ ] `app/quotes/new/step-3`: Ler todos os dados para exibição final.

## 3. Componentização (Clean Code)

**Objetivo**: Limpar arquivos de página gigantes e promover reutilização.

- [ ] **Criar `components/ui/`**:
    - [ ] `components/ui/StatCard.tsx`: Extrair de `app/page.tsx`.
    - [ ] `components/ui/ActivityItem.tsx`: Extrair de `app/page.tsx`.
    - [ ] `components/ui/QuoteCard.tsx`: Extrair de `app/quotes/page.tsx`.
    - [ ] `components/ui/CatalogItem.tsx`: Extrair de `app/catalog/page.tsx`.
- [ ] **Refatorar Páginas**:
    - [ ] Importar os novos componentes em `app/page.tsx`, `app/quotes/page.tsx`, etc.

## 4. Integração com Supabase (Data Fetching) - *Fase Seguinte*

*Esta etapa será realizada após a consolidação do Frontend.*

- [ ] Configurar tabelas no Supabase (`quotes`, `clients`, `catalog_items`).
- [ ] Criar Server Actions ou Hooks com React Query para buscar dados reais.
