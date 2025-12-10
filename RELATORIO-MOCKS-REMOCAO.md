# RELATÓRIO: Remoção Completa de Dados Mockados

**Data:** 9 de Dezembro de 2025  
**Status:** Análise Completa + Plano de Migração  
**Objetivo:** Substituir todos os mocks por dados reais do Supabase com segurança

---

## 📊 SUMÁRIO EXECUTIVO

O projeto `front-coins` contém **74+ mocks** distribuídos em:

- **4 arquivos centralizados** (`/src/lib/mock/`)
- **20+ componentes com mocks inline**
- **Estados mockados** em páginas e módulos

**Risco Crítico:** Múltiplas telas quebram sem dados (Usuários, Disciplinas, Notas, Transações, Ranking, etc.)

**Bom Sinal:** Parcial migração já iniciada - alguns componentes buscam dados reais do Supabase (ex: `Disciplinas.tsx`, `ComprarPontos.tsx`)

---

## 🎯 MOCKS ENCONTRADOS

### 1. **ARQUIVO CENTRAL: `/src/lib/mock/aluno.ts` (569 linhas)**

#### Tipos de Dados Mockados:

| Mock                          | Tipo               | Quantidade | Componentes que Usam                                 |
| ----------------------------- | ------------------ | ---------- | ---------------------------------------------------- |
| **disciplinas**               | Array<Disciplina>  | 7          | Resumos, Videoaulas, ComprarPontos, páginas aluno/\* |
| **atividades**                | Array<Atividade>   | 12         | Atividades.tsx, páginas [id].tsx                     |
| **resumos**                   | Array<Resumo>      | 8          | Resumos.tsx, GraficoMoedas.tsx                       |
| **videoaulas**                | Array<Videoaula>   | 7          | Videoaulas.tsx                                       |
| **notas**                     | Array<Nota>        | 3          | Dashboard aluno (indireto)                           |
| **rankingTurma**              | Array<Ranking>     | 20 alunos  | GraficoMoedas.tsx (ranking visual)                   |
| **moedasPorMes**              | Array<MoedaMes>    | 12 meses   | GraficoMoedas.tsx, Atividades.tsx                    |
| **professores**               | Array<Professor>   | 3          | ComprarPontos.tsx (seleção)                          |
| **precosPontosPorDisciplina** | Array<Preco>       | 7          | ComprarPontos.tsx                                    |
| **calendarioRevisao**         | Array<Evento>      | 2          | Frequencia.tsx, AgendaEstudos.tsx                    |
| **notificacoes**              | Array<Notificacao> | 5          | Dashboard aluno                                      |

#### Fonte Real Identificada:

```
✓ vw_disciplinas_moedas_aluno (VIEW no Supabase)
  └─ Já está sendo usada em Disciplinas.tsx!

✓ alunos_atividades + atividades + disciplinas (TABELAS)
  └─ Service: alunoService.ts já implementado

✓ vw_ranking_turma (possível VIEW ou query)
  └─ Ainda não implementada
```

---

### 2. **ARQUIVO: `/src/lib/mock/professor.ts` (52 linhas)**

#### Dados Mockados:

| Mock                   | Uso                                  | Referência          |
| ---------------------- | ------------------------------------ | ------------------- |
| **professor** (object) | HeaderProfessor, pages /professor/\* | ProfessorHeader.tsx |
| **notificacoes**       | Dropdown notificações                | ProfessorHeader.tsx |

#### Componentes Afetados:

- `ProfessorHeader.tsx` (importa `professor` para exibir nome/disciplina)
- `pages/professor/*` (pode depender de dados do usuário logado)

#### Fonte Real Esperada:

```
✓ auth.getUser() + usuários (tabela)
✓ professores (tabela) - vinculada a usuário
✓ notificacoes (tabela com tipo=sistema|atividade|nota)
```

---

### 3. **ARQUIVO: `/src/lib/mock/admin.ts` (50 linhas)**

#### Dados Mockados:

| Mock                  | Uso                                     |
| --------------------- | --------------------------------------- |
| **admin** (object)    | HeaderAdm.tsx - exibir nome/email/cargo |
| **adminNotificacoes** | Dropdown notificações admin             |

#### Componentes Afetados:

- `HeaderAdm.tsx`
- `pages/adm/*`

#### Fonte Real Esperada:

```
✓ auth.getUser() + usuários (tipo='administrador')
✓ notificacoes (tabela com tipo=alerta|backup|manutencao)
```

---

### 4. **ARQUIVO: `/src/lib/mock/compras.ts` (77 linhas)**

#### Dados Mockados:

| Mock               | Quantidade   | Componentes                                    |
| ------------------ | ------------ | ---------------------------------------------- |
| **mockTransacoes** | 3 transações | compras-transacoes.tsx, compras-relatorios.tsx |

#### Fonte Real Esperada:

```
✓ compras (tabela principal)
✓ alunos + disciplinas + professores (joins)
✓ cancelamentos (relacionamento)
```

---

### 5. **MOCKS INLINE (Espalhados nos Componentes)**

#### 5.1 - **Notificações (Inline)**

| Arquivo               | Mock               | Tipo      | Dados          |
| --------------------- | ------------------ | --------- | -------------- |
| `Notificacoes.tsx`    | notificacoes array | Hardcoded | 5 notificações |
| `AlunoHeader.tsx`     | mockNotifications  | Hardcoded | 4 notificações |
| `ProfessorHeader.tsx` | mockNotifications  | Hardcoded | 3 notificações |
| `HeaderAdm.tsx`       | mockNotifications  | Hardcoded | 4 notificações |

**Padrão:** `const [notifications, setNotifications] = useState(mockNotifications);`

---

#### 5.2 - **Dados de Turma/Desempenho (Professor)**

