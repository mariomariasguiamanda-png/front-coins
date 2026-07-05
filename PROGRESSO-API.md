# Progresso — Área do Professor sem Supabase direto

Checklist de migração da área do professor para depender só da API NestJS
(`api/src`), sem nenhum acesso direto do front ao Supabase. Baseado no mapa
completo gerado em 2026-07-04.

**Status: todas as 9 etapas (0–8) concluídas em 2026-07-05.** Zero acesso
Supabase restante na área do professor; typecheck limpo em `api` e `front`
a cada etapa.

Legenda: `[ ]` pendente · `[~]` em andamento · `[x]` concluído

---

## Etapa 0 — Segurança urgente

- [x] `api/src/notas`: `professor/notas` (GET) passa a validar que o professor
      leciona a disciplina (via `ProfessorDisciplinaService.verificar`)
- [x] `api/src/notas`: criar `PUT professor/notas` para upsert de
      `notas_finais`, com a mesma checagem de posse
- [x] `front/src/pages/professor/notas.tsx`: trocar as 4 chamadas Supabase
      (`disciplinas`, `turmas`, `vw_lancamento_notas_professor`, upsert em
      `notas_finais`) por chamadas à API
- [x] Excluir `front/src/pages/api/admin/users.ts` (usava a service-role key do
      Supabase direto); `usuarios-lista.tsx` agora chama `POST /admin/usuarios`
      direto (adicionado campo de matrícula no dialog, exigido pela API para aluno)

## Etapa 1 — Turmas

- [x] Migration: adicionar coluna `turno` ao model `turmas` (Prisma) — via
      `prisma db push` (projeto não usa migrations versionadas)
- [x] `CreateTurmaDto` / `UpdateTurmaDto`: incluir `turno`
- [x] `TurmasController`/`TurmasService`: retornar `turno` em `findAll`/`findOne`
      (automático, é campo escalar do model)
- [x] Alinhar hard-delete (front) vs. soft-delete `ativo:false` (API) em
      `remove()` — front passou a usar o soft-delete da API; `findAll` agora
      filtra `ativo: true` para turma "apagada" sumir da lista
- [ ] Decidir se professor só pode gerenciar turmas das próprias disciplinas
      _(mantido como está — qualquer professor/admin autenticado gerencia
      qualquer turma; não há relação direta turma↔professor no schema hoje,
      só via disciplina. Revisar se quiser restringir)_
- [x] `front/src/pages/professor/turmas.tsx`: trocar as 4 chamadas Supabase
      por `api.get/post/patch/delete('/turmas', ...)`
- [x] Apagar `front/src/lib/supabaseClient.ts` (nada mais importava) e remover
      `@supabase/ssr`/`@supabase/supabase-js` do `package.json` do front

## Etapa 2 — Moedas / config-moedas

- [x] Criar `GET professor/moedas/config-precos`: lista de disciplinas do
      professor com preço/pontos atuais + alunos/moedas em circulação
- [x] Criar tabela de histórico (`config_compra_pontos_historico`) via
      `prisma db push`
- [x] Criar endpoint de leitura do histórico
      (`GET professor/moedas/historico-precos`)
- [x] `front/src/pages/professor/config-moedas.tsx`: substituir mock pelos
      dois endpoints acima

## Etapa 3 — Disciplinas

- [x] Criar `GET professor/disciplinas` filtrado por `professor_disciplina`,
      com turmas/total de alunos/média/taxa de conclusão agregados
- [x] Decisão confirmada com o usuário: criar/editar/excluir disciplina
      continua admin-only (currículo é decisão institucional) — removidos os
      botões e diálogos de criar/editar/excluir da tela do professor
- [x] `front/src/pages/professor/disciplinas.tsx`: substituir mock pela API
      _(bônus: removidos `category`/`credits`/`semester` do componente —
      não existiam em lugar nenhum do schema, eram só mock)_

## Etapa 4 — Desempenho

- [x] Estender `DesempenhoService` com detalhamento por atividade (`grades[]`
      por aluno+disciplina)
- [x] Adicionar ranking dentro de turma/disciplina (calculado no backend a
      partir da média real, substitui o `ranking` sequencial e sem sentido do
      mock antigo)
- [x] Adicionar modo "visão geral" (`getVisaoGeral`): `GET professor/desempenho`
      sem `?disciplina=` agrega todas as disciplinas do professor de uma vez;
      com `?disciplina=` mantém o comportamento antigo (já adequado)
