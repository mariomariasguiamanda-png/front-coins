import { IsNumber, Min } from 'class-validator';

export class AvaliarQuestaoDto {
  @IsNumber()
  @Min(0)
  pontuacao: number;
}