| Arquivo                  | Mock                 | Quantidade   | Tipo      |
| ------------------------ | -------------------- | ------------ | --------- |
| `DesempenhoPorTurma.tsx` | mockTurmas           | 3 turmas     | Hardcoded |
| `DesempenhoPorTurma.tsx` | mockDesempenhoMensal | 6 meses      | Hardcoded |
| `NotasAlunos.tsx`        | mockNotas            | 5 alunos     | Hardcoded |
| `MoedasPorAtividade.tsx` | mockAtividades       | 8 atividades | Hardcoded |
| `RevisoesResumos.tsx`    | mockConteudos        | 6 conteúdos  | Hardcoded |

---

#### 5.3 - **Dados Admin**

| Arquivo                      | Mock                  | Quantidade       |
| ---------------------------- | --------------------- | ---------------- |
| `Usuarios.tsx`               | mockUsuarios          | 5 usuários       |
| `Disciplinas.tsx` (admin)    | mockDisciplinas       | 8 disciplinas    |
| `Usuarios.tsx`               | tipos, status         | Arrays de filter |
| `Disciplinas.tsx` (admin)    | areas                 | Array de filtro  |
| `ModeloEnsino.tsx`           | mockModelos           | 3 modelos        |
| `SeparacaoPorDisciplina.tsx` | mockDisciplinasMoedas | 5 disciplinas    |
| `MediasPorDisciplina.tsx`    | mockMedias            | 5 disciplinas    |
| `PrazoMoedas.tsx`            | mockConfiguracoes     | 4 configurações  |

---

#### 5.4 - **Dados Professor**

| Arquivo                                    | Mock             | Quantidade    |
| ------------------------------------------ | ---------------- | ------------- |
| `PontosPrecos.tsx`                         | mockPrecos       | 3 itens       |
| `PontosPrecos.tsx`                         | mockConfigPontos | 5 disciplinas |
| `ConfigMoedasProfessor.tsx` (inline stats) | stats object     | Calculado     |

---

#### 5.5 - **Dados Aluno - Especiais**

| Arquivo             | Mock                         | Tipo                 | Descrição              |
| ------------------- | ---------------------------- | -------------------- | ---------------------- |
| `Frequencia.tsx`    | mockRevisionEvents           | 5 eventos            | Hardcoded para revisão |
| `AgendaEstudos.tsx` | comentário                   | localStorage/offline | Sem mocks atuais       |
| `Ajuda.tsx`         | faqData                      | 10+ FAQs             | FAQ estático           |
| `Videoaulas.tsx`    | mockVideos                   | Import do aluno.ts   |                        |
| `Resumos.tsx`       | mockResumos                  | Import do aluno.ts   |                        |
| `GraficoMoedas.tsx` | (usa aluno.ts + queryString) | Misto                | Parcial real           |
| `Atividades.tsx`    | comentário "Dados mockados"  | Inline               | Não implementado       |

---

#### 5.6 - **Dados Layout & Navegação**

| Arquivo               | Mock            | Tipo      |
| --------------------- | --------------- | --------- |
| `AlunoLayout.tsx`     | menu array      | Navegação |
| `ProfessorLayout.tsx` | menu array      | Navegação |
| `SidebarAdm.tsx`      | items array     | Navegação |
| `MainLayout.tsx`      | navigationItems | Navegação |

**Nota:** Estes são **config/roteamento**, não dados funcionais - podem ser mantidos.

---

#### 5.7 - **Dados de Compra**

| Arquivo                                     | Mock            | Uso           |
| ------------------------------------------- | --------------- | ------------- |
| `comprar-pontos/[disciplina].tsx`           | disciplinasData | JSON estático |
| `comprar-pontos/[disciplina]/confirmar.tsx` | disciplinasData | JSON estático |

---

### 6. **COMPONENTES UI (NÃO SÃO MOCKS - Apenas configs visuais)**

- `componentes/adm/DashboardCards.tsx` - cards array (config)
- `componentes/ui/*` - componentes reutilizáveis (não mock)
- `módulos/aluno/tema.ts` - cores por disciplina (config)
- `componentes/professor/ConfigMoedasProfessor.tsx` - stats calculados

---

## 🔍 ANÁLISE DE DEPENDÊNCIAS

### **ALTA CRITICIDADE** (Telas quebram sem dados reais)

#### 1. **Ranking da Turma** ⚠️

```typescript
// src/modules/aluno/GraficoMoedas.tsx
- Usa: rankingTurma (mock aluno.ts)
- Impacto: Ranking vazio se removido
- Fonte Real: Precisamos de RPC ou VIEW
  └─ vw_ranking_turma (id_aluno, posicao, moedas, nome_aluno)
```

#### 2. **Notas do Aluno** ⚠️

```typescript
// Falta implementação real
- Onde: GraficoMoedas.tsx calcula "média"
- Usa: notas (mock aluno.ts)
- Fonte Real: alunos_avaliacoes + avaliacoes tabela
```

#### 3. **Transações de Compra** ⚠️

```typescript
// src/pages/adm/compras-transacoes.tsx
// src/pages/adm/compras-relatorios.tsx
- Usa: mockTransacoes
- Impacto: Relatórios vazios se removido
- Fonte Real: compras + alunos_compras (join)
```

#### 4. **Usuários Admin** ⚠️

```typescript
// src/modules/administrador/Usuarios.tsx
- Usa: mockUsuarios (hardcoded 5 usuários)
- Impacto: Tela mostra apenas 5 usuarios fictícios
- Fonte Real: usuários (tabela) + alunos/professores/admin
```

#### 5. **Disciplinas Admin** ⚠️

```typescript
// src/modules/administrador/Disciplinas.tsx
- Usa: mockDisciplinas
- Impacto: Não lista disciplinas reais
- Fonte Real: disciplinas (tabela)
```

