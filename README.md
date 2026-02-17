# ⚡ MP Elétrica - Sistema de Orçamentos

Sistema web moderno para gerenciamento de orçamentos de serviços elétricos, desenvolvido com Next.js e Supabase.

## 🚀 Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **UI**: Material Symbols Icons

## 📋 Funcionalidades

- ✅ Dashboard com estatísticas em tempo real
- ✅ Catálogo de produtos e serviços
- ✅ Criação de orçamentos em 3 etapas
- ✅ Busca e filtros avançados
- ✅ Cálculo automático de valores
- ✅ Numeração automática de orçamentos
- ✅ Interface responsiva e moderna

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/mp-eletrica.git
cd mp-eletrica
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

1. Crie uma conta em [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Execute o script SQL em `supabase/schema.sql` no SQL Editor
4. Copie as credenciais (Project URL e anon key)

### 4. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

### 5. Execute o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📊 Estrutura do Banco de Dados

O sistema utiliza 4 tabelas principais:

- **clients** - Informações dos clientes
- **catalog_items** - Catálogo de produtos e serviços
- **quotes** - Orçamentos criados
- **quote_items** - Itens de cada orçamento

Veja a documentação completa em `supabase/README.md`

## 📁 Estrutura do Projeto

```
mp-eletrica/
├── app/                    # Páginas Next.js
│   ├── catalog/           # Catálogo de produtos
│   ├── quotes/            # Orçamentos
│   └── page.tsx           # Dashboard
├── components/            # Componentes React
├── contexts/              # Context API
├── hooks/                 # Custom hooks
├── lib/                   # Configurações (Supabase)
├── supabase/              # Schema e queries SQL
└── types/                 # TypeScript types
```

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Verificar código
```

## 📖 Documentação

- [Guia de Configuração do Supabase](./supabase/README.md)
- [Guia Rápido](./supabase/QUICKSTART.md)
- [Checklist de Implementação](./IMPLEMENTATION_CHECKLIST.md)
- [Queries SQL Úteis](./supabase/queries.sql)

## 🎨 Design

O sistema utiliza uma identidade visual industrial moderna com:
- Paleta de cores profissional
- Tipografia robusta
- Animações suaves
- Interface responsiva

## 🔒 Segurança

- ✅ Variáveis de ambiente protegidas
- ✅ Row Level Security (RLS) ativado
- ✅ Validação de dados no backend
- ✅ Proteção contra SQL injection

## 📝 Licença

Este projeto é privado e proprietário.

## 👨‍💻 Desenvolvido por

MP Elétrica - Sistema de Gestão de Orçamentos

---

**Última atualização:** 17/02/2026
