import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { AuditLogService } from '../services/audit-log.service';
import type { AuthUser } from '../types/auth-user';

const METODOS_AUDITADOS = ['POST', 'PATCH', 'PUT', 'DELETE'];
const CAMPOS_SENSIVEIS = ['senha', 'senha_hash', 'token'];

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request & { user?: AuthUser }>();
    const user = request.user;

    const deveAuditar =
      user?.tipo_usuario === 'admin' && METODOS_AUDITADOS.includes(request.method);

    if (!deveAuditar) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        const bodySanitizado = { ...(request.body as Record<string, unknown>) };
        for (const campo of CAMPOS_SENSIVEIS) delete bodySanitizado[campo];

        void this.auditLogService.registrar(
          user!.sub,
          `${request.method} ${request.originalUrl ?? request.url}`,
          JSON.stringify(bodySanitizado),
          request.ip,
        );
      }),
    );
  }
}
