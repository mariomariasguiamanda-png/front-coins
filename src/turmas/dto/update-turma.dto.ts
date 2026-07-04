import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTurmaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsInt()
  ano_letivo?: number;

  @IsOptional()
  @IsInt()
  semestre?: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
