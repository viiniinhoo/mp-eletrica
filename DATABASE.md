# 📦 Banco de Dados Supabase - MP Elétrica

## ✅ Arquivos Criados

### 📄 Configuração do Banco
- **`supabase/schema.sql`** - Schema completo do banco de dados
- **`supabase/README.md`** - Documentação detalhada
- **`supabase/QUICKSTART.md`** - Guia rápido de configuração

### 🔧 Configuração do Projeto
- **`lib/supabase.ts`** - Cliente Supabase configurado
- **`.env.example`** - Template de variáveis de ambiente

### 🎣 Hooks Personalizados
- **`hooks/useQuotes.ts`** - Gerenciamento de orçamentos
- **`hooks/useCatalog.ts`** - Gerenciamento do catálogo

## 🗄️ Estrutura do Banco

### Tabelas Criadas

```
clients (Clientes)
├── id (UUID)
├── name (VARCHAR)
├── phone (VARCHAR)
├── address (TEXT)
├── location_type (ENUM)
└── timestamps

catalog_items (Catálogo)
├── id (UUID)
├── name (VARCHAR)
├── brand (VARCHAR)
├── price (DECIMAL)
├── unit (ENUM)
├── category (ENUM)
├── icon (VARCHAR)
├── is_active (BOOLEAN)
└── timestamps

quotes (Orçamentos)
├── id (UUID)
├── quote_number (VARCHAR) - Auto-gerado
├── client_id (FK → clients)
├── status (ENUM)
├── valid_until (DATE)
├── total_value (DECIMAL) - Auto-calculado
└── timestamps

quote_items (Itens do Orçamento)
├── id (UUID)
├── quote_id (FK → quotes)
├── catalog_item_id (FK → catalog_items)
├── quantity (DECIMAL)
├── unit_price (DECIMAL)
└── subtotal (DECIMAL) - Auto-calculado
```

## 🚀 Como Usar

### 1. Configurar Supabase

Siga o guia em `supabase/QUICKSTART.md` ou `supabase/README.md`.

### 2. Usar os Hooks

#### Exemplo: Listar Orçamentos

```tsx
import { useQuotes } from '@/hooks/useQuotes';

function QuotesList() {
    const { quotes, loading, error } = useQuotes();

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <div>
            {quotes.map(quote => (
                <div key={quote.id}>
                    <h3>Orçamento #{quote.id}</h3>
                    <p>Cliente: {quote.client.name}</p>
                    <p>Status: {quote.status}</p>
                </div>
            ))}
        </div>
    );
}
```

#### Exemplo: Criar Orçamento

```tsx
import { useQuotes } from '@/hooks/useQuotes';

function CreateQuote() {
    const { createQuote } = useQuotes();

    const handleSubmit = async () => {
        const result = await createQuote(
            {
                name: 'João Silva',
                phone: '11999999999',
                address: 'Rua Exemplo, 123',
                validUntil: '2026-03-17',
                locationType: 'casa',
            },
            [
                {
                    catalogItem: {
                        id: 'uuid-do-item',
                        name: 'Cabo Flexível',
                        // ... outros campos
                    },
                    quantity: 10,
                }
            ]
        );

        if (result.success) {
            console.log('Orçamento criado:', result.quoteId);
        } else {
            console.error('Erro:', result.error);
        }
    };

    return <button onClick={handleSubmit}>Criar Orçamento</button>;
}
```

#### Exemplo: Buscar no Catálogo

```tsx
import { useCatalog } from '@/hooks/useCatalog';

function CatalogSearch() {
    const { items, searchItems, loading } = useCatalog();

    const handleSearch = (term: string) => {
        searchItems(term);
    };

    return (
        <div>
            <input 
                type="text" 
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar item..."
            />
            {loading ? (
                <div>Buscando...</div>
            ) : (
                <div>
                    {items.map(item => (
                        <div key={item.id}>
                            <h4>{item.name}</h4>
                            <p>{item.brand} - R$ {item.price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
```

## 🎯 Funcionalidades Implementadas

### ✨ Automações
- ✅ Numeração automática de orçamentos (formato: 000126)
- ✅ Cálculo automático de subtotais
- ✅ Cálculo automático do total do orçamento
- ✅ Timestamps automáticos (created_at, updated_at)

### 🔒 Segurança
- ✅ Row Level Security (RLS) ativado
- ✅ Políticas de acesso configuradas
- ✅ Validação de dados no banco

### 🔍 Otimizações
- ✅ Índices para buscas rápidas
- ✅ Views para consultas complexas
- ✅ Busca full-text em português

### 📊 Dados Iniciais
- ✅ 6 itens pré-cadastrados no catálogo

## 📝 Próximos Passos

### Integração com o Frontend

1. **Substituir dados mockados**
   - Atualizar `QuoteContext` para usar `useQuotes`
   - Atualizar páginas de catálogo para usar `useCatalog`

2. **Implementar autenticação**
   - Adicionar login/registro de usuários
   - Configurar políticas RLS por usuário

3. **Adicionar mais funcionalidades**
   - Histórico de alterações
   - Exportação de orçamentos em PDF
   - Dashboard com estatísticas

### Melhorias no Banco

1. **Adicionar tabelas**
   - `users` - Usuários do sistema
   - `audit_logs` - Log de alterações
   - `settings` - Configurações do sistema

2. **Implementar**
   - Backup automático
   - Replicação de dados
   - Monitoramento de performance

## 🆘 Suporte

### Problemas Comuns

**Erro de conexão**
```
⚠️ Supabase environment variables not configured
```
→ Verifique se o arquivo `.env.local` existe e está configurado corretamente.

**Erro ao executar SQL**
```
relation "xxx" already exists
```
→ O schema já foi executado. Se quiser recriar, delete as tabelas primeiro.

**Dados não aparecem**
```
Error: No rows returned
```
→ Verifique as políticas RLS e se o usuário está autenticado.

## 📚 Recursos

- [Documentação Completa](./supabase/README.md)
- [Guia Rápido](./supabase/QUICKSTART.md)
- [Schema SQL](./supabase/schema.sql)
- [Supabase Docs](https://supabase.com/docs)

---

**Desenvolvido para MP Elétrica** • 17/02/2026
