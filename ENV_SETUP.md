# Configuração de Variáveis de Ambiente

## Como configurar o arquivo .env

### Para Desenvolvimento Local
Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# Configurações de Autenticação
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=admin
AUTH_SECRET=dev-secret-change-me

# Configurações do Banco de Dados (SQLite para desenvolvimento)
DATABASE_URL="file:./dev.db"

# Configurações do Next.js
NODE_ENV=development
```

### Para Produção (Vercel)
Configure as variáveis de ambiente no painel do Vercel:

```env
# Configurações de Autenticação
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=admin
AUTH_SECRET=uma-chave-super-secreta-e-aleatoria-para-producao

# Configurações do Banco de Dados (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.kcerewguzxfpepocjtdj:oxgeeWrqkPq74evJ@aws-1-sa-east-1.pooler.supabase.com:6543/postgres"

# Configurações do Next.js
NODE_ENV=production
```

## Importante

- **NUNCA** commite o arquivo `.env.local` para o repositório
- Para produção, use credenciais mais seguras
- O `AUTH_SECRET` deve ser uma string aleatória forte em produção
- As credenciais padrão são apenas para desenvolvimento

## Segurança

As credenciais hardcoded foram removidas do código. Agora o sistema exige que as variáveis de ambiente sejam definidas, caso contrário retornará um erro.
