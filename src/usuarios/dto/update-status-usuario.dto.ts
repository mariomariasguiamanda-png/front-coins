import { IsIn } from 'class-validator';

export class UpdateStatusUsuarioDto {
  @IsIn(['ativo', 'inativo', 'bloqueado'])
  status: string;
}
