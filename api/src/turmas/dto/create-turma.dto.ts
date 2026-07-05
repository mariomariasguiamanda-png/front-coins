import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTurmaDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  turno?: string;

  @IsOptional()
  @IsInt()
  ano_letivo?: number;

  @IsOptional()
  @IsInt()
  semestre?: number;
}
