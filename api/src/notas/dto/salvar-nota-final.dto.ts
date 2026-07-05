import { IsNumber, IsNumberString } from 'class-validator';

export class SalvarNotaFinalDto {
  @IsNumberString()
  id_aluno: string;

  @IsNumberString()
  id_disciplina: string;

  @IsNumber()
  nota_final: number;
}
