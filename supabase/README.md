# 🗄️ Configuração do Banco de Dados Supabase

Este guia explica como configurar o banco de dados Supabase para o sistema MP Elétrica.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Node.js instalado
- Projeto MP Elétrica clonado

## 🚀 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Clique em "New Project"
3. Preencha os dados:
   - **Name**: MP Elétrica
   - **Database Password**: Escolha uma senha forte (guarde-a!)
   - **Region**: Brazil (South America - São Paulo)
4. Clique em "Create new project"
5. Aguarde alguns minutos até o projeto ser criado

### 2. Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor** (menu lateral)
2. Clique em "New query"
3. Copie todo o conteúdo do arquivo `supabase/schema.sql`
4. Cole no editor SQL
5. Clique em "Run" (ou pressione Ctrl+Enter)
6. Aguarde a execução (deve aparecer "Success. No rows returned")

### 3. Verificar Tabelas Criadas

1. Vá em **Table Editor** (menu lateral)
2. Você deve ver as seguintes tabelas:
   - ✅ `clients` - Clientes
   - ✅ `catalog_items` - Itens do catálogo (com 6 itens pré-cadastrados)
   - ✅ `quotes` - Orçamentos
   - ✅ `quote_items` - Itens dos orçamentos

### 4. Configurar Variáveis de Ambiente

1. No Supabase, vá em **Settings** → **API**
2. Copie os valores:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (chave longa que começa com `eyJ...`)

3. No projeto, crie o arquivo `.env.local`:

```bash
cp .env.example .env.local
```

4. Edite `.env.local` e cole os valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Testar Conexão

Reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

Se tudo estiver correto, você não verá o aviso:
```
⚠️ Supabase environment variables not configured
```

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

#### `clients`
Armazena informações dos clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | ID único do cliente |
| name | VARCHAR(255) | Nome do cliente |
| phone | VARCHAR(20) | Telefone |
| address | TEXT | Endereço completo |
| location_type | ENUM | Tipo: casa, apartamento, loja, empresa |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

#### `catalog_items`
Catálogo de produtos e serviços.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | ID único do item |
| name | VARCHAR(255) | Nome do produto/serviço |
| brand | VARCHAR(255) | Marca/fornecedor |
| price | DECIMAL(10,2) | Preço unitário |
| unit | ENUM | Unidade: metro, unid, rolo, ponto, visita |
| category | ENUM | Categoria do item |
| icon | VARCHAR(50) | Ícone Material Symbols |
| is_active | BOOLEAN | Se está ativo no catálogo |

#### `quotes`
Orçamentos criados.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | ID único do orçamento |
| quote_number | VARCHAR(20) | Número do orçamento (auto-gerado) |
| client_id | UUID | Referência ao cliente |
| status | ENUM | Status: open, approved, completed, cancelled |
| valid_until | DATE | Data de validade |
| total_value | DECIMAL(10,2) | Valor total (calculado automaticamente) |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

#### `quote_items`
Itens de cada orçamento.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | ID único |
| quote_id | UUID | Referência ao orçamento |
| catalog_item_id | UUID | Referência ao item do catálogo |
| quantity | DECIMAL(10,2) | Quantidade |
| unit_price | DECIMAL(10,2) | Preço unitário no momento |
| subtotal | DECIMAL(10,2) | Subtotal (calculado automaticamente) |

### Funcionalidades Automáticas

#### ✨ Numeração Automática de Orçamentos
Os orçamentos recebem um número único no formato `NNNNSS`:
- **NNNN**: Número sequencial (0001, 0002, etc.)
- **SS**: Últimos 2 dígitos do ano (26 para 2026)
- Exemplo: `000126` (primeiro orçamento de 2026)

#### 💰 Cálculo Automático de Valores
- **Subtotal**: Calculado automaticamente como `quantidade × preço_unitário`
- **Total do Orçamento**: Soma automática de todos os subtotais

#### 🔄 Timestamps Automáticos
- `created_at`: Definido automaticamente na criação
- `updated_at`: Atualizado automaticamente em qualquer modificação

## 🔒 Segurança (RLS)

O banco está configurado com Row Level Security (RLS) ativado em todas as tabelas.

**Política Atual**: Todos os usuários autenticados têm acesso completo.

> ⚠️ **Importante**: Para produção, você deve configurar políticas mais restritivas baseadas em roles de usuário.

## 🔍 Views Disponíveis

### `quotes_with_client`
Orçamentos com informações completas do cliente.

```sql
SELECT * FROM quotes_with_client;
```

### `quote_items_detailed`
Itens de orçamento com detalhes completos do catálogo.

```sql
SELECT * FROM quote_items_detailed WHERE quote_id = 'uuid-aqui';
```

## 🧪 Dados de Teste

O schema já inclui 6 itens pré-cadastrados no catálogo:
- Cabo Flexível 2.5mm Preto
- Tomada Dupla 10A c/ Espelho
- Disjuntor DIN Unipolar 20A
- Fita Isolante 33+ 20m
- Conector Wago 3 vias
- Eletroduto Corrugado 3/4"

## 📝 Próximos Passos

Após configurar o banco de dados:

1. ✅ Implementar hooks para buscar dados do Supabase
2. ✅ Substituir dados mockados por dados reais
3. ✅ Implementar autenticação de usuários
4. ✅ Adicionar mais itens ao catálogo
5. ✅ Configurar backup automático

## 🆘 Problemas Comuns

### Erro: "relation does not exist"
- Verifique se executou o schema SQL completo
- Confirme que está conectado ao projeto correto

### Erro: "Invalid API key"
- Verifique se copiou a chave `anon public` correta
- Confirme que o arquivo `.env.local` está na raiz do projeto

### Dados não aparecem
- Verifique as políticas RLS no Supabase
- Confirme que o usuário está autenticado (se necessário)

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Criado para MP Elétrica** • Última atualização: 17/02/2026
