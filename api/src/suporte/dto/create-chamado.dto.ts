import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChamadoDto {
  @IsOptional()
  @IsString()
  assunto?: string;

  @IsString()
  @IsNotEmpty()
  mensagem: string;
}
