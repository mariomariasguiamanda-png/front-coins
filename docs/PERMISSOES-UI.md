# Permissões — Nova UI

Esta página documenta o novo layout da tela de Permissões.

## Onde fica
- Página: `src/pages/adm/configuracoes-permissoes.tsx`
- Rota: `/adm/configuracoes-permissoes`

## O que mudou
- Layout em abas por perfil (Administrador, Professor, Aluno, etc.).
- Matriz de permissões: linhas = recursos, colunas = ações (visualizar, criar, editar, excluir).
- Filtro de busca por nome do recurso.
- Regras de dependência: "Visualizar" é pré-requisito para Criar/Editar/Excluir. Ao desligar "Visualizar", as demais ações são desativadas automaticamente. Os controles de Criar/Editar/Excluir ficam desabilitados quando "Visualizar" está desligado.

## Como usar
1. Selecione o perfil na aba.
2. Opcional: filtre recursos pelo campo de busca.
3. Ajuste permissões por recurso usando os switches. Ao desligar "Visualizar", as demais ações do recurso serão desligadas.
4. Clique em "Salvar alterações" no topo para persistir.

## Notas
- O botão de salvar fica desabilitado se não houver alterações.
- O filtro influencia o toggle em massa (afeta somente o conjunto exibido).

## Próximas melhorias (opcional)
- Botões "Marcar tudo/Desmarcar tudo" por perfil.
- Presets de permissões por perfil (ex.: padrão de Professor).
- Indicação visual de diferenças em relação ao default do sistema.
- Coluna "herdado" caso haja hierarquia de papéis no futuro.
