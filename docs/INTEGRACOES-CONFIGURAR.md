# Configurações de Integrações — Como testar e próximos passos

Este documento explica como validar a tela de Integrações e lista melhorias recomendadas.

## Onde fica
- Página: `src/pages/adm/configuracoes-integracoes.tsx`
- Rota: `/adm/configuracoes-integracoes`

## Como usar o botão "Configurar"
- O botão abre um modal com os campos da integração selecionada (Google Classroom, Moodle, API).
- As edições são feitas exclusivamente no modal e atualizam o rascunho da página.
- Para persistir no backend in-memory, clique em "Salvar alterações" no topo da página.

## Fluxo de salvar
1. Edite os campos no modal “Configurar”.
2. Feche o modal (opcional).
3. Clique em "Salvar alterações" no topo para persistir.
4. Um toast confirma o salvamento.

## Testes manuais — checklist
- [ ] Abrir a rota `/adm/configuracoes-integracoes`.
- [ ] Para cada integração, clicar em "Configurar" e verificar se o modal abre com os campos esperados.
- [ ] Editar um campo no modal e fechar com "Fechar"; verificar toast de rascunho atualizado.
- [ ] Clicar em "Salvar alterações"; verificar toast de sucesso.
- [ ] Recarregar a página e conferir se os valores permanecem (persistência em memória do processo dev).
- [ ] Ativar/Desativar uma integração; verificar o toast e se a data de última sincronização é atualizada quando ativada.
- [ ] Validar que o botão "Salvar alterações" fica desabilitado quando não há mudanças.

## Próximos passos recomendados
1. UX/Consistência
   - Padronizado para edição apenas via modal “Configurar” (sem edição inline) para evitar duplicação e reduzir risco de erro.
2. Validações por integração
   - Google Classroom: exigir `clientId` e `clientSecret` antes de permitir ativar.
   - Moodle: validar URL e exigir `token`.
   - API: validar URL e chave (`apiKey`).
   - Exibir mensagens de erro nos inputs e bloquear ativação se inválido.
3. Testar conexão
   - Adicionar botão "Testar conexão" no modal.
   - Simular chamada na camada `services/api` com sucesso/erro para feedback instantâneo.
4. Segurança/UX de credenciais
   - Inputs do tipo password com alternar visibilidade.
   - Exibir apenas os últimos 4 caracteres quando houver valor salvo.
5. Sinalização de estado
   - Mostrar indicador de "alterações não salvas" por integração.
   - Tooltip no botão global desabilitado explicando o motivo.
6. Permissões e rota
   - Garantir proteção da rota somente para Administrador (ex.: HOC `withAuth`).
7. Observabilidade
   - Registrar no sistema de notificações/logs as mudanças relevantes (ativação, troca de URL, etc.), possivelmente usando `diffSystemSettings` para descrever alterações.
8. Tratamento de erros
   - Exibir toasts de erro quando `updateSystemSettings` falhar.

## Troubleshooting rápido
- Nada acontece ao salvar: verifique se há mudanças pendentes; o botão fica desabilitado sem diffs.
- Dados não persistem após reiniciar o dev server: o backend é in-memory, reinícios resetam o estado.
