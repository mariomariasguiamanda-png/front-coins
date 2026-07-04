import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateResumoDto {
  @IsNumberString()
  id_disciplina: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  @IsString()
  conteudo?: string;
}
