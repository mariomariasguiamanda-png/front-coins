import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateVideoaulaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  titulo?: string;

  @IsOptional()
  @IsString()
  url_video?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  duracao_segundos?: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