#### 6. **Desempenho por Turma** ⚠️

```typescript
// src/modules/professor/DesempenhoPorTurma.tsx
- Usa: mockTurmas, mockDesempenhoMensal
- Impacto: Dados fictícios apenas
- Fonte Real: turmas + alunos + avaliacoes (joins)
```

#### 7. **Notificações (Todos os roles)** ⚠️

```typescript
// AlunoHeader, ProfessorHeader, HeaderAdm, Notificacoes
- Usa: hardcoded mockNotifications
- Impacto: Notificações não reais
- Fonte Real: notificacoes (tabela) .eq('id_usuario', userId)
```

### **MÉDIA CRITICIDADE** (Funcionalidades parciais quebram)

#### 8. **Notas do Professor**

```typescript
// src/modules/professor/NotasAlunos.tsx
- Usa: mockNotas
- Fonte Real: alunos + avaliacoes
```

#### 9. **Moedas por Atividade**

```typescript
// src/modules/professor/MoedasPorAtividade.tsx
- Usa: mockAtividades
- Fonte Real: atividades + alunos_atividades
```

#### 10. **Revisões de Resumos**

```typescript
// src/modules/professor/RevisoesResumos.tsx
- Usa: mockConteudos
- Fonte Real: resumos + alunos_resumos
```

#### 11. **Pontos e Preços**

```typescript
// src/modules/professor/PontosPrecos.tsx
- Usa: mockPrecos, mockConfigPontos
- Fonte Real: precos_itens + config_pontos (tabelas)
```

#### 12. **Frequência/Revisão**

```typescript
// src/modules/aluno/Frequencia.tsx
- Usa: mockRevisionEvents
- Fonte Real: revisoes_programadas (tabela)
```

### **BAIXA CRITICIDADE** (Dados visuais/complementares)

#### 13. **FAQ/Ajuda**

```typescript
// src/modules/aluno/Ajuda.tsx
- Usa: faqData
- Impacto: Pode ser mantido como estático
- Fonte Real: opcional - faq_items (tabela)
```

#### 14. **Configuração Admin**

```typescript
// src/modules/administrador/ModeloEnsino.tsx
// src/modules/administrador/SeparacaoPorDisciplina.tsx
// src/modules/administrador/MediasPorDisciplina.tsx
// src/modules/administrador/PrazoMoedas.tsx
- Usa: mockModelos, mockDisciplinas, mockMedias, mockConfiguracoes
- Impacto: Dados de configuração não persistem
- Fonte Real: config_* (tabelas de configuração)
```

---

## 📋 MAPEAMENTO COMPLETO: Mocks → Supabase

### **GRUPO 1: Disciplinas**

| Mock                | Localização     | Uso             | Substituição Real      | Status                        |
| ------------------- | --------------- | --------------- | ---------------------- | ----------------------------- |
| `disciplinas`       | aluno.ts        | Listar, filtrar | `disciplinas` (tabela) | ✅ Parcial em Disciplinas.tsx |
| `cores` (tema)      | tema.ts         | Visual apenas   | Manter (config)        | ✅ OK                         |
| `DISCIPLINA_VISUAL` | Disciplinas.tsx | Visual apenas   | Manter (config)        | ✅ OK                         |

**Função:** Buscar disciplinas reais da turma do aluno

```typescript
// Query Recomendada:
const { data } = await supabase
  .from("vw_disciplinas_moedas_aluno")
  .select("*")
  .eq("id_aluno", idAluno);
```

---

### **GRUPO 2: Atividades**

| Mock                    | Localização        | Uso             | Substituição                       | Status     |
| ----------------------- | ------------------ | --------------- | ---------------------------------- | ---------- |
| `atividades`            | aluno.ts (12)      | Listar, filtrar | `alunos_atividades` + `atividades` | ⏳ Parcial |
| `mockAtividades` (prof) | MoedasPorAtividade | Professor stats | `atividades` + joins               | ❌ Não     |

**Função:** Buscar atividades do aluno

```typescript
// Query Recomendada:
const { data } = await alunoService.getAtividades(alunoId);
// Já implementado em alunoService.ts!
```

---

### **GRUPO 3: Resumos**

| Mock      | Localização  | Uso    | Substituição       | Status              |
| --------- | ------------ | ------ | ------------------ | ------------------- |
| `resumos` | aluno.ts (8) | Listar | `resumos` (tabela) | ⏳ Não implementado |

**Função:** Buscar resumos por disciplina

```typescript
const { data } = await supabase
  .from("resumos")
  .select("*, disciplinas(nome)")
  .eq("id_disciplina", disciplinaId);
```

---

### **GRUPO 4: Videoaulas**

| Mock         | Localização  | Uso                | Substituição          | Status              |
| ------------ | ------------ | ------------------ | --------------------- | ------------------- |
| `videoaulas` | aluno.ts (7) | Listar, reproduzir | `videoaulas` (tabela) | ⏳ Não implementado |

---

### **GRUPO 5: Notas & Avaliações**

| Mock               | Localização         | Uso              | Substituição                       | Status |
| ------------------ | ------------------- | ---------------- | ---------------------------------- | ------ |
| `notas`            | aluno.ts (3)        | Dashboard        | `alunos_avaliacoes` + `avaliacoes` | ❌ Não |
| `mockNotas` (prof) | NotasAlunos.tsx (5) | Professor listar | `alunos_avaliacoes`                | ❌ Não |

---

### **GRUPO 6: Ranking**

| Mock           | Localização   | Uso            | Substituição              | Status |
| -------------- | ------------- | -------------- | ------------------------- | ------ |
| `rankingTurma` | aluno.ts (20) | Gráfico moedas | `vw_ranking_turma` ou RPC | ❌ Não |

