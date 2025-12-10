# 🎯 QUICK REFERENCE CARD: Remover 74+ Mocks

**Imprima isto e coloque na parede** 📌

---

## ⚡ Em 60 Segundos

```
PROBLEMA: 74+ mocks espalhados em 4 arquivos + 58 componentes
SOLUÇÃO: 8 fases sequenciais para remover com segurança
TEMPO: 4-5 semanas com equipe
RISCO: Médio-Alto (com plano de mitigação)
STATUS: Pronto para executar hoje
```

---

## 📍 Onde Estão os Mocks?

| Localização                  | Quantidade | Remove Como             |
| ---------------------------- | ---------- | ----------------------- |
| `/src/lib/mock/aluno.ts`     | 11 exports | Refatorar 8 fases       |
| `/src/lib/mock/professor.ts` | 2 exports  | Refatorar Fase 2 + 6    |
| `/src/lib/mock/admin.ts`     | 2 exports  | Refatorar Fase 2 + 6    |
| `/src/lib/mock/compras.ts`   | 1 export   | Refatorar Fase 7        |
| Inline em 58+ componentes    | 58 mocks   | Refatorar em suas fases |
| **TOTAL**                    | **74+**    | **8 Fases**             |

---

## 🛠️ Os 7 Serviços

```typescript
1. notificacaoService.ts    ← Fase 2 (16 mocks)
2. atividadeService.ts      ← Fase 4 (12 mocks) [ESTENDER]
3. graficoService.ts        ← Fase 3 (3 mocks)
4. usuarioService.ts        ← Fase 6 (25+ mocks)
5. compraService.ts         ← Fase 7 (3 mocks)
6. conteudoService.ts       ← Fase 5 (15+ mocks)
7. professorConfigService.ts ← Fase 8 (8+ mocks)

+ 5 Hooks Custom (useNotificacoes, useAtividades, etc)
+ 3 UI Components (ErrorBoundary, LoadingState, EmptyState)
```

---

## 📋 As 8 Fases

| Semana | Fase              | O Quê                   | Arquivo Principal         | Status |
| ------ | ----------------- | ----------------------- | ------------------------- | ------ |
| 1      | Preparação        | Validar BD, criar tipos | supabaseSchema.ts         | ⏳     |
| 1-2    | 2️⃣ Notificações   | 16 mocks                | notificacaoService.ts     | ⏳     |
| 2      | 3️⃣ Ranking        | 3 mocks                 | graficoService.ts         | ⏳     |
| 2-3    | 4️⃣ Atividades     | 12 mocks                | atividadeService.ts       | ⏳     |
| 3      | 5️⃣ Resumos/Videos | 15+ mocks               | conteudoService.ts        | ⏳     |
| 3-4    | 6️⃣ Usuários       | 25+ mocks               | usuarioService.ts         | ⏳     |
| 4      | 7️⃣ Transações     | 3 mocks                 | compraService.ts          | ⏳     |
| 4-5    | 8️⃣ Configs        | 8+ mocks                | professorConfigService.ts | ⏳     |

---

## 🎯 Cronograma Visual

```
Semana 1:    [PREP] [NOTIF___]
Semana 2:    [NOTIF__] [RANK] [ATIVID_]
Semana 3:    [ATIVID__] [RESUM/VID] [USUÁRIO_]
Semana 4:    [USUÁRIO___] [TRANS] [CONFIG_]
Semana 5:    [CONFIG__] [TESTES] [DEPLOY]
```

---

## ✔️ 3 Documentos Criados

| Documento                | Páginas | Tempo  | Melhor Para |
| ------------------------ | ------- | ------ | ----------- |
| **RESUMO-EXECUTIVO**     | 10      | 15 min | Visão geral |
| **RELATORIO-COMPLETO**   | 35      | 45 min | Detalhes    |
| **IMPLEMENTACAO-PRONTO** | 30      | 30 min | Código      |

**COMECE AQUI:** RESUMO-EXECUTIVO-MOCKS.md

---

## 🚨 Top 5 Riscos

1. **Dados Vazios** → Implementar EmptyState ✅
2. **Erros Conexão** → ErrorBoundary + retry ✅
3. **Performance** → Paginação + limit/offset ✅
4. **Desincronização** → React Query (recomendado) ⏳
5. **Quebra Componentes** → Fases sequenciais ✅

**Todos com mitigação planejada** ✅

---

## 📱 Por Componente Crítico

