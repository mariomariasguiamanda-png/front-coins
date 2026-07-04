import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class RespostaQuestaoDto {
  @IsNumberString()
  id_questao: string;

  @IsString()
  @IsNotEmpty()
  resposta: string;
}
