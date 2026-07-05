import { IsInt, IsNotEmpty, IsNumberString, IsOptional, IsString, Min } from 'class-validator';

export class CreateVideoaulaDto {
  @IsNumberString()
  id_disciplina: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  url_video?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  duracao_segundos?: number;
}