- [x] Decisão: frequência/presença e "bimestre" (período) **não existem em
      nenhum lugar do schema** e não há feature de chamada/presença na
      aplicação — não foram implementados. Removidos do componente
      (`DesempenhoProfessor.tsx`): filtro de período, card "Análise de
      Tendências", coluna/ícone de tendência e o stat de frequência no
      dialog do aluno. Se isso virar requisito real, precisa de tabela nova
      de presença por aula, que não existe hoje.
- [x] `front/src/pages/professor/desempenho.tsx`: substituir mock pela API
      _(bônus: os filtros de disciplina/turma do componente eram uma lista
      fixa hardcoded que não batia com dados reais — passaram a ser
      derivados dinamicamente do `performanceData` recebido)_

## Etapa 5 — Perfil do professor

- [x] `GET professor/perfil`: incluir disciplinas/turmas lecionadas (join via
      `professor_disciplina`) + `total_alunos` real
- [x] Decisão: matrícula, CPF, data de admissão, departamento e estatísticas
      de aulas/avaliação **não existem em lugar nenhum do schema** e não há
      feature de RH/avaliação de professor no sistema — não implementados
      (mesmo critério de Etapas 3 e 4). `criado_em` do registro do professor
      é exposto como "Cadastrado em" (rótulo honesto, não finge ser data de
      admissão de RH)
  - Bônus real: `especialidade` (campo que já existia no schema mas nunca
    era editável) virou editável; adicionado `PATCH professor/perfil/senha`
    (troca de senha com verificação da senha atual via bcrypt) — a tela já
    tinha os 3 campos de senha só que sem nenhum handler por trás; upload de
    foto passou a chamar de verdade `POST professor/perfil/foto` (antes só
    fazia preview local em base64 e nunca persistia)
- [x] `front/src/pages/professor/perfil.tsx` + `PerfilProfessor.tsx`:
      substituídos mock/campos fantasma pela API real

## Etapa 6 — Resumos

- [x] Adicionar `links String[]` e `anexos_urls String[]` ao model `resumos`
      (arrays nativos do Postgres, via `prisma db push`)
- [x] Decisão confirmada com o usuário: **sem** fluxo de aprovação. O mock
      tinha aprovar/rejeitar, mas `professor/resumos` só lista os resumos do
      PRÓPRIO professor — não faz sentido ele aprovar o próprio conteúdo.
      Ficou só `ativo`/soft-delete, mesmo padrão de disciplinas/turmas.
      `findByProfessor` passou a filtrar `ativo: true` (resumo excluído some
      da lista do professor, como turmas)
- [x] Endpoint de contagem de visualizações: embutido em
      `GET professor/resumos` (campo `views`, agregado de `aluno_resumo`
      com `status: 'lido'`), não precisou de rota separada
- [x] Upload de anexos: `POST professor/resumos/:id/anexos` (multipart, até
      5 arquivos) e `DELETE professor/resumos/:id/anexos` (remove um
      caminho da lista) — segue o mesmo padrão de `FileInterceptor` já usado
      no upload de foto de perfil
- [x] `front/src/pages/professor/resumos.tsx` + `ResumosProfessor.tsx`:
      substituídos mock/aprovação fantasma pela API real. Disciplina no
      formulário de criação virou um select vindo de `GET professor/disciplinas`
      (antes era texto livre, sem vínculo com `id_disciplina` de verdade).
      Anexos só podem ser adicionados depois do resumo criado (tela de
      detalhes), já que a API precisa do `id_resumo` primeiro

## Etapa 7 — Videoaulas

- [x] Decisão: `thumbnail` **não virou coluna** — é derivada em tempo real
      do link do YouTube (`https://img.youtube.com/vi/{id}/hqdefault.jpg`),
      então não precisa de upload nem de campo no banco
- [x] Decisão: `likes` descartado (sem feature de curtir em lugar nenhum do
      app) e status rascunho/agendado/publicado simplificado para
      ativo/inativo (mesmo critério de resumos — não existe campo de data de
      publicação agendada no schema, então "agendado" não tinha como
      funcionar de verdade)
- [x] Adicionada coluna real `descricao` ao model `videoaulas` (só faltava,
      todo outro tipo de conteúdo já tinha campo de descrição)
- [x] Endpoint de progresso por aluno: embutido em `GET professor/videoaulas`
      (`studentsWatched[]`, derivado de `aluno_videoaula` — progresso,
      concluído, tempo assistido calculado a partir de `duracao_segundos ×
      percentual_assistido`)
- [x] `front/src/pages/professor/videoaulas.tsx` + `VideoaulasProfessor.tsx`:
      substituídos mock/upload de vídeo local (sem endpoint nenhum por trás)
      pela API real; disciplina no formulário virou select vindo de
      `GET professor/disciplinas`

## Etapa 8 — Atividades / Dashboard / Correção

