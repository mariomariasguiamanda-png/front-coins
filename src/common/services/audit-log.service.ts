import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private db: DatabaseService) {}

  async registrar(
    id_usuario: number,
    acao: string,
    detalhes?: string,
    ip_address?: string,
  ) {
    try {
      await this.db.logs_auditoria.create({
        data: { id_usuario, acao, detalhes, ip_address },
      });
    } catch (err) {
      // Falha ao gravar log de auditoria nunca deve quebrar a requisição original.
      this.logger.error('Falha ao registrar log de auditoria', err as Error);
    }
  }

  async findAll(id_usuario?: bigint) {
    return this.db.logs_auditoria.findMany({
      where: { id_usuario },
      include: { usuarios: { select: { nome: true, tipo_usuario: true } } },
      orderBy: { criado_em: 'desc' },
      take: 300,
    });
  }
}
