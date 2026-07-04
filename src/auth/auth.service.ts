import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { DatabaseService } from '../database/database.service';
import type { AuthUser } from '../common/types/auth-user';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private db: DatabaseService) {}

  private signToken(payload: AuthUser): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.JWT_EXPIRATION || '24h') as jwt.SignOptions['expiresIn'],
    });
  }

  async register(dto: RegisterDto) {
    const existing = await this.db.usuarios.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email já em uso');
    }

    const hash = await bcrypt.hash(dto.senha, 10);

    const { user, id_aluno, id_professor } = await this.db.$transaction(async (tx) => {
      const user = await tx.usuarios.create({
        data: {
          email: dto.email,
          senha_hash: hash,
          nome: dto.nome,
          telefone: dto.telefone,
          tipo_usuario: dto.tipo_usuario,
        },
      });

      let id_aluno: bigint | undefined;
      let id_professor: bigint | undefined;

      if (dto.tipo_usuario === 'aluno') {
        const aluno = await tx.alunos.create({
          data: {
            id_usuario: user.id_usuario,
            matricula: dto.matricula as string,
          },
        });
        id_aluno = aluno.id_aluno;
      } else if (dto.tipo_usuario === 'professor') {
        const professor = await tx.professores.create({
          data: {
            id_usuario: user.id_usuario,
            especialidade: dto.especialidade,
          },
        });
        id_professor = professor.id_professor;
      }

      return { user, id_aluno, id_professor };
    });

    const token = this.signToken({
      sub: Number(user.id_usuario),
      email: user.email,
      tipo_usuario: dto.tipo_usuario,
      id_aluno: id_aluno !== undefined ? Number(id_aluno) : undefined,
      id_professor: id_professor !== undefined ? Number(id_professor) : undefined,
    });

    return {
      id_usuario: Number(user.id_usuario),
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.db.usuarios.findUnique({
      where: { email: dto.email },
      include: { alunos: true, professores: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isValid = await bcrypt.compare(dto.senha, user.senha_hash);

    if (!isValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.signToken({
      sub: Number(user.id_usuario),
      email: user.email,
      tipo_usuario: user.tipo_usuario as AuthUser['tipo_usuario'],
      id_aluno: user.alunos ? Number(user.alunos.id_aluno) : undefined,
      id_professor: user.professores ? Number(user.professores.id_professor) : undefined,
    });

    return {
      id_usuario: Number(user.id_usuario),
      nome: user.nome,
      tipo_usuario: user.tipo_usuario,
      token,
    };
  }

  async getMe(authUser: AuthUser) {
    const user = await this.db.usuarios.findUnique({
      where: { id_usuario: authUser.sub },
    });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    return {
      id_usuario: Number(user.id_usuario),
      nome: user.nome,
      email: user.email,
      tipo_usuario: user.tipo_usuario,
      // foto_url passa a vir de alunos.foto_url quando o módulo de Perfil (Fase 1) for implementado.
      foto_url: null,
    };
  }
}
