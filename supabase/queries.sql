-- ============================================================================
-- QUERIES ÚTEIS - MP Elétrica
-- ============================================================================
-- Copie e cole estas queries no SQL Editor do Supabase para consultas rápidas

-- ============================================================================
-- CONSULTAS BÁSICAS
-- ============================================================================

-- Ver todos os clientes
SELECT * FROM clients ORDER BY created_at DESC;

-- Ver todos os itens do catálogo ativos
SELECT * FROM catalog_items WHERE is_active = true ORDER BY category, name;

-- Ver todos os orçamentos
SELECT * FROM quotes ORDER BY created_at DESC;

-- ============================================================================
-- CONSULTAS COM JOINS
-- ============================================================================

-- Orçamentos com informações do cliente
SELECT 
    q.quote_number,
    q.status,
    q.total_value,
    q.valid_until,
    c.name as client_name,
    c.phone as client_phone
FROM quotes q
JOIN clients c ON q.client_id = c.id
ORDER BY q.created_at DESC;

-- Itens de um orçamento específico
SELECT 
    qi.quantity,
    qi.unit_price,
    qi.subtotal,
    ci.name as item_name,
    ci.brand,
    ci.unit
FROM quote_items qi
JOIN catalog_items ci ON qi.catalog_item_id = ci.id
WHERE qi.quote_id = 'UUID_DO_ORCAMENTO_AQUI'
ORDER BY ci.name;

-- ============================================================================
-- ESTATÍSTICAS
-- ============================================================================

-- Total de orçamentos por status
SELECT 
    status,
    COUNT(*) as total,
    SUM(total_value) as valor_total
FROM quotes
GROUP BY status
ORDER BY total DESC;

-- Itens mais vendidos
SELECT 
    ci.name,
    ci.brand,
    COUNT(qi.id) as vezes_vendido,
    SUM(qi.quantity) as quantidade_total,
    SUM(qi.subtotal) as valor_total
FROM quote_items qi
JOIN catalog_items ci ON qi.catalog_item_id = ci.id
GROUP BY ci.id, ci.name, ci.brand
ORDER BY vezes_vendido DESC
LIMIT 10;

-- Clientes com mais orçamentos
SELECT 
    c.name,
    c.phone,
    COUNT(q.id) as total_orcamentos,
    SUM(q.total_value) as valor_total
FROM clients c
JOIN quotes q ON c.id = q.client_id
GROUP BY c.id, c.name, c.phone
ORDER BY total_orcamentos DESC
LIMIT 10;

-- Faturamento por mês
SELECT 
    TO_CHAR(created_at, 'YYYY-MM') as mes,
    COUNT(*) as total_orcamentos,
    SUM(total_value) as faturamento
FROM quotes
WHERE status IN ('approved', 'completed')
GROUP BY TO_CHAR(created_at, 'YYYY-MM')
ORDER BY mes DESC;

-- ============================================================================
-- BUSCA E FILTROS
-- ============================================================================

-- Buscar cliente por nome ou telefone
SELECT * FROM clients 
WHERE name ILIKE '%João%' OR phone LIKE '%999%'
ORDER BY name;

-- Buscar item no catálogo
SELECT * FROM catalog_items 
WHERE (name ILIKE '%cabo%' OR brand ILIKE '%cabo%')
AND is_active = true
ORDER BY name;

-- Orçamentos em aberto próximos do vencimento
SELECT 
    quote_number,
    valid_until,
    total_value,
    (valid_until - CURRENT_DATE) as dias_restantes
FROM quotes
WHERE status = 'open'
AND valid_until BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY valid_until;

-- ============================================================================
-- RELATÓRIOS
-- ============================================================================

-- Relatório completo de um orçamento
SELECT 
    q.quote_number,
    q.status,
    q.created_at,
    q.valid_until,
    c.name as cliente,
    c.phone as telefone,
    c.address as endereco,
    c.location_type as tipo_local,
    ci.name as item,
    ci.brand as marca,
    qi.quantity as quantidade,
    ci.unit as unidade,
    qi.unit_price as preco_unitario,
    qi.subtotal,
    q.total_value as total_orcamento
FROM quotes q
JOIN clients c ON q.client_id = c.id
JOIN quote_items qi ON q.id = qi.quote_id
JOIN catalog_items ci ON qi.catalog_item_id = ci.id
WHERE q.quote_number = 'NUMERO_DO_ORCAMENTO_AQUI'
ORDER BY ci.name;

-- Resumo de vendas por categoria
SELECT 
    ci.category,
    COUNT(DISTINCT qi.quote_id) as orcamentos,
    SUM(qi.quantity) as quantidade_total,
    SUM(qi.subtotal) as valor_total
FROM quote_items qi
JOIN catalog_items ci ON qi.catalog_item_id = ci.id
JOIN quotes q ON qi.quote_id = q.id
WHERE q.status IN ('approved', 'completed')
GROUP BY ci.category
ORDER BY valor_total DESC;

-- ============================================================================
-- MANUTENÇÃO
-- ============================================================================

-- Verificar integridade dos dados
SELECT 
    'Clientes' as tabela,
    COUNT(*) as total
FROM clients
UNION ALL
SELECT 'Catálogo (ativos)', COUNT(*) FROM catalog_items WHERE is_active = true
UNION ALL
SELECT 'Orçamentos', COUNT(*) FROM quotes
UNION ALL
SELECT 'Itens de Orçamento', COUNT(*) FROM quote_items;

-- Verificar orçamentos com total zerado (possível erro)
SELECT 
    quote_number,
    total_value,
    (SELECT COUNT(*) FROM quote_items WHERE quote_id = q.id) as qtd_itens
FROM quotes q
WHERE total_value = 0
AND (SELECT COUNT(*) FROM quote_items WHERE quote_id = q.id) > 0;

-- Verificar itens órfãos (sem orçamento)
SELECT * FROM quote_items qi
WHERE NOT EXISTS (
    SELECT 1 FROM quotes q WHERE q.id = qi.quote_id
);

-- ============================================================================
-- LIMPEZA (USE COM CUIDADO!)
-- ============================================================================

-- Remover orçamentos cancelados antigos (mais de 6 meses)
-- DELETE FROM quotes 
-- WHERE status = 'cancelled' 
-- AND created_at < NOW() - INTERVAL '6 months';

-- Desativar itens do catálogo não utilizados
-- UPDATE catalog_items 
-- SET is_active = false 
-- WHERE id NOT IN (
--     SELECT DISTINCT catalog_item_id FROM quote_items
-- );

-- ============================================================================
-- TESTES
-- ============================================================================

-- Criar cliente de teste
INSERT INTO clients (name, phone, address, location_type)
VALUES ('Cliente Teste', '11999999999', 'Rua Teste, 123', 'casa')
RETURNING *;

-- Criar orçamento de teste
-- (Substitua CLIENT_ID_AQUI pelo ID do cliente)
INSERT INTO quotes (client_id, valid_until, status)
VALUES ('CLIENT_ID_AQUI', CURRENT_DATE + INTERVAL '30 days', 'open')
RETURNING *;

-- ============================================================================
-- BACKUP
-- ============================================================================

-- Exportar todos os dados (copie o resultado)
SELECT json_build_object(
    'clients', (SELECT json_agg(c) FROM clients c),
    'catalog_items', (SELECT json_agg(ci) FROM catalog_items ci),
    'quotes', (SELECT json_agg(q) FROM quotes q),
    'quote_items', (SELECT json_agg(qi) FROM quote_items qi)
) as backup_data;
