# 🪙 Coins for Study - Sistema de Gestão Educacional

Uma plataforma moderna que recompensa o aprendizado, construída com Next.js, React, TypeScript e Tailwind CSS.

## 📁 Estrutura do Projeto

```
/coins
├── /app                          # Next.js App Router (Pages)
│   ├── layout.tsx               # Layout raiz da aplicação
│   ├── page.tsx                 # Página inicial
│   ├── /login
│   │   └── page.tsx            # Página de login
│   ├── /cadastro
│   │   └── page.tsx            # Página de cadastro
│   ├── /homepage
│   │   └── page.tsx            # Homepage após login
│   ├── /dashboard
│   │   └── page.tsx            # Dashboard do usuário
│   ├── /perfil
│   │   └── page.tsx            # Página de perfil
│   ├── /ajuda
│   │   └── page.tsx            # Página de ajuda
│   └── /esqueci-senha
│       └── page.tsx            # Recuperação de senha
├── /src
│   ├── /components              # Componentes React reutilizáveis
│   │   ├── /ui                  # Componentes de UI básicos
│   │   │   ├── Button.tsx       # Componente de botão
│   │   │   ├── Input.tsx        # Componente de input
│   │   │   ├── Label.tsx        # Componente de label
│   │   │   ├── Card.tsx         # Componente de card
│   │   │   └── Icons.tsx        # Ícones SVG
│   │   ├── /layout              # Componentes de layout
│   │   │   └── MainLayout.tsx   # Layout principal
│   │   ├── /forms               # Formulários especializados
│   │   │   ├── LoginForm.tsx    # Formulário de login
│   │   │   └── RegisterForm.tsx # Formulário de cadastro
│   │   └── index.ts             # Exports dos componentes
│   ├── /services                # Serviços e contextos
│   │   └── /auth
│   │       └── AuthContext.tsx  # Contexto de autenticação
│   ├── /styles                  # Estilos globais
│   │   └── globals.css          # CSS global + Tailwind
│   └── /utils                   # Utilitários e helpers
│       └── /validation          # Validação de formulários
│           └── schemas.ts       # Schemas Yup para validação
├── /public                      # Arquivos estáticos
│   ├── imagem_coins.png        # Ilustração da tela de login
│   └── logo-coins.png          # Logo da aplicação
├── package.json                 # Dependências e scripts
├── tailwind.config.js          # Configuração do Tailwind
├── tsconfig.json               # Configuração do TypeScript
└── next.config.js              # Configuração do Next.js
```

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **React Hook Form** - Gerenciamento de formulários
- **Yup** - Validação de esquemas
- **Node.js** - Runtime JavaScript

## 🔧 Configuração e Instalação

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn como gerenciador de pacotes

### 1. Clonagem e Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd coins

# Instale as dependências
npm install

# ou usando yarn
yarn install
```

### 2. Configuração do Ambiente

O projeto já vem configurado com:

- ✅ Next.js com TypeScript
- ✅ Tailwind CSS configurado
- ✅ React Hook Form + Yup
- ✅ Estrutura de componentes

### 3. Executando o Projeto

#### Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

#### Build de Produção

```bash
npm run build
npm start
# ou
yarn build
yarn start
```

## 📱 Funcionalidades Implementadas

### 🔐 Sistema de Autenticação

- **Login** com validação de email/senha
- **Cadastro** de novos usuários
- **Recuperação de senha**
- **Controle de perfis** (Aluno, Professor, Administrador)
- **Persistência de sessão** com localStorage

### 🎨 Interface de Usuário

- **Design responsivo** - adapta a diferentes tamanhos de tela
- **Layout moderno** com gradientes roxos
- **Componentes reutilizáveis** (Button, Input, Card, etc.)
- **Navegação fluida** entre páginas
- **Feedback visual** para erros e validações

### ✅ Validação de Formulários

- **Validação em tempo real** com Yup
- **Mensagens de erro** personalizadas
- **Verificação de email** com regex
- **Senha forte** obrigatória
- **Confirmação de senha** no cadastro

## 🎯 Páginas Principais

### 🏠 Página de Login (`/login`)

- **Layout dividido**: ilustração à esquerda, formulário à direita
- **Campos validados**: E-mail, Senha, Perfil
- **Botões**: Entrar, Criar conta, Continuar com Google
- **Responsivo**: se adapta para mobile

### 📝 Página de Cadastro (`/cadastro`)

- **Formulário completo** de registro
- **Validação robusta** de dados
- **Confirmação de senha**
- **Termos de uso**

### 🏡 Homepage (`/homepage`)

- **Dashboard inicial** após login
- **Navegação principal**
- **Informações do usuário**

## 🔒 Sistema de Autenticação

### Context API

```typescript
// Uso do contexto de autenticação
const { user, login, logout, register, isLoading } = useAuth();

// Login
const success = await login(email, password, role);

// Registro
const success = await register({
  name,
  email,
  password,
  role,
});
```

### Validação com Yup

```typescript
// Schema de login
const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  role: yup.string().oneOf(["student", "teacher", "admin"]).required(),
});
```

## 🎨 Sistema de Design

### Cores Principais

- **Roxo primário**: `#8b5cf6` (purple-500)
- **Roxo escuro**: `#7c3aed` (purple-600)
- **Cinza texto**: `#374151` (gray-700)
- **Branco**: `#ffffff`

### Componentes Reutilizáveis

```tsx
// Button com variantes
<Button variant="primary" size="lg">Entrar</Button>
<Button variant="outline">Cancelar</Button>

// Input com validação visual
<Input
  type="email"
  error={errors.email?.message}
  {...register("email")}
/>

// Card para containers
<Card>
  <CardHeader>Título</CardHeader>
  <CardContent>Conteúdo</CardContent>
</Card>
```

## 📱 Responsividade

### Breakpoints Tailwind

- **sm**: 640px+
- **md**: 768px+
- **lg**: 1024px+ (layout desktop com divisão lateral)
- **xl**: 1280px+

### Adaptações Mobile

- Layout vertical em telas pequenas
- Botões full-width
- Espaçamentos otimizados
- Tipografia responsiva

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Gera build de produção
npm run start        # Inicia servidor de produção

# Linting e Formatação
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige problemas automaticamente

# Tailwind
npx tailwindcss init # Reinicializa configuração do Tailwind
```

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

```bash
# Build
npm run build

# Upload da pasta .next para Netlify
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔮 Próximas Funcionalidades

- [ ] **OAuth** real com Google/GitHub
- [ ] **API Backend** com banco de dados
- [ ] **Sistema de moedas** e recompensas
- [ ] **Dashboard** interativo
- [ ] **Notificações** push
- [ ] **Modo escuro**
- [ ] **Testes automatizados**
- [ ] **PWA** support

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvedor Principal**: Mario Laux Neto
- **Design**: Baseado em conceitos modernos de UX/UI
- **Arquitetura**: Next.js 14 com App Router

---

**⚡ Desenvolvido com Next.js, React, TypeScript e muito ☕**
