import { IsInt, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class AjusteMoedasDto {
  @IsNumberString()
  id_aluno: string;

  @IsNumberString()
  id_disciplina: string;

  @IsInt()
  quantidade: number;

  @IsString()
  @IsNotEmpty()
  motivo: string;
}
