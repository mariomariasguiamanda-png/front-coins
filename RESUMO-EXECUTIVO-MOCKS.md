# RESUMO EXECUTIVO: Guia Rápido de Migração

**Tempo Estimado:** 4-5 semanas  
**Risco:** Médio-Alto (com plano mitigation)  
**Status:** Pronto para Execução

---

## 🎯 O PROBLEMA

Seu projeto tem **74+ mocks** espalhados em:

- ❌ 4 arquivos centralizados em `/src/lib/mock/`
- ❌ 20+ componentes com dados hardcoded
- ❌ Estados mockados em pages e módulos

**Resultado:** Telas quebram, dados não refletem realidade, manutenção difícil.

---

## ✅ A SOLUÇÃO

1. **Criar 7 serviços** para substituir mocks
2. **Refatorar componentes** para usar dados reais do Supabase
3. **Implementar UI melhorada** (spinners, empty states, erro handling)
4. **Remover arquivos mock** de forma segura

---

## 📊 MOCKS ENCONTRADOS (Resumo)

### Por Categoria

| Categoria              | Quantidade | Impacto | Prioridade |
| ---------------------- | ---------- | ------- | ---------- |
| **Notificações**       | 16         | Alto    | 🔴 P0      |
| **Ranking/Gráficos**   | 3          | Alto    | 🔴 P0      |
| **Atividades**         | 12         | Alto    | 🔴 P0      |
| **Usuários/Admin**     | 25+        | Crítico | 🔴 P0      |
| **Transações**         | 3          | Alto    | 🟠 P1      |
| **Resumos/Videos**     | 15+        | Médio   | 🟠 P1      |
| **Configs Professor**  | 8+         | Médio   | 🟡 P2      |
| **Frequência/Revisão** | 5          | Médio   | 🟡 P2      |
| **FAQ/Static**         | 10+        | Baixo   | 🟢 P3      |

**Total: 74+ mocks**

---

## 🗂️ ARQUIVOS MOCK

### Centralizados (Remover)

```
❌ /src/lib/mock/aluno.ts          (569 linhas, 11 exports)
❌ /src/lib/mock/professor.ts       (52 linhas, 2 exports)
❌ /src/lib/mock/admin.ts          (50 linhas, 2 exports)
❌ /src/lib/mock/compras.ts        (77 linhas, 1 export)
```

### Inline (Refatorar)

```
⚠️ 58+ componentes com dados hardcoded
   ├─ Notificacoes.tsx (5 items)
   ├─ AlunoHeader.tsx (4 items)
   ├─ ProfessorHeader.tsx (3 items)
   ├─ HeaderAdm.tsx (4 items)
   ├─ Usuarios.tsx (5 items)
   ├─ DesempenhoPorTurma.tsx (9 items)
   ├─ PontosPrecos.tsx (8 items)
   └─ ... (muitos outros)
```

---

## 🛠️ SERVIÇOS A CRIAR

### Fase 1: Notificações (Semana 1-2)

```typescript
✅ notificacaoService.ts
   ├─ getNotificacoes(usuarioId, limit)
   ├─ marcarComoLida(notificacaoId)
   ├─ marcarTudasComoLidas(usuarioId)
   └─ criarNotificacao(data)

✅ useNotificacoes.ts (hook custom)
```

**Arquivos Afetados:**

- AlunoHeader.tsx
- ProfessorHeader.tsx
- HeaderAdm.tsx
- Notificacoes.tsx

---

### Fase 2: Ranking & Moedas (Semana 2)

```typescript
✅ graficoService.ts
   ├─ getRankingTurma(turmaId, limit)
   ├─ getMoedasPorMes(alunoId, ano)
   └─ getMediaGeralPorDisciplina(alunoId)
```

**Arquivos Afetados:**

- GraficoMoedas.tsx

---

### Fase 3: Atividades (Semana 2-3)

```typescript
✅ Estender alunoService.ts (já existe!)
   ├─ getAtividadesPorDisciplina(alunoId, disciplinaId)
   ├─ marcarAtividadeConcluida(alunoId, atividadeId)
   └─ getAtividadesProximas(alunoId, dias)

✅ useAtividades.ts (hook custom)
```

---

### Fase 4: Usuários/Admin (Semana 3-4)

```typescript
✅ usuarioService.ts
   ├─ getUsuarioLogado()
   ├─ getUsuarios(filtros)
   ├─ criarUsuario(data)
   ├─ atualizarUsuario(id, data)
   └─ deletarUsuario(id)
```

