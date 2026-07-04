import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { RespostaQuestaoDto } from './resposta-questao.dto';

export class EntregarAtividadeDto {
  @IsOptional()
  @IsString()
  resposta_texto?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespostaQuestaoDto)
  respostas?: RespostaQuestaoDto[];
}
