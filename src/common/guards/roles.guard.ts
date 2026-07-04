import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY, TipoUsuario } from '../decorators/roles.decorator';
import type { AuthUser } from '../types/auth-user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<TipoUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user: AuthUser }>();
    const user = request.user;

    if (!user || !requiredRoles.includes(user.tipo_usuario)) {
      throw new ForbiddenException(
        `Acesso restrito a: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