**Impacto Alto:** GraficoMoedas.tsx exibe ranking vazio sem isso

---

### **GRUPO 7: Moedas por Período**

| Mock           | Localização   | Uso               | Substituição                  | Status |
| -------------- | ------------- | ----------------- | ----------------------------- | ------ |
| `moedasPorMes` | aluno.ts (12) | Gráfico tendência | Query de transações agrupadas | ❌ Não |

---

### **GRUPO 8: Notificações**

| Mock                | Localização     | Quantidade | Substituição            | Status |
| ------------------- | --------------- | ---------- | ----------------------- | ------ |
| `notificacoes`      | aluno.ts        | 5          | `notificacoes` (tabela) | ❌ Não |
| `mockNotifications` | AlunoHeader     | 4          | `notificacoes`          | ❌ Não |
| `mockNotifications` | ProfessorHeader | 3          | `notificacoes`          | ❌ Não |
| `mockNotifications` | HeaderAdm       | 4          | `notificacoes`          | ❌ Não |

---

### **GRUPO 9: Usuários & Perfis**

| Mock                 | Localização  | Uso          | Substituição                     | Status     |
| -------------------- | ------------ | ------------ | -------------------------------- | ---------- |
| `professor` (object) | professor.ts | Header prof  | `auth.getUser()` + `professores` | ⏳ Parcial |
| `admin` (object)     | admin.ts     | Header admin | `auth.getUser()` + `usuarios`    | ⏳ Parcial |
| `mockUsuarios`       | Usuarios.tsx | Admin listar | `usuarios` (tabela)              | ❌ Não     |

---

### **GRUPO 10: Transações de Compra**

| Mock             | Localização       | Uso              | Substituição      | Status |
| ---------------- | ----------------- | ---------------- | ----------------- | ------ |
| `mockTransacoes` | compras\*.tsx (3) | Admin relatórios | `compras` + joins | ❌ Não |

---

### **GRUPO 11: Configurações**

| Mock                    | Localização                | Uso            | Substituição       | Status |
| ----------------------- | -------------------------- | -------------- | ------------------ | ------ |
| `mockPrecos`            | PontosPrecos.tsx           | Tabela preços  | `precos_itens`     | ❌ Não |
| `mockConfigPontos`      | PontosPrecos.tsx           | Config pontos  | `config_pontos`    | ❌ Não |
| `mockConfiguracoes`     | PrazoMoedas.tsx            | Prazos         | `config_prazos`    | ❌ Não |
| `mockModelos`           | ModeloEnsino.tsx           | Modelos ensino | `modelos_ensino`   | ❌ Não |
| `mockMedias`            | MediasPorDisciplina.tsx    | Médias config  | `config_medias`    | ❌ Não |
| `mockDisciplinasMoedas` | SeparacaoPorDisciplina.tsx | Separação      | `config_separacao` | ❌ Não |

---

## 🔧 ESTRUTURA ESPERADA DO SUPABASE

### **Tabelas Críticas (Já devem existir)**

```
✓ disciplinas
✓ usuários
✓ alunos
✓ professores
✓ turmas
✓ atividades
✓ alunos_atividades
✓ resumos
✓ videoaulas
```

### **Views/RPCs Necessários**

```
⏳ vw_disciplinas_moedas_aluno (já sendo usada)
⏳ vw_ranking_turma
⏳ vw_moedas_por_mes (aluno)
⏳ rpc_notificacoes_usuario
```

### **Tabelas que Podem Faltar**

```
❌ notificacoes
❌ compras / alunos_compras
❌ alunos_avaliacoes
❌ avaliacoes
❌ precos_itens
❌ config_pontos
❌ revisoes_programadas
❌ resumos_avaliacoes
```

---

## 🚨 PRINCIPAIS RISCOS

### **RISCO 1: Dados Vazios Durante Transição**

```
Problema: Remover mock antes de ter dados reais
Exemplo: Usuário novo sem atividades → tela em branco
Solução: Implementar "empty states" + spinners + fallbacks
```

### **RISCO 2: Relações Quebradas**

```
Problema: Query não retorna joins esperados
Exemplo: atividades sem disciplina vinculada
Solução: Validar schema Supabase + testar joins
```

### **RISCO 3: Performance**

```
Problema: Carregar 1000+ registros sem paginação
Solução: Implementar limit/offset, lazy loading
```

### **RISCO 4: Cache/Sincronização**

```
Problema: Dados desincronizados entre abas
Solução: Usar Context API ou React Query + invalidation
```

### **RISCO 5: Quebra de Componentes durante Deploy**

```
Problema: Componentes antigos tentam usar mock removido
Solução: Remover gradualmente + testes
```

---

## 📝 LISTA COMPLETA DE MOCKS (74+ encontrados)

### **Arquivos Mock Centralizados (4)**

```
1. aluno.ts - disciplinas (7)
2. aluno.ts - atividades (12)
3. aluno.ts - resumos (8)
4. aluno.ts - videoaulas (7)
5. aluno.ts - notas (3)
6. aluno.ts - rankingTurma (20)
7. aluno.ts - moedasPorMes (12)
8. aluno.ts - professores (3)
9. aluno.ts - precosPontosPorDisciplina (7)
10. aluno.ts - calendarioRevisao (2)
11. aluno.ts - notificacoes (5)
12. professor.ts - professor (1 object)
13. professor.ts - notificacoes (4)
14. admin.ts - admin (1 object)
15. admin.ts - adminNotificacoes (5)
16. compras.ts - mockTransacoes (3)
```

### **Mocks Inline em Componentes (58+)**

#### **ALUNO (20+)**

