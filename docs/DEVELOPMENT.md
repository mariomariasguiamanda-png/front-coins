# Scripts de Desenvolvimento

## Comandos Úteis

### Executar o projeto

```bash
npm run dev  # Agora funciona no WSL!
```

### Scripts alternativos:

```bash
./start-dev.sh  # Script bash com fallback
npm run dev:original  # Script original do Next.js
```

### Build de produção

```bash
npm run build
npm run start
```

### Estrutura de navegação disponível:

- http://localhost:3000 - Página inicial
- http://localhost:3000/login - Login (Nova interface com fundo e design moderno) ✨
- http://localhost:3000/cadastro - Cadastro
- http://localhost:3000/homepage - Homepage
- http://localhost:3000/dashboard - Dashboard (requer login)
- http://localhost:3000/perfil - Perfil (requer login)
- http://localhost:3000/ajuda - Central de ajuda
- http://localhost:3000/esqueci-senha - Recuperação de senha

### Credenciais de teste:

- Admin: admin@test.com / 123456
- Usuário: user@test.com / 123456

## Funcionalidades Implementadas

✅ Sistema de autenticação completo
✅ Validação de formulários com Yup e React Hook Form
✅ Componentes UI reutilizáveis
✅ Layout responsivo com Tailwind CSS
✅ Navegação entre páginas
✅ Context API para gerenciamento de estado
✅ Estrutura de API preparada para backend
✅ Páginas funcionais: Login, Cadastro, Homepage, Dashboard, Perfil, Ajuda, Esqueci-senha
✅ Nova página de login com design moderno e imagem de fundo
✅ Pasta public criada para imagens
✅ Documentação completa

## 🖼️ Imagens Necessárias

Para que a nova página de login funcione completamente, adicione as seguintes imagens na pasta `/public`:

1. **`imagem_coins.png`** - Imagem de fundo da página de login

   - Tamanho recomendado: 1920x1080px ou superior
   - Formato: PNG ou JPG
   - Descrição: Imagem de fundo que aparece em tela cheia

2. **`logo-coins.png`** - Logo do sistema
   - Tamanho recomendado: 200x200px ou superior (quadrada)
   - Formato: PNG com transparência
   - Descrição: Logo que aparece no card de login

## Próximos passos para desenvolvimento:

1. **Adicionar as imagens reais** na pasta `/public`
2. Integrar com backend real (API)
3. Implementar autenticação JWT
4. Adicionar mais funcionalidades específicas do domínio
5. Implementar testes unitários
6. Adicionar PWA capabilities
7. Implementar dark mode
8. Adicionar internacionalização (i18n)
