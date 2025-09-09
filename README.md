# 🎨 Bergas - Catálogo de Maquiagem

Um catálogo completo para loja de maquiagens com painel administrativo, desenvolvido com Next.js, TypeScript e NextUI.

## ✨ Funcionalidades

### 🏠 Landing Page
- Design moderno e responsivo
- Seção hero com animações
- Produtos em destaque
- Categorias organizadas
- Seção sobre a empresa
- Footer completo com links

### 🛍️ Catálogo de Produtos
- Página de listagem de todos os produtos
- Filtros por categoria
- Busca por nome e marca
- Ordenação por preço e nome
- Cards responsivos com hover effects

### 📱 Página de Produto
- Visualização detalhada do produto
- Galeria de imagens
- Informações completas
- Botão direto para WhatsApp
- Produtos relacionados

### 🔧 Painel Administrativo
- Dashboard com estatísticas
- CRUD completo de produtos
- Filtros e busca
- Toggle para produtos em destaque
- Controle de estoque
- Interface intuitiva

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **NextUI** - Componentes UI
- **Prisma** - ORM para banco de dados
- **Framer Motion** - Animações
- **Lucide React** - Ícones

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd catalogo-maquiagem
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env.local baseado no .env.example
cp .env.example .env.local
```

4. **Configure o banco de dados**
```bash
# Gere o cliente Prisma
npx prisma generate

# Execute as migrações
npx prisma db push
```

5. **Execute o projeto**
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 🗄️ Estrutura do Banco de Dados

### Tabela Products
- `id` - Identificador único
- `name` - Nome do produto
- `description` - Descrição detalhada
- `price` - Preço em reais
- `category` - Categoria do produto
- `brand` - Marca
- `image` - URL da imagem principal
- `images` - Array de URLs das imagens
- `inStock` - Status do estoque
- `featured` - Produto em destaque
- `createdAt` - Data de criação
- `updatedAt` - Data de atualização

### Tabela Users
- `id` - Identificador único
- `email` - Email do usuário
- `password` - Senha criptografada
- `name` - Nome do usuário
- `role` - Função (ADMIN/USER)
- `createdAt` - Data de criação
- `updatedAt` - Data de atualização

## 📱 Integração WhatsApp

O sistema está configurado para redirecionar para WhatsApp com uma mensagem pré-formatada contendo:
- Nome do produto
- Preço formatado
- Link direto para conversa

Para configurar seu número do WhatsApp, edite a variável `WHATSAPP_NUMBER` no arquivo `.env.local`.

## 🎨 Personalização

### Cores
As cores principais podem ser alteradas no arquivo `tailwind.config.js`:
- Primary: Rosa/Roxo
- Secondary: Amarelo/Dourado

### Componentes
Todos os componentes estão na pasta `components/` e podem ser facilmente personalizados.

### Dados Mock
Os dados de exemplo estão nos componentes e podem ser substituídos por chamadas de API reais.

## 📂 Estrutura do Projeto

```
├── app/                    # App Router do Next.js
│   ├── admin/             # Painel administrativo
│   ├── produto/           # Página de produto
│   ├── produtos/          # Lista de produtos
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes reutilizáveis
│   ├── Navbar.tsx        # Barra de navegação
│   ├── Hero.tsx          # Seção hero
│   ├── FeaturedProducts.tsx # Produtos em destaque
│   ├── Categories.tsx    # Categorias
│   ├── About.tsx         # Seção sobre
│   └── Footer.tsx        # Rodapé
├── prisma/               # Configuração do banco
│   └── schema.prisma     # Schema do banco
└── public/               # Arquivos estáticos
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa o projeto em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa o build de produção
- `npm run lint` - Executa o linter

## 📝 Próximos Passos

- [ ] Implementar autenticação real
- [ ] Conectar com banco de dados real
- [ ] Adicionar sistema de upload de imagens
- [ ] Implementar carrinho de compras
- [ ] Adicionar sistema de avaliações
- [ ] Integrar com gateway de pagamento
- [ ] Implementar notificações push

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do email: contato@bergas.com.br

---

Desenvolvido com ❤️ para a Bergas