```
17. Notificacoes.tsx:8 - notificacoes array (5)
18. AlunoHeader.tsx:16 - mockNotifications (4)
19. Ajuda.tsx:13 - faqData (10+)
20. Frequencia.tsx:44 - mockRevisionEvents (5)
21. GraficoMoedas.tsx - usa imports (aluno, ranking, moedas)
22. Resumos.tsx:3 - import mockResumos
23. Videoaulas.tsx:3 - import mockVideos
24. ComprarPontos.tsx:10 - import disciplinas, precosPontosPorDisciplina
25. Atividades.tsx:27 - "Dados mockados das atividades"
```

#### **PROFESSOR (15+)**

```
26. ProfessorHeader.tsx:7 - import professor
27. ProfessorHeader.tsx:16 - mockNotifications (3)
28. DesempenhoPorTurma.tsx:32 - mockTurmas (3)
29. DesempenhoPorTurma.tsx:65 - mockDesempenhoMensal (6)
30. NotasAlunos.tsx:29 - mockNotas (5)
31. MoedasPorAtividade.tsx:31 - mockAtividades (8)
32. MoedasPorAtividade.tsx:87 - tipos array
33. MoedasPorAtividade.tsx:90 - colors object
34. RevisoesResumos.tsx:28 - mockConteudos (6)
35. RevisoesResumos.tsx:76 - variants object
36. PontosPrecos.tsx:36 - mockPrecos (3)
37. PontosPrecos.tsx:66 - mockConfigPontos (5)
38. PontosPrecos.tsx:102 - colors object
39. ConfigMoedasProfessor.tsx:74 - stats object (calculado)
40. TurmasProfessor.tsx:89 - stats object (calculado)
```

#### **ADMINISTRADOR (15+)**

```
41. HeaderAdm.tsx:7 - import admin
42. HeaderAdm.tsx:16 - mockNotifications (4)
43. DashboardCards.tsx:37 - cards array (4)
44. Usuarios.tsx:34 - mockUsuarios (5)
45. Usuarios.tsx:95 - tipos array
46. Usuarios.tsx:96 - status array
47. Usuarios.tsx:112 - colors object
48. Usuarios.tsx:121 - colors object
49. Usuarios.tsx:167 - estatisticas object
50. Disciplinas.tsx:32 - mockDisciplinas (8)
51. Disciplinas.tsx:93 - areas array
52. Disciplinas.tsx:111 - colors object
53. ModeloEnsino.tsx:26 - mockModelos (3)
54. SeparacaoPorDisciplina.tsx:32 - mockConfig
55. SeparacaoPorDisciplina.tsx:39 - mockDisciplinasMoedas (5)
56. MediasPorDisciplina.tsx:27 - mockMedias (5)
57. MediasPorDisciplina.tsx:77 - mockConfigGeral
58. PrazoMoedas.tsx:26 - mockConfiguracoes (4)
```

#### **PÁGINAS (8+)**

```
59. pages/aluno/index.tsx:7 - import mockAtividades
60. pages/aluno/[id].tsx:8 - import mockAtividades
61. pages/aluno/[id].tsx:81 - filter por disciplina
62. pages/adm/perfil.tsx:15 - import admin
63. pages/adm/compras-transacoes.tsx:24 - import mockTransacoes
64. pages/adm/compras-relatorios.tsx:20 - import mockTransacoes
65. pages/adm/compras-relatorios.tsx:33 - useMemo filter
66. pages/aluno/comprar-pontos/[disciplina].tsx:23 - disciplinasData JSON
67. pages/aluno/comprar-pontos/[disciplina]/confirmar.tsx:25 - disciplinasData JSON
```

#### **LAYOUT (4+)**

```
68. AlunoLayout.tsx:46 - menu array (config, OK manter)
69. ProfessorLayout.tsx:49 - menu array (config, OK manter)
70. SidebarAdm.tsx:24 - items array (config, OK manter)
71. MainLayout.tsx:11 - navigationItems (config, OK manter)
```

#### **OUTROS**

```
72. StudentHistoryDialog.tsx:28 - comentário "Mock data"
73. componentes/professor/ResumosProfessor.tsx:89 - stats object
74. consolidar-disciplinas.js:9 - Array de duplicados (script, OK remover)
```

---

## ✅ CHECKLIST: O QUE JÁ ESTÁ FUNCIONANDO COM DADOS REAIS

```typescript
✅ Disciplinas.tsx
   └─ Usa: vw_disciplinas_moedas_aluno (Supabase)
   └─ Status: 100% Funcional

✅ ComprarPontos.tsx (parcial)
   └─ Usa: vw_disciplinas_moedas_aluno + mocks para preços
   └─ Status: 60% Funcional

✅ alunoService.ts
   └─ Implementa: getAtividades(alunoId)
   └─ Status: Serviço pronto, apenas não usado em todos os lugares

✅ Autenticação
   └─ Usa: Supabase Auth + tabela usuários
   └─ Status: 100% Funcional

✅ GraficoMoedas.tsx (parcial)
   └─ Usa: Supabase para disciplinas
   └─ Mas ainda usa: mock para ranking e gráficos
   └─ Status: 50% Funcional
```

---

## 🎯 PLANO DE MIGRAÇÃO SEGURA (8 Fases)

### **FASE 1: Preparação e Validação (Semana 1)**

**Objetivo:** Mapear banco de dados real e criar bases para migração

```typescript
// 1.1 - Criar arquivo: src/services/supabaseSchema.ts
// Documentar todas as tabelas/views existentes

// 1.2 - Validar Supabase
// Confirmar que tabelas críticas existem e têm dados

// 1.3 - Adicionar tipos TypeScript para cada tabela
// src/types/database.ts
export type Disciplina = { ... }
export type Atividade = { ... }
export type Usuario = { ... }
// etc.

// 1.4 - Criar serviços para cada área
src/services/disciplinaService.ts
src/services/atividadeService.ts
src/services/usuarioService.ts
src/services/notificacaoService.ts
// etc.
```

