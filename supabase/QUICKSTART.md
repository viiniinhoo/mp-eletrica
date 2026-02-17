# 🎯 Configuração Rápida do Supabase

## ⚡ Setup em 5 Minutos

### 1️⃣ Criar Projeto
```
https://app.supabase.com → New Project
Nome: MP Elétrica
Região: Brazil (São Paulo)
```

### 2️⃣ Executar SQL
```
SQL Editor → New Query → Colar conteúdo de supabase/schema.sql → Run
```

### 3️⃣ Copiar Credenciais
```
Settings → API
- Project URL
- anon public key
```

### 4️⃣ Configurar .env.local
```bash
cp .env.example .env.local
# Editar .env.local com as credenciais
```

### 5️⃣ Reiniciar Servidor
```bash
npm run dev
```

## ✅ Verificação

- [ ] 4 tabelas criadas (clients, catalog_items, quotes, quote_items)
- [ ] 6 itens no catálogo
- [ ] Sem avisos de configuração no console
- [ ] Views disponíveis (quotes_with_client, quote_items_detailed)

## 📊 Estrutura Criada

```
┌─────────────┐
│   clients   │
└──────┬──────┘
       │
       │ 1:N
       ▼
┌─────────────┐      ┌──────────────────┐
│   quotes    │◄─────┤   quote_items    │
└─────────────┘  N:1 └────────┬─────────┘
                              │
                              │ N:1
                              ▼
                      ┌──────────────────┐
                      │  catalog_items   │
                      └──────────────────┘
```

## 🔥 Recursos Automáticos

- ✨ Numeração de orçamentos (ex: 000126)
- 💰 Cálculo de subtotais e totais
- 🔄 Timestamps automáticos
- 🔒 RLS ativado
- 🔍 Views para consultas otimizadas

## 📖 Documentação Completa

Veja `supabase/README.md` para instruções detalhadas.
