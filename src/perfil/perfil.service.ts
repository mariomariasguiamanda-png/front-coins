import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Injectable()
export class PerfilService {
  constructor(private db: DatabaseService) {}

  async getPerfil(id_usuario: number) {
    const usuario = await this.db.usuarios.findUnique({
      where: { id_usuario },
      include: { alunos: { include: { turmas: { select: { id_turma: true, nome: true } } } } },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    return {
      id_usuario: Number(usuario.id_usuario),
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      matricula: usuario.alunos?.matricula ?? null,
      data_nascimento: usuario.alunos?.data_nascimento ?? null,
      endereco: usuario.alunos?.endereco ?? null,
      foto_url: usuario.alunos?.foto_url ?? null,
      turma: usuario.alunos?.turmas ?? null,
    };
  }

  async getPerfilProfessor(id_usuario: number) {
    const usuario = await this.db.usuarios.findUnique({
      where: { id_usuario },
      include: { professores: true },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    return {
      id_usuario: Number(usuario.id_usuario),
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      especialidade: usuario.professores?.especialidade ?? null,
      foto_url: usuario.professores?.foto_url ?? null,
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