- [x] Novo módulo `dashboard` com `GET professor/dashboard`: disciplinas
      (total/pendente/corrigida — `total = pendente + corrigida`, contagem
      real de `aluno_atividade`), desempenho por turma (média de
      `notas_finais` + participação real), ranking top-3 por saldo de
      moedas e feed de atividades recentes (últimas entregas/correções) —
      tudo calculado, nada hardcoded
- [x] `front/src/pages/professor/dashboard.tsx` + `DashboardProfessor.tsx`:
      removidos os dados 100% fixos que existiam direto no componente (não
      vinham nem de prop!) — `performanceData`, `recentActivity` e o
      "Ranking da Turma" sempre mostrando os mesmos 3 nomes/valores
      (João Silva 950 moedas etc.) viraram dados reais
- [x] `front/src/pages/professor/atividades.tsx` + `AtividadesProfessor.tsx`:
      substituído mock pela API já existente. Bônus: o formulário de criar
      atividade não tinha `onSubmit` nenhum (não fazia nada); o diálogo
      "Ver Submissões" gerava alunos e notas com RNG (`seededRandom`) — como
      a correção real já é feita em `corrigir.tsx`, esse diálogo fantasma
      foi removido e o botão passou a levar direto pra lá
- [x] Extensão pequena e justificada em `AtividadesService.findByProfessor`:
      agora calcula `total_alunos`/`entregues`/`corrigidas` reais por
      atividade (pra status e contagem de entregas baterem com a realidade,
      em vez de vir hardcoded como 30 alunos fixos no mock)
- [x] `front/src/pages/professor/atividades/[id]/corrigir.tsx`: reescrita
      completa — usava a MESMA lista de nomes + RNG do mock de atividades
      pra gerar entregas falsas. Agora usa `GET aluno/atividades/:id` (dados
      da atividade) + `GET professor/atividades/:id/entregas` (entregas
      reais) + `POST professor/atividades/:id/corrigir` (salvar nota)
- [x] Decisão: anexo de entrega do aluno **não implementado** — não existe
      coluna no schema nem endpoint de upload no fluxo de entrega do aluno
      (que hoje só aceita `resposta_texto`); implementar seria uma feature
      nova nos dois lados (aluno envia arquivo + professor baixa), fora do
      escopo de "conectar o que já existe". O botão de download fake foi
      removido; a resposta em texto do aluno (`resposta_texto`, real) passou
      a ser exibida na tela de correção

---

## Concluído

- **Etapa 0 — Segurança urgente** (2026-07-04)
  - `NotasService.findByProfessor` agora valida posse da disciplina e devolve
    todos os alunos matriculados na turma+disciplina (com ou sem nota lançada),
    mesmo formato que a view Supabase antiga
  - Novo `PUT professor/notas` (`NotasService.salvarNotaFinal`) calcula
    `status_final` (aprovado/recuperação/reprovado, corte em 6/4) e faz upsert
    em `notas_finais`, com a mesma checagem de posse
  - `notas.tsx` migrado para `api.get`/`api.put` — nenhuma chamada Supabase
    restante nesse arquivo
  - `pages/api/admin/users.ts` excluído; `usuarios-lista.tsx` chama
    `POST /admin/usuarios` diretamente; `CreateUserDialog` ganhou campo de
    matrícula (obrigatório quando tipo = aluno, exigido pelo `CreateUsuarioDto`)

- **Etapa 1 — Turmas** (2026-07-05)
  - Descoberta: a coluna `turno` que o front lia/gravava direto no Supabase
    **não existia de verdade no banco** (nem no Prisma) — o CRUD de turma via
    Supabase provavelmente já estava quebrado em produção. Adicionada via
    `prisma db push` (schema `turmas.turno String?`)
  - `CreateTurmaDto`/`UpdateTurmaDto` passam a aceitar `turno`
  - `TurmasService.findAll` agora filtra `ativo: true`, para casar com o
    soft-delete que `remove()` já fazia
  - `turmas.tsx` migrado para `api.get/post/patch/delete('/turmas', ...)` —
    zero chamada Supabase
  - `lib/supabaseClient.ts` apagado; `@supabase/ssr` e `@supabase/supabase-js`
    removidos do `package.json` do front (não sobrou nenhum consumidor)

- **Etapa 2 — Moedas / config-moedas** (2026-07-05)
  - Novo model `config_compra_pontos_historico` (preço/pontos anterior e
    novo, quem alterou, quando), ligado a `disciplinas` e `professores`
  - `setConfigPreco` agora grava uma linha de histórico a cada alteração
    (captura o valor anterior antes do upsert)
  - Novo `GET professor/moedas/config-precos`: disciplinas do professor
    (via `professor_disciplina`) com preço/pontos atuais, total de alunos
    matriculados e soma do saldo de moedas em circulação
  - Novo `GET professor/moedas/historico-precos`: até 50 registros mais
    recentes, com o texto da alteração já montado no backend
  - `config-moedas.tsx` migrado para consumir os dois endpoints (cor de cada
    card é só cosmética, calculada no front por índice — não tem campo
    correspondente no banco)

