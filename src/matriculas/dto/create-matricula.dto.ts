import { IsNumberString } from 'class-validator';

export class CreateMatriculaDto {
  @IsNumberString()
  id_aluno: string;

  @IsNumberString()
  id_disciplina: string;
}
