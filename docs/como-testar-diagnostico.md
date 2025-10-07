# 🧪 Como Testar o Diagnóstico de Loop em Videoaulas

## 📋 Reprodução do Problema

### **1. Ambiente Necessário**

```bash
cd front-coins
npm run dev  # ou npx next dev
```

### **2. Passos para Reproduzir**

1. **Navegar para videoaulas:**

   ```
   http://localhost:3000/disciplinas/hist/videoaulas
   ```

2. **Abrir DevTools:**

   - Chrome: F12 → Console
   - Monitorar logs em tempo real

3. **Aguardar carregamento:**

   - Logs devem aparecer imediatamente:

   ```
   [VideoProgress] Hook module loaded
   [Videoaulas] Component module loaded
   [VideoProgress] Hook called with: {disciplinaId: "hist", videoIds: 2}
   [VideoProgress] useEffect triggered - videoIds changed: ["3", "4"]
   ```

4. **Observar o loop:**

   - Em ~1-2 segundos, deve aparecer:

   ```
   [VideoProgress] useEffect triggered - videoIds changed: ["3", "4"]
   [VideoProgress] setProgress called with: {3: 0, 4: 0}
   [VideoProgress] setLiveProgress called with: {3: 0, 4: 0}
   [Videoaulas] Setting up YouTube event listener
   [VideoProgress] useEffect triggered - videoIds changed: ["3", "4"]
   [VideoProgress] setProgress called with: {3: 0, 4: 0}
   ... (repetindo infinitamente)
   ```

5. **Reproduzir navegação lenta:**
   - Clicar no botão "Voltar"
   - Observar logs:
   ```
   [Videoaulas] handleBack called - starting exit animation
   [Router] routeChangeStart: /disciplinas/hist?tema=historia
   ... (logs continuam mesmo após mudança de URL)
   [Router] routeChangeComplete: /disciplinas/hist?tema=historia
   videoaulas-navigation: 2847.23ms  // ⚠️ Tempo alto!
   ```

---

## 🔍 Sinais de Confirmação

### **Console Logs Esperados**

```bash
# ✅ Loop detectado
Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.

# ✅ useEffect executando continuamente
[VideoProgress] useEffect triggered - videoIds changed: (2) ["3", "4"]
[VideoProgress] setProgress called with: {3: 0, 4: 0}
[VideoProgress] setLiveProgress called with: {3: 0, 4: 0}

# ✅ Event listener sendo recriado
[Videoaulas] Setting up YouTube event listener
[Videoaulas] Dependencies changed: {videoaulasLength: 2, updateLiveProgressRef: true, saveProgressRef: true}
[Videoaulas] Cleaning up YouTube event listener
[Videoaulas] Setting up YouTube event listener

# ✅ Navegação lenta
[Videoaulas] handleBack called - starting exit animation
videoaulas-navigation: 2000ms+  // Deve ser > 2000ms
```

### **Performance Tab (Chrome DevTools)**

1. **Abrir Performance tab**
2. **Iniciar gravação**
3. **Navegar para videoaulas e voltar**
4. **Parar gravação**

**Evidências esperadas:**

- 🔴 **High CPU usage** durante 2-3 segundos
- 🔴 **Muitas funções `useEffect`** no profiler
- 🔴 **Event listener add/remove** repetitivo
- 🔴 **setState calls** em alta frequência

---

## 🧰 Ferramentas de Validação

### **React DevTools Profiler**

1. **Instalar extensão React DevTools**
2. **Aba Profiler → Start profiling**
3. **Reproduzir problema**
4. **Stop profiling**

**Métricas esperadas:**

- **Commits:** 100+ em poucos segundos
- **Render duration:** > 16ms (acima de 60fps)
- **Components re-rendering:** `Videoaulas` + `useVideoProgress`

### **Network Tab**

Verificar se há requests desnecessários:

```bash
# ❌ NÃO deveria aparecer durante o loop
GET /api/videoProgress/...
POST /api/saveProgress/...
```

### **Memory Tab**

Monitorar vazamentos:

1. **Take heap snapshot** antes
2. **Reproduzir problema**
3. **Take heap snapshot** depois
4. **Compare** - deve mostrar aumento de event listeners

---

## 📊 Métricas de Baseline

### **Comportamento Normal (Sem Bug)**

```bash
Navegação videoaulas → disciplina:
├── handleBack: ~300ms (animação CSS)
├── routeChangeStart → routeChangeComplete: ~200ms
└── Total: ~500ms ✅

Re-renders durante navegação: 2-3 ✅
Event listeners ativos: 1 ✅
CPU usage: < 30% ✅
```

### **Comportamento com Bug (Atual)**

```bash
Navegação videoaulas → disciplina:
├── handleBack: ~300ms (animação CSS)
├── Loop de renderização: ~2000-3000ms ❌
├── routeChangeStart → routeChangeComplete: ~200ms
└── Total: ~2500-3500ms ❌

Re-renders durante navegação: 100+ ❌
Event listeners ativos: 15-20 ❌
CPU usage: 85-100% ❌
```

---

## 🎯 Critério de Sucesso

**✅ O diagnóstico está CORRETO se:**

1. **Console mostra loop infinito** com logs repetitivos
2. **Performance tab mostra CPU alto** durante 2+ segundos
3. **Navegação demora 2500ms+** (medido via console.time)
4. **React DevTools mostra 100+ renders** em poucos segundos
5. **Warning "Maximum update depth"** aparece no console

**❌ O diagnóstico precisa revisão se:**

1. Navegação é rápida (< 1000ms)
2. Console não mostra loops repetitivos
3. CPU permanece baixo
4. Nenhum warning aparece
5. Event listeners são limpos corretamente

---

## 🔧 Remoção da Instrumentação

**Após validar o diagnóstico, remover logs:**

```bash
# Buscar e remover todas as linhas com:
// 🔧 DEV:
if (process.env.NODE_ENV !== 'production') {
  console.log(...)
}
```

**Arquivos a limpar:**

- `src/hooks/useVideoProgress.ts`
- `src/pages/disciplinas/[id]/videoaulas.tsx`
- `src/pages/_app.tsx`
