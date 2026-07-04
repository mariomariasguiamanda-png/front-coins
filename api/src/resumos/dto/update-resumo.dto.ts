import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateResumoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  titulo?: string;

  @IsOptional()
  @IsString()
  conteudo?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