**Riscos Mitigados:**

- ❌ Quebra de tipos TypeScript
- ❌ Queries malformadas

---

### **FASE 2: Substituir Notificações (Semana 1-2)**

**Por que primeiro?** São usadas em 4 lugares, mudança é localizada

#### 2.1 - Criar Serviço

```typescript
// src/services/notificacaoService.ts
export async function getNotificacoes(usuarioId: string) {
  const { data, error } = await supabase
    .from("notificacoes")
    .select("*")
    .eq("id_usuario", usuarioId)
    .order("data_hora", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}
```

#### 2.2 - Refatorar Componentes

```typescript
// AlunoHeader.tsx
const [notifications, setNotifications] = useState<Notificacao[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function carregarNotificacoes() {
    try {
      const data = await getNotificacoes(usuarioId);
      setNotifications(data);
    } catch (e) {
      console.error(e);
      setNotifications([]); // empty state
    } finally {
      setLoading(false);
    }
  }
  carregarNotificacoes();
}, [usuarioId]);

// Adicionar spinner se loading
if (loading) return <Spinner />;

// Renderizar com dados reais
return notifications.map(notif => ...)
```

#### 2.3 - Atualizar aluno.ts

```typescript
// src/lib/mock/aluno.ts
// Remover: export const notificacoes = [...]
// (Não será mais necessário)
```

**Arquivos Afetados:**

- AlunoHeader.tsx
- ProfessorHeader.tsx
- HeaderAdm.tsx
- Notificacoes.tsx
- aluno.ts (remover export)

**Testes Necessários:**

- [ ] Notificações carregam corretamente
- [ ] Empty state funciona (usuário sem notificações)
- [ ] Spinner mostra enquanto carrega
- [ ] Erro é tratado graciosamente

---

### **FASE 3: Substituir Ranking & Moedas por Mês (Semana 2)**

**Crítico:** Afeta GraficoMoedas.tsx

#### 3.1 - Criar RPC ou VIEW no Supabase

```sql
-- Ranking da turma do aluno
CREATE VIEW vw_ranking_turma AS
SELECT
  ROW_NUMBER() OVER (ORDER BY sum(mc.moedas_conquistadas) DESC) as posicao,
  u.nome,
  a.id_aluno,
  sum(mc.moedas_conquistadas) as moedas
FROM alunos a
JOIN usuarios u ON a.id_usuario = u.id_usuario
LEFT JOIN moedas_conquistadas mc ON a.id_aluno = mc.id_aluno
GROUP BY a.id_aluno, u.nome
ORDER BY moedas DESC;

-- Moedas por mês
CREATE VIEW vw_moedas_por_mes_aluno AS
SELECT
  DATE_TRUNC('month', mc.data_conquista)::date as mes,
  sum(mc.moedas_conquistadas) as valor,
  a.id_aluno
FROM moedas_conquistadas mc
JOIN alunos a ON mc.id_aluno = a.id_aluno
GROUP BY DATE_TRUNC('month', mc.data_conquista), a.id_aluno;
```

#### 3.2 - Criar Serviço

```typescript
// src/services/graficoService.ts
export async function getRankingTurma(turmaId: number) {
  const { data, error } = await supabase
    .from("vw_ranking_turma")
    .select("*")
    .eq("id_turma", turmaId);

  if (error) throw error;
  return data;
}

export async function getMoedasPorMes(alunoId: number, ano: number) {
  const { data, error } = await supabase
    .from("vw_moedas_por_mes_aluno")
    .select("*")
    .eq("id_aluno", alunoId)
    .eq("EXTRACT(year FROM mes)", ano);

  if (error) throw error;
  return data;
}
```

#### 3.3 - Refatorar GraficoMoedas.tsx

```typescript
useEffect(() => {
  async function carregarDados() {
    try {
      const [ranking, meses] = await Promise.all([
        getRankingTurma(turmaId),
        getMoedasPorMes(alunoId, 2025),
      ]);

      setRanking(ranking);
      setMoedasPorMes(meses);
    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar gráficos");
    }
  }
  carregarDados();
}, [turmaId, alunoId]);
```

**Arquivos Afetados:**

- GraficoMoedas.tsx
- aluno.ts (remover rankingTurma, moedasPorMes)

**Testes:**

- [ ] Ranking carrega
- [ ] Gráfico moedas exibe dados corretos
- [ ] Empty state se turma vazia

---

### **FASE 4: Substituir Atividades (Semana 2-3)**

**Impacto:** Atividades.tsx, pages/aluno/[id].tsx

#### 4.1 - Estender alunoService.ts (já parcial)

```typescript
// src/services/alunoService.ts - adicionar
export async function getAtividadesPorDisciplina(
  alunoId: number,
  disciplinaId: number
) {
  // Usar query existente + filtro disciplina
}

export async function marcarAtividadeConcluida(
  alunoId: number,
  atividadeId: number
) {
  // INSERT em alunos_atividades com status=concluida
}
```

#### 4.2 - Atualizar Atividades.tsx

```typescript
const [atividades, setAtividades] = useState<Atividade[]>([]);

useEffect(() => {
  async function carregar() {
    try {
      const data = await alunoService.getAtividades(alunoId);
      setAtividades(data);
    } catch (e) {
      setErro("Erro ao carregar atividades");
    }
  }
  carregar();
}, [alunoId]);
```

**Arquivos Afetados:**

- Atividades.tsx
- pages/aluno/index.tsx
- pages/aluno/[id].tsx
- alunoService.ts (estender)
- aluno.ts (remover atividades)

**Testes:**

- [ ] Atividades do aluno carregam
- [ ] Filtro por disciplina funciona
- [ ] Marcar como concluída atualiza BD

---

### **FASE 5: Substituir Resumos e Videoaulas (Semana 3)**

