/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private db: DatabaseService) {}

  async register(data: any) {
    const existing = await this.db.usuarios.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('Email já em uso');
    }

    const hash = await bcrypt.hash(data.senha, 10);

    const user = await this.db.usuarios.create({
      data: {
        email: data.email,
        senha_hash: hash,
        nome: data.nome,
        tipo_usuario: data.tipo_usuario || 'aluno',
      },
    });

    const token = jwt.sign(
      {
        sub: user.id_usuario,
        email: user.email,
        tipo_usuario: user.tipo_usuario,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: (process.env.JWT_EXPIRATION || '24h') as any },
    );

    return {
      id_usuario: user.id_usuario,
      token,
    };
  }

  async login(data: any) {
    const user = await this.db.usuarios.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isValid = await bcrypt.compare(data.senha, user.senha_hash);

    if (!isValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = jwt.sign(
      {
        sub: user.id_usuario,
        email: user.email,
        tipo_usuario: user.tipo_usuario,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: (process.env.JWT_EXPIRATION || '24h') as any },
    );

    return {
      id_usuario: Number(user.id_usuario),
      nome: user.nome,
      tipo_usuario: user.tipo_usuario,
      token,
    };
  }

  async getMe(userId: bigint) {
    const user = await this.db.usuarios.findUnique({ where: { id_usuario: userId } });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    
    return {
      id_usuario: Number(user.id_usuario),
      nome: user.nome,
      email: user.email,
      tipo_usuario: user.tipo_usuario,
      foto_url: null,
    };
  }
}