- **Etapa 3 — Disciplinas** (2026-07-05)
  - Novo `GET professor/disciplinas`: para cada disciplina do professor
    (via `professor_disciplina`), calcula turmas (nomes únicos via alunos
    matriculados), total de alunos, média de `notas_finais` e taxa de
    conclusão (corrigidas / (atividades × alunos))
  - Decisão: permissão de criar/editar/excluir disciplina continua
    admin-only — `DisciplinasProfessor.tsx` virou somente leitura (sem
    botões/diálogos de criar/editar/excluir)
  - Removidos `category`, `credits` e `semester` (string) do componente e da
    página: não existiam em nenhum lugar do schema, eram só mock sem dado
    real por trás
  - `disciplinas.tsx` migrado para consumir a API

- **Etapa 4 — Desempenho** (2026-07-05)
  - Novo `DesempenhoService.getVisaoGeral`: uma linha por (aluno, disciplina)
    em todas as disciplinas do professor, com `grades[]` detalhado por
    atividade corrigida e ranking calculado de verdade dentro de cada grupo
    disciplina+turma (o mock antigo tinha um `ranking` sequencial que não
    correspondia a nada)
  - `GET professor/desempenho` sem `?disciplina=` chama o modo visão geral;
    com `?disciplina=` mantém o comportamento por turma já existente
  - Frequência/presença e período (bimestre) não têm nenhuma base no schema
    (não existe conceito de aula/chamada no sistema) — decidido não
    implementar; removidos da UI (`DesempenhoProfessor.tsx`) o filtro de
    período, a "Análise de Tendências" e o stat de frequência
  - `desempenho.tsx` migrado; filtros de disciplina/turma do componente
    passaram a ser dinâmicos (antes eram uma lista fixa hardcoded)

- **Etapa 5 — Perfil do professor** (2026-07-05)
  - `getPerfilProfessor` estendido: disciplinas/turmas (via
    `professor_disciplina` + `matriculas_aluno_disciplina`), `total_alunos`
    real, `criado_em`
  - Matrícula/CPF/admissão/departamento/estatísticas de aula ficaram de fora
    — zero base no schema, sem feature de RH/avaliação por trás
  - Novo `PATCH professor/perfil/senha` (verifica senha atual com
    `bcrypt.compare` antes de trocar) — completa uma funcionalidade que já
    estava desenhada na tela mas nunca tinha endpoint
  - Upload de foto (`PerfilProfessor.tsx`) passou a chamar de verdade a API
    em vez de só gerar um preview local que nunca era salvo
  - `especialidade` (coluna já existente, nunca exposta para edição) virou
    editável via `PATCH professor/perfil`

- **Etapa 6 — Resumos** (2026-07-05)
  - Novas colunas `links`/`anexos_urls` (arrays) no model `resumos`
  - Removido o fluxo de aprovação (pendente/aprovado/rejeitado) do mock —
    `professor/resumos` é self-scoped, professor não pode aprovar o próprio
    conteúdo. Ficou ativo/inativo com soft-delete, igual turmas/disciplinas
  - `views` (visualizações) calculado a partir de `aluno_resumo` direto no
    `GET professor/resumos`, sem endpoint extra
  - Novo upload de anexos (multipart, até 5 arquivos) e remoção individual,
    reaproveitando o padrão de upload de foto de perfil
  - Formulário de criação passou a usar um select de disciplina real (API)
    em vez de texto livre sem vínculo com `id_disciplina`

- **Etapa 7 — Videoaulas** (2026-07-05)
  - Thumbnail derivada do link do YouTube (sem upload, sem coluna nova) —
    resolve o gap sem inventar infraestrutura de upload de imagem
  - `likes` descartado (zero feature de curtir no app); status
    rascunho/agendado/publicado virou ativo/inativo (não existe data de
    publicação agendada no schema — "agendado" não tinha como ser real)
  - Nova coluna `descricao` em `videoaulas` (única entre atividades/resumos/
    videoaulas que ainda não tinha)
  - `GET professor/videoaulas` agora traz `views` (contagem de
    `aluno_videoaula`) e `studentsWatched[]` com progresso real por aluno
  - Removido o formulário de "upload de vídeo local" do mock — não existia
    endpoint de upload de vídeo, só `url_video` (link do YouTube) é
    suportado pela API hoje