```
GraficoMoedas.tsx    → Fase 3 (Ranking + Moedas)
Notificacoes.tsx     → Fase 2 (16 mocks notif)
Usuarios.tsx (adm)   → Fase 6 (25+ mocks)
Atividades.tsx       → Fase 4 (12 mocks)
Resumos.tsx          → Fase 5 (resumos)
Videoaulas.tsx       → Fase 5 (videoaulas)
PontosPrecos.tsx     → Fase 8 (configs prof)
```

---

## 💡 Padrão para Cada Fase

```typescript
1. Criar Service
   └─ getX(params)
   └─ updateX(id, data)
   └─ deleteX(id)

2. Criar Hook (opcional)
   └─ useX()
   └─ Auto-loading, erro, etc

3. Refatorar Componente
   ├─ Import service/hook
   ├─ useEffect carrega dados
   ├─ useState armazena
   └─ Render com spinners/empty

4. Remover Mock
   └─ git rm ou comentar

5. Deploy
   └─ Test em staging
   └─ Merge para main
```

---

## ✅ Definição de PRONTO

Uma fase está pronta quando:

```
✓ Serviço criado + tipado
✓ Componentes refatorados
✓ Mocks removidos
✓ Spinners/EmptyStates ok
✓ Erro handling robusto
✓ Code review aprovado
✓ Testes passando
✓ Deploy sem erros
✓ Monitoramento ok
```

---

## 🔍 Onde Encontrar Tudo

```
RESUMO EXECUTIVO → RESUMO-EXECUTIVO-MOCKS.md
DETALHES COMPLETO → RELATORIO-MOCKS-REMOCAO.md
CÓDIGO PRONTO → IMPLEMENTACAO-CODIGO-PRONTO.md
ÍNDICE NAVEGAÇÃO → INDICE-DOCUMENTACAO.md
ESTE CARD → QUICK-REFERENCE-CARD.md
```

---

## 🚀 Comece HOJE

### Se você tem 5 minutos:

Leia: "O PROBLEMA" no RESUMO

### Se você tem 15 minutos:

Leia: RESUMO completo

### Se você tem 30 minutos:

Leia: RESUMO + Primeira Fase do RELATORIO

### Se você vai implementar:

Abra: IMPLEMENTACAO-CODIGO-PRONTO.md
Procure: Seu serviço
Copie: Código
Adapte: Para seu contexto
Teste: No staging

---

## 📞 Perguntas Rápidas

```
P: Por onde começo?
R: RESUMO-EXECUTIVO-MOCKS.md

P: Onde está o código?
R: IMPLEMENTACAO-CODIGO-PRONTO.md

P: Qual é a minha fase?
R: Procure em RELATORIO seção "FASE X"

P: Quanto tempo?
R: 4-5 semanas (cronograma no RESUMO)

P: Qual é o risco?
R: Médio-Alto, mas mitigado (ver RESUMO)

P: E agora?
R: Abra RESUMO e comece Fase 1 (hoje)
```

---

## 🎓 Números Importantes

```
74+    Mocks encontrados
7      Serviços a criar
8      Fases de migração
5      Riscos identificados (todos mitigados)
4-5    Semanas de trabalho
75     Páginas de documentação
Code   Pronto para copiar (sim!)
```

---

## 🏆 No Final

Você terá:

✅ **Zero mocks** no código  
✅ **100% dados reais** do Supabase  
✅ **Arquitetura clara** e manutenível  
✅ **Componentes reutilizáveis**  
✅ **Documentação** de padrões  
✅ **Confiança** em deploy

---

## 📌 Cole na Parede do Time

```
╔═══════════════════════════════════════════╗
║      REMOVER 74+ MOCKS - 4-5 SEMANAS      ║
╠═══════════════════════════════════════════╣
║ Fase 1 (Prep) │ Fase 2-3 (Core)          ║
║ Fase 4-5 (User) │ Fase 6-8 (Admin)       ║
╠═══════════════════════════════════════════╣
║ Status: PRONTO PARA COMEÇAR ✅            ║
║ Docs: 4 arquivos, 75 páginas             ║
║ Código: Pronto para copiar               ║
╚═══════════════════════════════════════════╝
```

---

## 🎬 Próximo Passo

```
1. Abra: RESUMO-EXECUTIVO-MOCKS.md
2. Leia: Primeiras 3 seções (5 min)
3. Decida: Começamos quando?
4. Atribua: Quem faz cada fase?
5. Execute: Comece Fase 1 hoje!
```

---

**Versão:** 1.0  
**Data:** 9 de Dezembro de 2025  
**Status:** ✅ PRONTO PARA EXECUTAR

**Tempo para ler isto:** 3 minutos  
**Tempo para comec ar:** AGORA ✅
