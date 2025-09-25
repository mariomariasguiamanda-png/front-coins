#!/bin/bash

# Script para executar o Next.js no WSL
# Tenta diferentes métodos para executar o Next.js

echo "🚀 Iniciando Next.js..."

# Método 1: Tentar npm run dev
if npm run dev; then
    echo "✅ Next.js iniciado com npm run dev"
else
    echo "⚠️  npm run dev falhou, tentando método alternativo..."
    
    # Método 2: Usar node diretamente
    if node node_modules/next/dist/bin/next dev; then
        echo "✅ Next.js iniciado com node direto"
    else
        echo "❌ Falha ao iniciar Next.js"
        echo "💡 Tente reinstalar as dependências:"
        echo "   rm -rf node_modules package-lock.json"
        echo "   npm install"
        exit 1
    fi
fi