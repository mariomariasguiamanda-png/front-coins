# Configuração para WSL

## 📁 Estrutura de Arquivos Esclarecida

**O Next.js está usando a estrutura da RAIZ:**

- ✅ `/app/*` - Páginas ativas (login, homepage, etc.)
- ✅ `/src/components/*` - Componentes reutilizáveis
- ✅ `/src/services/*` - Serviços e APIs
- ✅ `/src/utils/*` - Utilitários

**Removida a estrutura duplicada `/src/app/` para evitar confusão.**

## Problema de Permissão Resolvido ✅

Modifiquei o `package.json` para usar `node` diretamente nos scripts, evitando problemas de permissão no WSL.

### Scripts Atualizados:

```json
{
  "scripts": {
    "dev": "node node_modules/next/dist/bin/next dev",
    "build": "node node_modules/next/dist/bin/next build",
    "start": "node node_modules/next/dist/bin/next start",
    "lint": "node node_modules/next/dist/bin/next lint",
    "dev:original": "next dev"
  }
}
```

## Como usar agora:

### Opção 1: npm run dev (recomendado)

```bash
npm run dev
```

### Opção 2: Script bash

```bash
# No WSL bash
./start-dev.sh
```

### Opção 3: Se ainda tiver problemas no WSL

```bash
# No terminal WSL (bash)
wsl
cd ~/coins
chmod +x node_modules/.bin/next
npm run dev:original
```

## Vantagens da solução:

✅ **Funciona no PowerShell e WSL**
✅ **Evita problemas de permissão**
✅ **Mantém compatibilidade**
✅ **Script de fallback disponível**

## Se precisar reinstalar (WSL):

```bash
# No WSL bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

O projeto agora deve funcionar perfeitamente com `npm run dev` tanto no PowerShell quanto no WSL!
