# 🚀 Guia Completo de Deploy no Vercel

## 📋 **Pré-requisitos**
- Conta no Vercel
- Conta no Supabase
- Projeto no GitHub

## 🔧 **1. Preparar o Projeto**

### A. Atualizar Prisma para PostgreSQL
Edite `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### B. Instalar dependências do PostgreSQL
```bash
npm install @prisma/client prisma
```

### C. Gerar cliente Prisma
```bash
npx prisma generate
```

## 🌐 **2. Configurar Supabase**

### A. Criar projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Anote a URL de conexão

### B. Executar migrações
```bash
npx prisma db push
```

## ⚙️ **3. Configurar Vercel**

### A. Conectar repositório
1. Acesse [vercel.com](https://vercel.com)
2. "New Project"
3. Conecte seu repositório GitHub
4. Selecione o projeto

### B. Configurar variáveis de ambiente
No painel do Vercel → Settings → Environment Variables:

```env
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=admin
AUTH_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890
DATABASE_URL=postgresql://postgres.kcerewguzxfpepocjtdj:oxgeeWrqkPq74evJ@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
NODE_ENV=production
```

### C. Configurar Build Settings
- **Framework Preset:** Next.js
- **Root Directory:** ./
- **Build Command:** `npm run build`
- **Output Directory:** .next

## 📁 **4. Configurar Upload de Imagens**

### Opção A: Cloudinary (Recomendado)
1. Crie conta no [Cloudinary](https://cloudinary.com)
2. Adicione variáveis no Vercel:
```env
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

### Opção B: Vercel Blob Storage
1. Instale: `npm install @vercel/blob`
2. Configure no Vercel

## 🚀 **5. Deploy**

### A. Deploy automático
- Push para `main` branch
- Vercel faz deploy automaticamente

### B. Deploy manual
```bash
vercel --prod
```

## ✅ **6. Verificar Deploy**

1. Acesse a URL fornecida pelo Vercel
2. Teste login: `admin@admin.com` / `admin`
3. Verifique se produtos/categorias carregam
4. Teste upload de imagens

## 🔧 **7. Comandos Úteis**

```bash
# Gerar cliente Prisma
npx prisma generate

# Push schema para banco
npx prisma db push

# Ver dados no banco
npx prisma studio

# Logs do Vercel
vercel logs
```

## ⚠️ **Problemas Comuns**

### Erro de conexão com banco
- Verifique se `DATABASE_URL` está correto
- Confirme se Supabase está ativo

### Erro de build
- Verifique se todas as dependências estão instaladas
- Confirme se TypeScript está correto

### Upload não funciona
- Configure storage (Cloudinary ou Vercel Blob)
- Verifique variáveis de ambiente

## 📞 **Suporte**
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