**Similar à Fase 4**

```typescript
// src/services/conteudoService.ts
export async function getResumos(alunoId: number, disciplinaId?: number) {}
export async function getVideoaulas(disciplinaId: number) {}
```

**Arquivos Afetados:**

- Resumos.tsx
- Videoaulas.tsx
- aluno.ts (remover)

---

### **FASE 6: Substituir Usuários/Admin (Semana 3-4)**

**Crítico:** Admin CRUD de usuários

#### 6.1 - Criar usuarioService.ts

```typescript
export async function getUsuarios(filtros?: any) {
  let query = supabase.from("usuarios").select(`
    id_usuario,
    nome,
    email,
    tipo,
    status,
    data_criacao,
    alunos(id_turma, moedas),
    professores(disciplinas)
  `);

  if (filtros?.tipo) query = query.eq("tipo", filtros.tipo);
  if (filtros?.status) query = query.eq("status", filtros.status);

  const { data, error } = await query;
  return data;
}
```

#### 6.2 - Refatorar Usuarios.tsx

```typescript
useEffect(() => {
  async function carregar() {
    const data = await getUsuarios({ tipo: filtroTipo, status: filtroStatus });
    setUsuarios(data);
  }
  carregar();
}, [filtroTipo, filtroStatus]);
```

**Arquivos Afetados:**

- Usuarios.tsx (admin)
- Disciplinas.tsx (admin)
- usuarioService.ts (novo)

---

### **FASE 7: Substituir Transações de Compra (Semana 4)**

**Impacto:** Relatórios admin

```typescript
// src/services/compraService.ts
export async function getTransacoes(filtros?: any) {
  const { data, error } = await supabase
    .from("compras")
    .select(
      `
      *,
      alunos(nome, id_turma),
      disciplinas(nome),
      professores(nome)
    `
    )
    .order("data", { ascending: false });

  return data;
}
```

**Arquivos Afetados:**

- compras-transacoes.tsx
- compras-relatorios.tsx
- compras.ts (remover mockTransacoes)

---

### **FASE 8: Configurações Professor (Semana 4-5)**

**Menos crítico mas importante**

```typescript
// src/services/professorConfigService.ts
export async function getPrecos(professorId: number) {}
export async function updateConfigPontos(config: any) {}
```

**Arquivos Afetados:**

- PontosPrecos.tsx
- Vários admin/\*

---

## 📊 CRONOGRAMA DETALHADO

| Semana | Fase           | Arquivos      | Risco |
| ------ | -------------- | ------------- | ----- |
| 1      | Preparação     | -             | Baixo |
| 1-2    | Notificações   | 4 componentes | Baixo |
| 2      | Ranking/Moedas | GraficoMoedas | Médio |
| 2-3    | Atividades     | 3 arquivos    | Médio |
| 3      | Resumos/Videos | 2 arquivos    | Baixo |
| 3-4    | Usuários       | Admin CRUD    | Alto  |
| 4      | Transações     | Relatórios    | Médio |
| 4-5    | Configs        | Professor     | Baixo |

**Total Estimado:** 4-5 semanas

---

## 🏗️ REFATORAÇÕES CRÍTICAS

### **1. Criar Sistema de Loaders/Spinners**

```typescript
// src/components/ui/LoadingState.tsx
export function LoadingState({ message = 'Carregando...' }) {
  return (
    <div className="flex items-center justify-center p-8">
      <Spinner />
      <span className="ml-2">{message}</span>
    </div>
  );
}

// Usar em todos os useEffect que carregam dados
if (loading) return <LoadingState />;
```

### **2. Criar Sistema de Empty States**

```typescript
// src/components/ui/EmptyState.tsx
export function EmptyState({
  title = 'Nenhum dado',
  description = 'Tente outra busca',
  icon = null
}) {
  return (
    <div className="text-center py-12">
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}
```

### **3. Criar Error Boundary**

```typescript
// src/components/ui/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  // Capturar erros de componentes filhos
  // Exibir mensagem amigável
}
```

### **4. Padronizar Tratamento de Erros**

```typescript
// Padrão para todos os serviços
try {
  const data = await supabase.from(...).select(...);
  if (error) throw error;
  return data;
} catch (e: any) {
  console.error('Erro ao buscar X:', e);
  throw new Error(`Falha ao carregar X: ${e.message}`);
}
```

### **5. Implementar React Query (Recomendado)**

```typescript
// Instalação
npm install @tanstack/react-query

// Uso
const { data: atividades, isLoading, error } = useQuery({
  queryKey: ['atividades', alunoId],
  queryFn: () => alunoService.getAtividades(alunoId)
});

// Automático:
// - Caching
// - Retry
// - Background updates
// - Deduplication
```

---

## 📚 BOAS PRÁTICAS PARA EVITAR MOCKS NO FUTURO

### **1. Padrão de Serviço**

```typescript
// SEMPRE usar um serviço centralizado para acessar dados
// ❌ RUIM
const [usuarios, setUsuarios] = useState(mockUsuarios);

// ✅ BOM
const { data: usuarios } = useQuery({
  queryKey: ["usuarios"],
  queryFn: () => usuarioService.getUsuarios(),
});
```

### **2. Tipagem Rigorosa**

```typescript
// ❌ RUIM
const data: any = await supabase.from(...).select(...);

// ✅ BOM
type Usuario = Database['public']['Tables']['usuarios']['Row'];
const { data: usuarios } = await supabase
  .from('usuarios')
  .select('*')
  .returns<Usuario[]>();
```

### **3. Validação com Zod**

```typescript
// src/types/validation.ts
import { z } from "zod";

export const usuarioSchema = z.object({
  id_usuario: z.number(),
  nome: z.string(),
  email: z.string().email(),
  tipo: z.enum(["aluno", "professor", "admin"]),
});

export type Usuario = z.infer<typeof usuarioSchema>;

// Usar para validar dados do Supabase
const usuario = usuarioSchema.parse(data);
```