---

### Fase 5: Transações (Semana 4)

```typescript
✅ compraService.ts
   ├─ getTransacoes(filtros)
   ├─ cancelarTransacao(id, motivo)
   └─ getEstatisticasCompras()
```

---

### Fase 6-7: Resumos, Videos, Configs (Semana 4-5)

```typescript
✅ conteudoService.ts
   ├─ getResumos(disciplinaId)
   └─ getVideoaulas(disciplinaId)

✅ professorConfigService.ts
   ├─ getPrecos(professorId)
   └─ updateConfigPontos(config)
```

---

## 📋 CHECKLIST POR FASE

### ✅ FASE 1: PREPARAÇÃO (Semana 1)

- [ ] Validar Supabase (tabelas, views, dados)
- [ ] Criar arquivo `supabaseSchema.ts` (documentação)
- [ ] Criar tipos TypeScript em `types/database.ts`
- [ ] Estruturar pasta `/services` com padrão único
- [ ] Code review do plano com equipe

**Duração:** 2-3 dias  
**Risco:** Baixo  
**Blockers:** Nenhum

---

### 🔴 FASE 2: NOTIFICAÇÕES (Semana 1-2)

**Objetivo:** Remover 16 mocks de notificações

**Checklist:**

- [ ] Criar `notificacaoService.ts`
- [ ] Criar `useNotificacoes.ts`
- [ ] Refatorar `AlunoHeader.tsx`
- [ ] Refatorar `ProfessorHeader.tsx`
- [ ] Refatorar `HeaderAdm.tsx`
- [ ] Refatorar `Notificacoes.tsx`
- [ ] Remover notificações de `aluno.ts`
- [ ] Remover notificações de `professor.ts`
- [ ] Remover notificações de `admin.ts`
- [ ] Testes: carregar, marcar como lida, empty state
- [ ] Deploy sem erros

**Duração:** 3-4 dias  
**Risco:** Baixo  
**Impacto:** 4 componentes

---

### 🔴 FASE 3: RANKING & MOEDAS (Semana 2)

**Objetivo:** Remover 3 mocks (rankingTurma, moedasPorMes)

**Checklist:**

- [ ] Validar/criar `vw_ranking_turma` no Supabase
- [ ] Validar/criar `vw_moedas_por_mes_aluno` no Supabase
- [ ] Criar `graficoService.ts`
- [ ] Refatorar `GraficoMoedas.tsx`
- [ ] Testes: gráficos carregam, dados corretos
- [ ] Deploy sem erros

**Duração:** 2-3 dias  
**Risco:** Médio (depende de views)  
**Impacto:** 1 componente crítico

---

### 🔴 FASE 4: ATIVIDADES (Semana 2-3)

**Objetivo:** Remover 12 mocks de atividades

**Checklist:**

- [ ] Estender `alunoService.ts` (já existe!)
- [ ] Criar `useAtividades.ts`
- [ ] Refatorar `Atividades.tsx`
- [ ] Refatorar `pages/aluno/index.tsx`
- [ ] Refatorar `pages/aluno/[id].tsx`
- [ ] Remover atividades de `aluno.ts`
- [ ] Testes: filtro por disciplina, marcar concluída
- [ ] Deploy sem erros

**Duração:** 3-4 dias  
**Risco:** Médio  
**Impacto:** 3 componentes

---

### 🟠 FASE 5: RESUMOS & VIDEOAULAS (Semana 3)

**Objetivo:** Remover 15+ mocks

**Checklist:**

- [ ] Criar `conteudoService.ts`
- [ ] Refatorar `Resumos.tsx`
- [ ] Refatorar `Videoaulas.tsx`
- [ ] Remover de `aluno.ts`
- [ ] Testes: listar, filtrar
- [ ] Deploy sem erros

**Duração:** 2-3 dias  
**Risco:** Baixo  
**Impacto:** 2 componentes

---

### 🔴 FASE 6: USUÁRIOS & ADMIN (Semana 3-4)

**Objetivo:** Remover 25+ mocks de usuários

**Checklist:**

- [ ] Criar `usuarioService.ts`
- [ ] Refatorar `Usuarios.tsx` (admin)
- [ ] Refatorar `Disciplinas.tsx` (admin)
- [ ] Refatorar headers de admin
- [ ] Remover `mockUsuarios`
- [ ] Testes: filtro, busca, CRUD
- [ ] Deploy sem erros

