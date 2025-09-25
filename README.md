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
- **Usuário**: `user@test.com` / `123456`

## 📱 Páginas e Navegação

### Rotas Disponíveis

- `/` - Página principal com links de navegação
- `/login` - Página de login
- `/cadastro` - Página de cadastro
- `/homepage` - Página inicial do sistema
- `/dashboard` - Painel do usuário (requer login)
- `/perfil` - Perfil do usuário (requer login)
- `/ajuda` - Central de ajuda e suporte

### Navegação

O sistema utiliza o sistema de roteamento do Next.js 14 com App Router:

- Navegação automática baseada na estrutura de pastas
- Links otimizados com `next/link`
- Navegação programática com `useRouter`

## 🎨 Componentes UI

### Componentes Principais

- **Button** - Botão com variantes (primary, secondary, outline)
- **Input** - Campo de entrada com validação
- **Card** - Container para conteúdo
- **Navigation** - Barra de navegação responsiva

### Uso dos Componentes

```tsx
import { Button, Input, Card } from '@/components'

// Botão
<Button variant="primary" size="lg">
  Clique aqui
</Button>

// Campo de entrada
<Input
  label="Nome"
  error="Campo obrigatório"
  {...register('name')}
/>

// Card
<Card title="Título" subtitle="Subtítulo">
  Conteúdo do card
</Card>
```

## 📋 Validação de Formulários

O sistema utiliza **React Hook Form** + **Yup** para validação:

### Schemas Disponíveis

- `loginSchema` - Validação do formulário de login
- `registerSchema` - Validação do formulário de cadastro
- `profileSchema` - Validação do perfil do usuário

### Exemplo de Uso

```tsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, LoginFormData } from "@/utils/validation/schemas";

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<LoginFormData>({
  resolver: yupResolver(loginSchema),
});
```

## 🔧 Personalização

### Cores e Tema

As cores são configuradas no `tailwind.config.js`:

```js
colors: {
  primary: {
    500: '#3b82f6',
    600: '#2563eb',
    // ...
  },
  secondary: {
    500: '#64748b',
    600: '#475569',
    // ...
  }
}
```

### Estilos Globais

Classes CSS customizadas estão definidas em `globals.css`:

- `.btn-primary` - Estilo padrão para botão primário
- `.btn-secondary` - Estilo padrão para botão secundário
- `.input-field` - Estilo padrão para campos de entrada
- `.card` - Estilo padrão para cards
- `.form-error` - Estilo para mensagens de erro

## 🌐 Integração com API

### Cliente de API

O sistema inclui um cliente de API configurado em `services/api/client.ts`:

```tsx
import { apiClient } from "@/services/api/client";

// GET
const data = await apiClient.get("/endpoint");

// POST
const result = await apiClient.post("/endpoint", { data });
```

### Funções de API

- `authApi.login()` - Login do usuário
- `authApi.register()` - Cadastro do usuário
- `userApi.getProfile()` - Buscar perfil
- `userApi.updateProfile()` - Atualizar perfil

## 📱 Responsividade

O sistema é totalmente responsivo usando Tailwind CSS:

- **Mobile First** - Design otimizado para dispositivos móveis
- **Breakpoints** - `sm`, `md`, `lg`, `xl` para diferentes tamanhos
- **Grid System** - Layout flexível e adaptável

## 🧪 Desenvolvimento

### Scripts Disponíveis

```bash
npm run dev        # Executa em modo de desenvolvimento
npm run build      # Cria build de produção
npm run start      # Executa build de produção
npm run lint       # Executa verificação de código
```

### Estrutura de Desenvolvimento

1. **Componentes** - Criar componentes reutilizáveis em `components/`
2. **Páginas** - Adicionar novas páginas em `app/`
3. **Estilos** - Usar classes Tailwind ou CSS modules
4. **Validação** - Definir schemas em `utils/validation/`

## 🚀 Deploy

### Build de Produção

```bash
npm run build
npm run start
```

### Variáveis de Ambiente

Configure as seguintes variáveis para produção:

```env
NEXT_PUBLIC_API_URL=https://api.seudominio.com/api
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte e dúvidas:

- Email: suporte@coins.com
- Documentação: [link para documentação]
- Issues: [link para issues do GitHub]

---

Desenvolvido com ❤️ usando Next.js e TypeScript
