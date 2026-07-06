import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UpdateStatusUsuarioDto } from './dto/update-status-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private db: DatabaseService) {}

  async findAll(tipo_usuario?: string, status?: string) {
    const usuarios = await this.db.usuarios.findMany({
      where: {
        tipo_usuario,
        status,
      },
      select: {
        id_usuario: true,
        nome: true,
        email: true,
        telefone: true,
        tipo_usuario: true,
        status: true,
        criado_em: true,
        foto_url: true, // usuarios.foto_url só é preenchido pra admin
        alunos: { select: { foto_url: true } },
        professores: { select: { foto_url: true } },
      },
      orderBy: { criado_em: 'desc' },
    });

    // Cada papel guarda a foto num lugar diferente (aluno/professor têm
    // tabela própria; admin não tem tabela própria, usa usuarios.foto_url).
    return usuarios.map(({ alunos, professores, foto_url, ...resto }) => ({
      ...resto,
      foto_url: alunos?.foto_url ?? professores?.foto_url ?? foto_url ?? null,
    }));
  }

  async findOne(id_usuario: bigint) {
    const usuario = await this.db.usuarios.findUnique({
      where: { id_usuario },
      include: {
        alunos: { include: { turmas: { select: { nome: true } } } },
        professores: true,
      },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const { senha_hash, reset_token_hash, reset_token_expira_em, ...resto } = usuario;
    return resto;
  }

  async create(dto: CreateUsuarioDto) {
    const existing = await this.db.usuarios.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email já em uso');

    const senha_hash = await bcrypt.hash(dto.senha, 10);

    return this.db.$transaction(async (tx) => {
      const usuario = await tx.usuarios.create({
        data: {
          email: dto.email,
          senha_hash,
          nome: dto.nome,
          telefone: dto.telefone,
          tipo_usuario: dto.tipo_usuario,
        },
      });

      if (dto.tipo_usuario === 'aluno') {
        await tx.alunos.create({
          data: { id_usuario: usuario.id_usuario, matricula: dto.matricula as string },
        });
      } else if (dto.tipo_usuario === 'professor') {
        await tx.professores.create({
          data: { id_usuario: usuario.id_usuario, especialidade: dto.especialidade },
        });
      }

      return { id_usuario: Number(usuario.id_usuario), email: usuario.email };
    });
  }

  async update(id_usuario: bigint, dto: UpdateUsuarioDto) {
    await this.findOne(id_usuario);
    const usuario = await this.db.usuarios.update({ where: { id_usuario }, data: dto });
    return { id_usuario: Number(usuario.id_usuario), nome: usuario.nome, telefone: usuario.telefone };
  }

  async updateStatus(id_usuario: bigint, dto: UpdateStatusUsuarioDto) {
    await this.findOne(id_usuario);
    const usuario = await this.db.usuarios.update({
      where: { id_usuario },
      data: { status: dto.status },
    });
    return { id_usuario: Number(usuario.id_usuario), status: usuario.status };
  }
}
