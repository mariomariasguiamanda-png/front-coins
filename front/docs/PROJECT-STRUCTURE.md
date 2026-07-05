# 🪙 Coins for Study — Estrutura do Front-end

Next.js (Pages Router) + React + TypeScript + Tailwind CSS. O front conversa
exclusivamente com a API NestJS (`api/` no monorepo) via `src/lib/api.ts`.

## 📁 Estrutura de pastas

```
front/
├── docs/                         # Documentação do projeto
├── public/                       # Estáticos (logo, ilustrações)
└── src/
    ├── pages/                    # Rotas (Next.js Pages Router) — só wiring
    │   ├── _app.tsx              # Providers (Auth, Theme) + layouts persistentes
    │   ├── login.tsx             # Autenticação
    │   ├── aluno/                # Rotas do aluno
    │   ├── professor/            # Rotas do professor
    │   └── adm/                  # Rotas do administrador
    │
    ├── components/
    │   ├── ui/                   # Design system (Button, Card, Input, Dialog,
    │   │                         #   ConfirmDialog, Skeleton, Toast...)
    │   ├── perfil/               # Compartilhado entre papéis (ProfileHero)
    │   ├── aluno/                # Tudo do aluno: AlunoLayout/Header/Sidebar
    │   │                         #   + telas (Perfil, AgendaEstudos, Ajuda,
    │   │                         #   Disciplinas, MinhasNotas, GraficoMoedas)
    │   ├── professor/            # Tudo do professor: ProfessorLayout/Header/
    │   │                         #   Sidebar + telas (Notas, Desempenho,
    │   │                         #   Atividades, Resumos, Videoaulas...)
    │   └── adm/                  # Tudo do admin: AdminLayout/Header/Sidebar
    │       └── dialogs/          #   + telas e diálogos de CRUD
    │
    ├── contexts/                 # AuthContext (sessão/JWT) e ThemeContext
    ├── hooks/                    # useAlunoNotifications (polling do sino),
    │                             #   useUsuarioLogado
    ├── lib/                      # api.ts (client REST + resolveMediaUrl),
    │   │                         #   utils.ts (cn), formatters.ts
    │   └── mock/                 # Dados mockados ainda usados por telas de
    │                             #   relatório do admin não migradas pra API
    ├── services/
    │   └── api/                  # Clientes REST por domínio do admin
    │                             #   (logs, notifications, support, settings)
    └── styles/                   # globals.css (Tailwind + tema)
```

## 🧭 Convenções

- **Rotas magras**: arquivos em `pages/` só resolvem dados e delegam a um
  componente de tela em `components/<papel>/`.
- **Layout persistente**: toda página de papel usa
  `Page.getLayout = getAlunoLayout | getProfessorLayout` (ver `_app.tsx`) —
  header/sidebar não remontam entre navegações.
- **Agrupamento por papel**: cada papel (aluno/professor/adm) é dono dos seus
  componentes E do seu layout, na mesma pasta. O que é usado por mais de um
  papel vive em `components/perfil/` ou `components/ui/`.
- **Import alias**: sempre `@/...` (aponta pra `src/`), nunca caminho relativo
  entre pastas distantes.
- **API**: nenhuma chamada direta a banco/Supabase no front — tudo passa por
  `lib/api.ts`, que injeta o JWT do `localStorage` e resolve a base URL via
  `NEXT_PUBLIC_API_URL`.

## 🔧 Scripts

```bash
npm run dev     # desenvolvimento (porta 3000)
npm run build   # build de produção
npm start       # serve o build
```

## 🚀 Produção

- **Front**: Vercel (Root Directory = `front`), domínio `front-coins.vercel.app`,
  env `NEXT_PUBLIC_API_URL` apontando pra API.
- **API**: Railway (`coins-api-production.up.railway.app`), deploy automático
  no push da `main`.
