import { IsInt, IsNumberString, Max, Min } from 'class-validator';

export class ComprarPontosDto {
  @IsNumberString()
  id_disciplina: string;

  @IsInt()
  @Min(1)
  @Max(10)
  quantidade_pontos: number;
}
