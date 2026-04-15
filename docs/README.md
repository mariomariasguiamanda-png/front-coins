# Coins - Sistema de Gestão Educacional

Um sistema moderno de gestão educacional desenvolvido com Next.js, React, TypeScript e Tailwind CSS.

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca para interface de usuário
- **TypeScript** - Superset JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **React Hook Form** - Biblioteca para gerenciamento de formulários
- **Yup** - Validação de schemas
- **Context API** - Gerenciamento de estado global

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas do Next.js (App Router)
│   ├── login/             # Página de login
│   ├── homepage/          # Página inicial
│   ├── cadastro/          # Página de cadastro
│   ├── dashboard/         # Página do painel
│   ├── perfil/            # Página de perfil
│   ├── ajuda/             # Página de ajuda
│   ├── layout.tsx         # Layout raiz
│   ├── page.tsx           # Página principal
│   └── globals.css        # Estilos globais
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de interface
│   ├── layout/           # Componentes de layout
│   └── forms/            # Formulários reutilizáveis
├── services/             # Serviços e APIs
│   ├── api/              # Cliente de API
│   └── auth/             # Contexto de autenticação
└── utils/                # Utilitários
    ├── validation/       # Schemas de validação
    └── helpers/          # Funções auxiliares
```

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Passos para instalação

1. **Clone o repositório**

   ```bash
   git clone [url-do-repositorio]
   cd coins
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env.local` na raiz do projeto:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Execute o projeto em desenvolvimento**

   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**

   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔐 Sistema de Autenticação

O sistema inclui um contexto de autenticação completo com:

- **Login** - Autenticação com email e senha
- **Cadastro** - Registro de novos usuários
- **Gerenciamento de Estado** - Context API para estado global
- **Proteção de Rotas** - Controle de acesso às páginas

### Dados de Teste

Para testar o sistema, use as seguintes credenciais:

- **Admin**: `admin@test.com` / `123456`
- **Usuário**: `marioAluno@email.com` / `Mario20034*`


---

Desenvolvido com ❤️ usando Next.js e TypeScript
