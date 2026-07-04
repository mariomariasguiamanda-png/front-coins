import { SetMetadata } from '@nestjs/common';

export type TipoUsuario = 'aluno' | 'professor' | 'admin';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: TipoUsuario[]) => SetMetadata(ROLES_KEY, roles);