### **4. Separação Clara: Config vs. Dados**

```typescript
// ✅ OK manter como static
export const CORES_DISCIPLINAS = { ... }
export const MENU_ITEMS = [ ... ]
export const FAQs = [ ... ]

// ❌ NUNCA como mock
export const mockUsuarios = [ ... ]
export const mockTransacoes = [ ... ]
```

### **5. Ambiente Local para Desenvolvimento**

```typescript
// src/lib/config.ts
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// Usar apenas em desenvolvimento se necessário
if (USE_MOCK_DATA) {
  // Carregar mocks
} else {
  // Carregar dados reais
}
```

### **6. Testes com MSW (Mock Service Worker)**

```typescript
// Para testes, usar MSW em vez de data mocks
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/usuarios', () => {
    return HttpResponse.json([...]);
  })
);

// Não contamina o código de produção
```

### **7. Commit com Qualidade**

```bash
# Nunca fazer commit de mocks
git add -p  # Interactive staging

# Mensagem clara
git commit -m "refactor: substituir mockAtividades por alunoService"

# Rebase se necessário
git rebase -i HEAD~3
```

---

## ✔️ CHECKLIST DE CONCLUSÃO POR FASE

### **Fase 1: Preparação**

- [ ] Arquivo `supabaseSchema.ts` documentando BD
- [ ] Types TypeScript para todas as tabelas
- [ ] Confirmação que BD tem dados suficientes
- [ ] Pasta `/services` estruturada

### **Fase 2: Notificações**

- [ ] Service `notificacaoService.ts` criado
- [ ] AlunoHeader.tsx refatorada
- [ ] ProfessorHeader.tsx refatorada
- [ ] HeaderAdm.tsx refatorada
- [ ] Notificacoes.tsx refatorada
- [ ] Mock removido de aluno.ts
- [ ] Testes passando
- [ ] Deploy sem erros

### **Fases 3-8**

- [ ] Service criado para área
- [ ] Componentes refatorados
- [ ] Mocks removidos
- [ ] Testes passando
- [ ] Deploy sem erros

### **Final**

- [ ] Pasta `/src/lib/mock/` vazia ou removida
- [ ] Nenhuma importação de mock\* no projeto
- [ ] Grep: `mockData|mockTransacoes|mockNotas` retorna 0
- [ ] Todos os componentes funcionando
- [ ] Performance verificada
- [ ] Documentação atualizada

---

## 🎓 ESTADO IDEAL DO PROJETO (SEM MOCKS)

```
src/
├── components/
│   └── * (todos usam dados reais via Context/Query)
├── pages/
│   └── * (todos usam serviços)
├── services/
│   ├── alunoService.ts ✅
│   ├── atividadeService.ts ✅
│   ├── notificacaoService.ts ✅
│   ├── usuarioService.ts ✅
│   ├── graficoService.ts ✅
│   ├── compraService.ts ✅
│   ├── professorService.ts ✅
│   └── * (todos com queries reais)
├── hooks/
│   ├── useNotificacoes.ts
│   ├── useAtividades.ts
│   ├── useUsuarios.ts
│   └── * (custom hooks para cada domínio)
├── lib/
│   ├── auth.ts
│   ├── supabaseClient.ts
│   ├── config.ts (APENAS config, nada de mock)
│   └── * (sem pasta /mock)
├── types/
│   └── database.ts (tipos gerados automaticamente)
├── contexts/
│   └── (se usar Context API para estado global)
└── styles/
```

**Estrutura Supabase Esperada:**

```
Tables:
- usuarios ✅
- alunos ✅
- professores ✅
- disciplinas ✅
- turmas ✅
- atividades ✅
- alunos_atividades ✅
- resumos ✅
- videoaulas ✅
- notificacoes ✅
- compras ✅
- alunos_avaliacoes ✅
- avaliacoes ✅
- precos_itens ✅
- config_pontos ✅

Views:
- vw_disciplinas_moedas_aluno ✅
- vw_ranking_turma ✅
- vw_moedas_por_mes_aluno ✅
```

---

## 📖 REFERENCIAS & RECURSOS

### Documentação

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/)

### Ferramentas Recomendadas

- **Supabase Studio** - Visual para tabelas/dados
- **pgAdmin** - Gerenciar PostgreSQL
- **Insomnia/Postman** - Testar queries antes de integrar

### Exemplos de Implementação

- Veja `Disciplinas.tsx` - bom exemplo de usar `vw_disciplinas_moedas_aluno`
- Veja `alunoService.ts` - padrão de serviço bem implementado
- Veja `ComprarPontos.tsx` - transição parcial mock + real

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. **Hoje:**
   - [ ] Validar este relatório com equipe
   - [ ] Confirmar schema Supabase (se precisa criar tabelas)
   - [ ] Designar responsável por cada fase

2. **Esta Semana:**
   - [ ] Iniciar Fase 1 (Preparação)
   - [ ] Criar plano de testes
   - [ ] Configurar CI/CD para auto-rejeitar commits com "mock"

3. **Próximas Semanas:**
   - [ ] Executar fases 2-8 sequencialmente
   - [ ] Deploy contínuo (feature branches)
   - [ ] Code reviews rigorosos

---

## 📞 CONTATO / DÚVIDAS

Qualquer dúvida sobre este relatório, confira:

- [ ] Documentação Supabase
- [ ] Schema do banco (pgAdmin)
- [ ] Services já implementados
- [ ] Componentes que já funcionam com dados reais

---

**Relatório Gerado em:** 9 de Dezembro de 2025  
**Versão:** 1.0  
**Status:** Pronto para Execução
