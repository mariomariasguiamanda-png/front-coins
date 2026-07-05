import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePerfilProfessorDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  especialidade?: string;
}
