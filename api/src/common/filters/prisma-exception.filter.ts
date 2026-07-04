import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const httpException = this.mapException(exception);
    const response = host.switchToHttp().getResponse<Response>();
    response.status(httpException.getStatus()).json(httpException.getResponse());
  }

  private mapException(exception: Prisma.PrismaClientKnownRequestError) {
    switch (exception.code) {
      case 'P2002': {
        const target = (exception.meta?.target as string[] | undefined)?.join(', ');
        return new ConflictException(
          target ? `Já existe um registro com ${target} informado(s)` : 'Registro duplicado',
        );
      }
      case 'P2025':
        return new NotFoundException('Registro não encontrado');
      case 'P2003':
        return new BadRequestException('Referência inválida (chave estrangeira)');
      default:
        return new BadRequestException(`Erro de banco de dados (${exception.code})`);
    }
  }
}
