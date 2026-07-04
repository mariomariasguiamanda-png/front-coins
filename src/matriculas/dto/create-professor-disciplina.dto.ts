import { IsInt, IsNumberString, IsOptional } from 'class-validator';

export class CreateProfessorDisciplinaDto {
  @IsNumberString()
  id_professor: string;

  @IsNumberString()
  id_disciplina: string;

  @IsOptional()
  @IsInt()
  semestre?: number;
}
