import { IsArray, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateResumoDto {
  @IsNumberString()
  id_disciplina: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  @IsString()
  conteudo?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  links?: string[];
}
