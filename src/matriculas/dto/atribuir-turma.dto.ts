import { IsNumberString, IsOptional } from 'class-validator';

export class AtribuirTurmaDto {
  @IsOptional()
  @IsNumberString()
  id_turma?: string | null;
}
