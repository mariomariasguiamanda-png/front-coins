import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';
import { DatabaseService } from '../database/database.service';
import { MailService } from '../common/mail/mail.service';
import type { AuthUser } from '../common/types/auth-user';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';

const RESET_TOKEN_VALIDADE_MS = 60 * 60 * 1000; // 1 hora

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private mailService: MailService,
  ) {}

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
      include: {
        alunos: { select: { id_aluno: true, foto_url: true } },
        professores: { select: { id_professor: true, foto_url: true } },
      },
    });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    return {
      id_usuario: Number(user.id_usuario),
      nome: user.nome,
      email: user.email,
      tipo_usuario: user.tipo_usuario,
      foto_url: user.alunos?.foto_url ?? user.professores?.foto_url ?? user.foto_url ?? null,
      id_aluno: user.alunos ? Number(user.alunos.id_aluno) : null,
      id_professor: user.professores ? Number(user.professores.id_professor) : null,
    };
  }

  async esqueciSenha(dto: EsqueciSenhaDto) {
    const user = await this.db.usuarios.findUnique({ where: { email: dto.email } });

    // Mensagem genérica sempre, para não revelar se o e-mail existe na base.
    const mensagemGenerica = {
      message: 'Se o e-mail existir, um link de redefinição foi enviado.',
    };

    if (!user) return mensagemGenerica;

    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');

    await this.db.usuarios.update({
      where: { id_usuario: user.id_usuario },
      data: {
        reset_token_hash: tokenHash,
        reset_token_expira_em: new Date(Date.now() + RESET_TOKEN_VALIDADE_MS),
      },
    });

    const frontendUrl = process.env.FRONTEND_URL?.split(',')[0] ?? 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/atualizar-senha?token=${token}`;
    await this.mailService.sendPasswordReset(user.email, resetUrl);

    return mensagemGenerica;
  }

  async redefinirSenha(dto: RedefinirSenhaDto) {
    const tokenHash = createHash('sha256').update(dto.token).digest('hex');

    const user = await this.db.usuarios.findFirst({
      where: {
        reset_token_hash: tokenHash,
        reset_token_expira_em: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    const hash = await bcrypt.hash(dto.nova_senha, 10);

    await this.db.usuarios.update({
      where: { id_usuario: user.id_usuario },
      data: {
        senha_hash: hash,
        reset_token_hash: null,
        reset_token_expira_em: null,
      },
    });

    return { message: 'Senha redefinida com sucesso' };
  }
}
