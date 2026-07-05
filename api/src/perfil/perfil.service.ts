import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { UpdatePerfilProfessorDto } from './dto/update-perfil-professor.dto';
import { AlterarSenhaDto } from './dto/alterar-senha.dto';

@Injectable()
export class PerfilService {
  constructor(private db: DatabaseService) {}

  async getPerfil(id_usuario: number) {
    const usuario = await this.db.usuarios.findUnique({
      where: { id_usuario },
      include: { alunos: { include: { turmas: { select: { id_turma: true, nome: true } } } } },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    // Mesmo cálculo usado no ranking e em /aluno/moedas/total-ganho, para que
    // o total exibido no perfil bata com o do ranking e o da dashboard.
    const totalGanho = usuario.alunos
      ? await this.db.transacoes_moedas.aggregate({
          where: { id_aluno: usuario.alunos.id_aluno, quantidade: { gt: 0 } },
          _sum: { quantidade: true },
        })
      : null;

    return {
      id_usuario: Number(usuario.id_usuario),
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      instituicao: usuario.instituicao,
      matricula: usuario.alunos?.matricula ?? null,
      cpf: usuario.alunos?.cpf ?? null,
      data_nascimento: usuario.alunos?.data_nascimento ?? null,
      endereco: usuario.alunos?.endereco ?? null,
      foto_url: usuario.alunos?.foto_url ?? null,
      turma: usuario.alunos?.turmas ?? null,
      total_moedas_historico: totalGanho?._sum.quantidade ?? 0,
    };
  }

  async getPerfilAdmin(id_usuario: number) {
    const usuario = await this.db.usuarios.findUnique({ where: { id_usuario } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const [totalAlunos, totalProfessores, totalTurmas] = await Promise.all([
      this.db.alunos.count(),
      this.db.professores.count(),
      this.db.turmas.count(),
    ]);

    return {
      id_usuario: Number(usuario.id_usuario),
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      foto_url: usuario.foto_url,
      criado_em: usuario.criado_em,
      total_alunos: totalAlunos,
      total_professores: totalProfessores,
      total_turmas: totalTurmas,
    };
  }

  async updatePerfilAdmin(id_usuario: number, dto: UpdatePerfilDto) {
    const usuario = await this.db.usuarios.update({
      where: { id_usuario },
      data: { nome: dto.nome, telefone: dto.telefone },
    });

    return {
      id_usuario: Number(usuario.id_usuario),
      nome: usuario.nome,
      telefone: usuario.telefone,
    };
  }

  async updateFotoAdmin(id_usuario: number, fotoUrl: string) {
    const usuario = await this.db.usuarios.update({
      where: { id_usuario },
      data: { foto_url: fotoUrl },
    });
    return { foto_url: usuario.foto_url };
  }

  async getPerfilProfessor(id_usuario: number) {
    const usuario = await this.db.usuarios.findUnique({
      where: { id_usuario },
      include: { professores: true },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    if (!usuario.professores) throw new NotFoundException('Professor não encontrado');

    const id_professor = usuario.professores.id_professor;

    const vinculos = await this.db.professor_disciplina.findMany({
      where: { id_professor },
      include: { disciplinas: { select: { id_disciplina: true, nome: true } } },
    });
    const idsDisciplinas = vinculos.map((v) => v.disciplinas.id_disciplina);

    const matriculas = await this.db.matriculas_aluno_disciplina.findMany({
      where: { id_disciplina: { in: idsDisciplinas } },
      include: { alunos: { include: { turmas: { select: { nome: true } } } } },
    });

    const disciplinas = Array.from(new Set(vinculos.map((v) => v.disciplinas.nome)));
    const turmas = Array.from(
      new Set(
        matriculas.map((m) => m.alunos.turmas?.nome).filter((nome): nome is string => !!nome),
      ),
    );
    const totalAlunos = new Set(matriculas.map((m) => Number(m.alunos.id_aluno))).size;

    return {
      id_usuario: Number(usuario.id_usuario),
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      especialidade: usuario.professores.especialidade,
      foto_url: usuario.professores.foto_url,
      criado_em: usuario.professores.criado_em,
      disciplinas,
      turmas,
      total_alunos: totalAlunos,
    };
  }

  async updatePerfil(id_usuario: number, dto: UpdatePerfilDto) {
    const usuario = await this.db.usuarios.update({
      where: { id_usuario },
      data: { nome: dto.nome, telefone: dto.telefone },
    });

    return {
      id_usuario: Number(usuario.id_usuario),
      nome: usuario.nome,
      telefone: usuario.telefone,
    };
  }

  async updatePerfilProfessor(id_usuario: number, dto: UpdatePerfilProfessorDto) {
    return this.db.$transaction(async (tx) => {
      const usuario = await tx.usuarios.update({
        where: { id_usuario },
        data: { nome: dto.nome, telefone: dto.telefone },
      });

      if (dto.especialidade !== undefined) {
        await tx.professores.update({
          where: { id_usuario },
          data: { especialidade: dto.especialidade },
        });
      }

      return {
        id_usuario: Number(usuario.id_usuario),
        nome: usuario.nome,
        telefone: usuario.telefone,
      };
    });
  }

  async alterarSenha(id_usuario: number, dto: AlterarSenhaDto) {
    const usuario = await this.db.usuarios.findUnique({ where: { id_usuario } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const senhaConfere = await bcrypt.compare(dto.senha_atual, usuario.senha_hash);
    if (!senhaConfere) throw new UnauthorizedException('Senha atual incorreta');

    const senha_hash = await bcrypt.hash(dto.senha_nova, 10);
    await this.db.usuarios.update({ where: { id_usuario }, data: { senha_hash } });

    return { sucesso: true };
  }

  async updateFoto(id_aluno: number, fotoUrl: string) {
    const aluno = await this.db.alunos.update({
      where: { id_aluno },
      data: { foto_url: fotoUrl },
    });
    return { foto_url: aluno.foto_url };
  }

  async updateFotoProfessor(id_professor: number, fotoUrl: string) {
    const professor = await this.db.professores.update({
      where: { id_professor },
      data: { foto_url: fotoUrl },
    });
    return { foto_url: professor.foto_url };
  }
}