**Duração:** 4-5 dias  
**Risco:** Alto (múltiplos arquivos)  
**Impacto:** 5+ componentes

---

### 🟠 FASE 7: TRANSAÇÕES (Semana 4)

**Objetivo:** Remover 3 mocks de transações

**Checklist:**

- [ ] Criar `compraService.ts`
- [ ] Refatorar `compras-transacoes.tsx`
- [ ] Refatorar `compras-relatorios.tsx`
- [ ] Remover `mockTransacoes` de `compras.ts`
- [ ] Testes: filtro, relatórios
- [ ] Deploy sem erros

**Duração:** 2-3 dias  
**Risco:** Médio  
**Impacto:** 2 componentes

---

### 🟡 FASE 8: CONFIGS PROFESSOR (Semana 4-5)

**Objetivo:** Remover 8+ mocks de configuração

**Checklist:**

- [ ] Criar `professorConfigService.ts`
- [ ] Refatorar `PontosPrecos.tsx`
- [ ] Refatorar `ConfigMoedasProfessor.tsx`
- [ ] Refatorar `DesempenhoPorTurma.tsx`
- [ ] Refatorar `NotasAlunos.tsx`
- [ ] Testes: salvar config, listar notas
- [ ] Deploy sem erros

**Duração:** 3-4 dias  
**Risco:** Médio  
**Impacto:** 4+ componentes

---

## 📈 CRONOGRAMA VISUAL

```
Semana 1:
├─ Seg-Ter: Preparação (3 dias)
├─ Qua-Sex: Notificações P1 (3 dias) ← CONCLUIR SEMANA 1

Semana 2:
├─ Seg-Ter: Notificações P2 (2 dias) ← CONCLUIR
├─ Qua-Qui: Ranking & Moedas (2 dias) ← CONCLUIR
└─ Sex: Atividades P1 (1 dia)

Semana 3:
├─ Seg-Ter: Atividades P2 (2 dias) ← CONCLUIR
├─ Qua-Qui: Resumos/Videos (2 dias) ← CONCLUIR
└─ Sex: Usuários P1 (1 dia)

Semana 4:
├─ Seg-Ter: Usuários P2 (2 dias) ← CONCLUIR
├─ Qua-Qui: Transações (2 dias) ← CONCLUIR
└─ Sex: Configs P1 (1 dia)

Semana 5:
├─ Seg-Ter: Configs P2 (2 dias) ← CONCLUIR
├─ Qua: Testes integrais (1 dia)
├─ Qui: Fixes (1 dia)
└─ Sex: Deploy final (1 dia)
```

---

## 🎯 MARCOS IMPORTANTES

| Semana | Marco                       | Status | Validação |
| ------ | --------------------------- | ------ | --------- |
| 1      | DB validado + Preparação    | ⏳     | [ ]       |
| 2      | Notificações + Ranking live | ⏳     | [ ]       |
| 3      | Atividades + Resumos live   | ⏳     | [ ]       |
| 4      | Usuários + Transações live  | ⏳     | [ ]       |
| 5      | Configs + Deploy final      | ⏳     | [ ]       |

---

## 🚨 RISCOS E MITIGAÇÃO

### RISCO 1: Dados Vazios

```
Problema: Usuário sem dados = tela em branco
Mitigação: Implementar EmptyState + fallbacks
Status: ✅ Código pronto (EmptyState.tsx)
```

### RISCO 2: Erros de Conexão

```
Problema: Supabase offline = sem dados
Mitigação: Error handling robusto + retry logic
Status: ✅ Código pronto (ErrorBoundary.tsx)
```

### RISCO 3: Performance

```
Problema: Carregar 1000+ itens sem paginação
Mitigação: Implementar limit/offset, lazy loading
Status: ✅ Plano definido
```

### RISCO 4: Sincronização de Estado

```
Problema: Dados desincronizados entre abas
Mitigação: React Query + cache invalidation
Status: ⏳ Recomendado implementar
```

### RISCO 5: Quebra de Componentes

```
Problema: Remover mock que ainda é usado
Mitigação: Remover gradualmente + testes
Status: ✅ Fases sequenciais planejadas
```

---

## 📚 DOCUMENTAÇÃO CRIADA

