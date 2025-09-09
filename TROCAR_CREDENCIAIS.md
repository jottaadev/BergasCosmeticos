# 🔐 Como Trocar Senha e Usuário

## 🚀 **Método Rápido (Recomendado)**

### **1. Execute o script interativo:**
```bash
npx tsx scripts/change-credentials.ts
```

### **2. Siga as instruções:**
- Digite o novo email
- Digite a nova senha
- Copie as variáveis geradas

### **3. Atualize os arquivos de ambiente:**

#### **Local (.env.local):**
```env
ADMIN_EMAIL=seu-novo-email@exemplo.com
ADMIN_PASSWORD_HASH=hash-gerado-pelo-script
AUTH_SECRET=dev-secret-change-me
DATABASE_URL="postgresql://sua-url-do-supabase"
NODE_ENV=development
```

#### **Vercel (Painel de Configuração):**
- `ADMIN_EMAIL` = `seu-novo-email@exemplo.com`
- `ADMIN_PASSWORD_HASH` = `hash-gerado-pelo-script`
- `AUTH_SECRET` = `sua-chave-secreta`
- `DATABASE_URL` = `sua-url-do-supabase`
- `NODE_ENV` = `production`

## 🔧 **Método Manual**

### **1. Gerar hash da nova senha:**
```bash
# Edite o arquivo scripts/generate-password-hash.ts
# Mude: const password = 'sua-nova-senha'
# Execute:
npx tsx scripts/generate-password-hash.ts
```

### **2. Atualizar variáveis:**
- Substitua `ADMIN_EMAIL` pelo novo email
- Substitua `ADMIN_PASSWORD_HASH` pelo novo hash

## ⚠️ **Importante:**

### **Segurança:**
- ✅ A senha original NUNCA fica salva
- ✅ Apenas o hash é armazenado
- ✅ Use senhas fortes (mínimo 8 caracteres)
- ✅ Combine letras, números e símbolos

### **Depois de trocar:**
1. **Teste localmente** com as novas credenciais
2. **Faça commit** das mudanças
3. **Atualize o Vercel** com as novas variáveis
4. **Teste em produção**

## 🆘 **Se der problema:**

### **Erro de login:**
- Verifique se o hash está correto
- Confirme se as variáveis estão definidas
- Teste com o script de geração

### **Esqueceu a senha:**
- Gere um novo hash com o script
- Atualize as variáveis de ambiente
- Não há como "recuperar" a senha original

## 📝 **Exemplo Prático:**

```bash
# 1. Execute o script
npx tsx scripts/change-credentials.ts

# 2. Digite:
# Email: admin@bergas.com
# Senha: MinhaSenh@123

# 3. Copie o hash gerado
# 4. Atualize .env.local e Vercel
# 5. Teste o login
```

**Resumo: Use o script interativo para trocar credenciais de forma segura!** 🔐
