const fs = require('fs');
const path = require('path');

// Caminho das pastas duplicadas
const pastaDisciplina = path.join(__dirname, 'pages/disciplinas');
const pastaAluno = path.join(__dirname, 'pages/homepage-aluno/disciplinas');

// Arquivos duplicados a serem removidos
const arquivosDuplicados = [
  'index.tsx',
  '[id]/index.tsx',
  '[id]/atividades.tsx',
  '[id]/videoaulas.tsx',
  '[id]/resumos.tsx',
];

const removerArquivosDuplicados = (pasta) => {
  arquivosDuplicados.forEach((arquivo) => {
    const caminhoArquivo = path.join(pasta, arquivo);
    if (fs.existsSync(caminhoArquivo)) {
      console.log(`Removendo o arquivo duplicado: ${caminhoArquivo}`);
      fs.unlinkSync(caminhoArquivo);
    } else {
      console.log(`Arquivo não encontrado: ${caminhoArquivo}`);
    }
  });
};

// Remover arquivos duplicados
removerArquivosDuplicados(pastaDisciplina);
removerArquivosDuplicados(pastaAluno);

console.log('Consolidação de disciplinas concluída!');
