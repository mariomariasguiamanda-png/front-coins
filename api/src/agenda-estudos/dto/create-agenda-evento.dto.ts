import { IsBoolean, IsDateString, IsIn, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAgendaEventoDto {
  @IsString()
  @MaxLength(255)
  titulo: string;

  @IsDateString()
  data_estudo: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  assunto?: string;

  @IsIn(['revision', 'study', 'exam'])
  tipo: string;

  @IsOptional()
  @IsIn(['atividade', 'resumo'])
  link_type?: string;

  @IsOptional()
  @IsNumberString()
  disciplina_id?: string;

  @IsOptional()
  @IsNumberString()
  item_id?: string;

  @IsOptional()
  @IsBoolean()
  concluido?: boolean;
}