✅ **RELATORIO-MOCKS-REMOCAO.md** (este arquivo)
└─ Análise completa de todos os 74+ mocks
└─ Impacto em componentes
└─ Plano de 8 fases
└─ Riscos e mitigação
└─ Estado ideal do projeto

✅ **IMPLEMENTACAO-CODIGO-PRONTO.md**
└─ 7 serviços prontos para copiar/colar
└─ 3 hooks custom
└─ Componentes refatorados
└─ Queries SQL para views
└─ Error handling

✅ **Este Arquivo (Resumo Executivo)**
└─ Visão rápida do projeto
└─ Checklist por fase
└─ Cronograma visual
└─ Próximos passos

---

## 🚀 PRÓXIMOS PASSOS (HOJE)

### 1️⃣ Validar com Equipe

- [ ] Revisar relatórios
- [ ] Confirmar recursos disponíveis
- [ ] Agendar kick-off meeting

### 2️⃣ Preparar Ambiente

- [ ] Criar branch: `refactor/remove-mocks`
- [ ] Validar Supabase schema
- [ ] Setup de CI/CD (rejeitar "mock" em commits)

### 3️⃣ Iniciar Fase 1

- [ ] Criar `supabaseSchema.ts`
- [ ] Criar `types/database.ts`
- [ ] Estruturar `/services`
- [ ] Fazer primeiro commit

### 4️⃣ Iniciar Fase 2 (Próxima Semana)

- [ ] Criar `notificacaoService.ts`
- [ ] Code review
- [ ] Mergear para staging

---

## 📞 RESPONSABILIDADES SUGERIDAS

| Pessoa    | Tarefas          | Duração   |
| --------- | ---------------- | --------- |
| Dev 1     | Fase 1 + Fase 2  | 2 semanas |
| Dev 2     | Fase 3 + Fase 4  | 2 semanas |
| Dev 3     | Fase 5 + Fase 6  | 2 semanas |
| QA        | Testes contínuos | 5 semanas |
| Tech Lead | Code reviews     | 5 semanas |

---

## ✔️ DEFINIÇÃO DE PRONTO (DoD)

Cada fase é considerada PRONTA quando:

```
✅ Serviço criado com tipagem completa
✅ Componentes refatorados e testados
✅ Mocks removidos de forma segura
✅ Spinners/EmptyStates implementados
✅ Error handling robusto
✅ Code review aprovado
✅ Testes passando
✅ Deploy sem erros
✅ Monitoramento em produção
```

---

## 🎓 LIÇÕES APRENDIDAS

Após remover todos os mocks, documentar:

1. **Padrões que funcionaram**
   - Qual estrutura de serviço é melhor?
   - Como organizar queries complexas?

2. **Padrões que não funcionaram**
   - O que causou mais bugs?
   - Quais foram os gargalos?

3. **Próximas melhorias**
   - Implementar React Query?
   - Adicionar caching?
   - Melhorar paginação?

---

## 📊 MÉTRICAS DE SUCESSO

| Métrica                  | Antes | Depois | Meta    |
| ------------------------ | ----- | ------ | ------- |
| Mocks no código          | 74+   | 0      | ✅ 0    |
| Linhas em `/lib/mock/`   | 748   | 0      | ✅ 0    |
| Serviços                 | 1     | 7+     | ✅ 7+   |
| Componentes com mock     | 58+   | 0      | ✅ 0    |
| Testes de integração     | ?     | +50    | ✅ +50  |
| Performance (FCP)        | ?     | -10%   | ✅ -10% |
| Bugs relacionados a data | ?     | -90%   | ✅ -90% |

---

## 🎬 CONCLUSÃO

Este projeto de **remover 74+ mocks** é ambicioso mas alcançável:

✅ **Viável:** Código já está parcialmente refatorado  
✅ **Seguro:** Plano sequencial previne quebras  
✅ **Documentado:** Temos código pronto para implementar  
✅ **Testável:** Cada fase é independente e testável  
✅ **Realizável:** 4-5 semanas com equipe dedicada

---

## 📖 DOCUMENTOS RELACIONADOS

1. 📄 **RELATORIO-MOCKS-REMOCAO.md** - Análise Completa (35+ páginas)
2. 💻 **IMPLEMENTACAO-CODIGO-PRONTO.md** - Código Pronto (30+ páginas)
3. 📋 **Este Arquivo** - Resumo Executivo

---

**Criado em:** 9 de Dezembro de 2025  
**Status:** ✅ PRONTO PARA EXECUÇÃO  
**Versão:** 1.0
