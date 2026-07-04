import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const SENHA_PADRAO = 'senha123';

async function upsertUsuario(
  email: string,
  nome: string,
  tipo_usuario: 'aluno' | 'professor' | 'admin',
  telefone?: string,
) {
  const senha_hash = await bcrypt.hash(SENHA_PADRAO, 10);
  return db.usuarios.upsert({
    where: { email },
    update: {},
    create: { email, nome, tipo_usuario, telefone, senha_hash },
  });
}

async function main() {
  console.log('Seed: criando dados de teste...');

  // --- Usuários base ---
  const admin = await upsertUsuario('admin@coins.com', 'Admin Geral', 'admin');

  const usuarioProfessor = await upsertUsuario(
    'professor@coins.com',
    'Prof. Carla Souza',
    'professor',
  );
  const professor = await db.professores.upsert({
    where: { id_usuario: usuarioProfessor.id_usuario },
    update: {},
    create: { id_usuario: usuarioProfessor.id_usuario, especialidade: 'Matemática e Física' },
  });

  const turma = await db.turmas.upsert({
    where: { id_turma: 1n },
    update: {},
    create: { nome: 'Turma 101', ano_letivo: 2026, semestre: 1 },
  });

  const disciplinaMat = await db.disciplinas.upsert({
    where: { codigo: 'MAT' },
    update: {},
    create: { nome: 'Matemática', codigo: 'MAT', carga_horaria: 80 },
  });
  const disciplinaPort = await db.disciplinas.upsert({
    where: { codigo: 'PORT' },
    update: {},
    create: { nome: 'Português', codigo: 'PORT', carga_horaria: 60 },
  });

  await db.professor_disciplina.upsert({
    where: {
      id_professor_id_disciplina: {
        id_professor: professor.id_professor,
        id_disciplina: disciplinaMat.id_disciplina,
      },
    },
    update: {},
    create: {
      id_professor: professor.id_professor,
      id_disciplina: disciplinaMat.id_disciplina,
      semestre: 1,
    },
  });

  await db.config_compra_pontos.upsert({
    where: { id_disciplina: disciplinaMat.id_disciplina },
    update: {},
    create: {
      id_disciplina: disciplinaMat.id_disciplina,
      pontos_por_compra_max: 10,
      preco_moedas_por_ponto: 10,
    },
  });

  // --- Alunos ---
  const alunosInfo = [
    { email: 'joao@coins.com', nome: 'João Pereira', matricula: '2026001' },
    { email: 'maria@coins.com', nome: 'Maria Lima', matricula: '2026002' },
  ];

  for (const info of alunosInfo) {
    const usuarioAluno = await upsertUsuario(info.email, info.nome, 'aluno');
    const aluno = await db.alunos.upsert({
      where: { id_usuario: usuarioAluno.id_usuario },
      update: {},
      create: {
        id_usuario: usuarioAluno.id_usuario,
        id_turma: turma.id_turma,
        matricula: info.matricula,
      },
    });

    for (const disciplina of [disciplinaMat, disciplinaPort]) {
      await db.matriculas_aluno_disciplina.upsert({
        where: {
          id_aluno_id_disciplina: {
            id_aluno: aluno.id_aluno,
            id_disciplina: disciplina.id_disciplina,
          },
        },
        update: {},
        create: { id_aluno: aluno.id_aluno, id_disciplina: disciplina.id_disciplina },
      });
    }
  }

  // --- Atividade com questões (Matemática) ---
  const atividade = await db.atividades.create({
    data: {
      id_disciplina: disciplinaMat.id_disciplina,
      id_professor: professor.id_professor,
      titulo: 'Prova de Frações',
      descricao: 'Avaliação sobre operações com frações',
      recompensa_moedas: 50,
      tipo: 'prova',
      data_vencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  await db.questoes_atividade.createMany({
    data: [
      {
        id_atividade: atividade.id_atividade,
        tipo: 'vf',
        enunciado: '1/2 + 1/2 = 1',
        correta: true,
        ordem: 1,
      },
      {
        id_atividade: atividade.id_atividade,
        tipo: 'multipla',
        enunciado: 'Quanto é 1/4 + 1/4?',
        alternativa_a: '1/8',
        alternativa_b: '1/2',
        alternativa_c: '2/4',
        alternativa_d: '1',
        letra_correta: 'B',
        ordem: 2,
      },
    ],
  });

  // --- Resumo e videoaula (Matemática) ---
  await db.resumos.create({
    data: {
      id_disciplina: disciplinaMat.id_disciplina,
      id_professor: professor.id_professor,
      titulo: 'Resumo: Operações com frações',
      conteudo: 'Para somar frações com mesmo denominador, basta somar os numeradores...',
    },
  });

  await db.videoaulas.create({
    data: {
      id_disciplina: disciplinaMat.id_disciplina,
      id_professor: professor.id_professor,
      titulo: 'Aula: Introdução a frações',
      url_video: 'https://www.youtube.com/watch?v=exemplo',
      duracao_segundos: 600,
    },
  });

  console.log('Seed concluído.');
  console.log(`Login de teste (senha para todos: "${SENHA_PADRAO}"):`);
  console.log(`  admin:     ${admin.email}`);
  console.log(`  professor: ${usuarioProfessor.email}`);
  alunosInfo.forEach((a) => console.log(`  aluno:     ${a.email}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
