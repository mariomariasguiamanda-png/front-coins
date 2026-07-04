import type { TipoUsuario } from '../decorators/roles.decorator';

export interface AuthUser {
  sub: number;
  email: string;
  tipo_usuario: TipoUsuario;
  id_aluno?: number;
  id_professor?: number;
}
